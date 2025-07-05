import React, { useState } from 'react';
import axios from 'axios';
import { z } from 'zod/v4';
import { Controller, useFormContext } from 'react-hook-form';
import { geojson as fgbGeojson } from 'flatgeobuf';
import { valid } from 'geojson-validation';
import type { FeatureCollection } from 'geojson';

import { newGeomOptions, primaryGeomOptions } from './constants';
import { CommonActions } from '@/store/slices/CommonSlice';
import { dataExtractGeojsonType } from '@/store/types/ICreateProject';
import { convertFileToGeojson } from '@/utilfunctions/convertFileToGeojson';
import { data_extract_type, GeoGeomTypesEnum, task_split_type } from '@/types/enums';
import { useAppDispatch } from '@/types/reduxTypes';
import { fileType } from '@/store/types/ICommon';
import { createProjectValidationSchema } from './validation';

import FieldLabel from '@/components/common/FieldLabel';
import RadioButton from '@/components/common/RadioButton';
import Switch from '@/components/common/Switch';
import Button from '@/components/common/Button';
import UploadArea from '@/components/common/UploadArea';
import ErrorMessage from '@/components/common/ErrorMessage';
import { CreateProjectActions } from '@/store/slices/CreateProjectSlice';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const MapData = () => {
  const dispatch = useAppDispatch();

  const form = useFormContext<z.infer<typeof createProjectValidationSchema>>();
  const { watch, control, setValue, formState } = form;
  const { errors } = formState;
  const values = watch();

  const [fetchingOSMData, setFetchingOSMData] = useState(false);

  const dataExtractOptions = [
    {
      name: 'data_extract',
      value: data_extract_type.OSM,
      label: 'Fetch data from OSM',
      disabled: values.primaryGeomType === 'POLYLINE',
    },
    { name: 'data_extract', value: data_extract_type.CUSTOM, label: 'Upload custom map data' },
    { name: 'data_extract', value: data_extract_type.NONE, label: 'No existing data' },
  ];

  const changeFileHandler = async (file: fileType, fileInputRef: React.RefObject<HTMLInputElement | null>) => {
    if (!file) {
      resetMapDataFile();
      return;
    }
    if (values.splitGeojsonByAlgorithm) {
      dispatch(CreateProjectActions.GetTaskSplittingPreview(null));
      setValue('splitGeojsonByAlgorithm', null);
    }

    const uploadedFile = file?.file;
    const fileType = uploadedFile.name.split('.').pop();

    // Handle geojson and fgb types, return featurecollection geojson
    let extractFeatCol;
    if (fileType && ['json', 'geojson'].includes(fileType)) {
      // already geojson format, so we simply append
      setValue('customDataExtractFile', file);
      extractFeatCol = await convertFileToGeojson(uploadedFile);
    } else if (fileType && ['fgb'].includes(fileType)) {
      // deserialise the fgb --> geojson for upload
      const arrayBuffer = new Uint8Array(await uploadedFile.arrayBuffer());
      extractFeatCol = fgbGeojson.deserialize(arrayBuffer);
      // Set converted geojson to state for splitting
      const geojsonFromFgbFile = {
        ...file,
        file: new File([JSON.stringify(extractFeatCol)], 'custom_extract.geojson', { type: 'application/json' }),
      };
      setValue('customDataExtractFile', geojsonFromFgbFile);
    }

    validateDataExtractGeojson(extractFeatCol, fileInputRef);
  };

  const resetMapDataFile = () => {
    setValue('customDataExtractFile', null);
    setValue('dataExtractGeojson', null);
    if (values.task_split_type === task_split_type.TASK_SPLITTING_ALGORITHM) {
      dispatch(CreateProjectActions.GetTaskSplittingPreview(null));
      setValue('task_split_type', null);
      setValue('splitGeojsonByAlgorithm', null);
    }
  };

  const validateDataExtractGeojson = (
    extractFeatCol: FeatureCollection<null, Record<string, any>>,
    fileInputRef: React.RefObject<HTMLInputElement | null>,
  ) => {
    const isGeojsonValid = valid(extractFeatCol, true);
    if (isGeojsonValid?.length === 0 && extractFeatCol) {
      setValue('dataExtractGeojson', { ...extractFeatCol, id: values.primaryGeomType });
    } else {
      resetMapDataFile();
      if (fileInputRef.current) fileInputRef.current.value = '';
      dispatch(
        CommonActions.SetSnackBar({
          message: `The uploaded GeoJSON is invalid and contains the following errors: ${isGeojsonValid?.map((error) => `\n${error}`)}`,
          duration: 10000,
        }),
      );
    }
  };

  // Create a File object from the geojson Blob
  const getFileFromGeojson = (geojson) => {
    const geojsonBlob = new Blob([JSON.stringify(geojson)], { type: 'application/json' });
    return new File([geojsonBlob], 'data.geojson', { type: 'application/json' });
  };

  // Generate OSM data extract
  const generateDataExtract = async () => {
    const dataExtractRequestFormData = new FormData();
    const projectAoiGeojsonFile = getFileFromGeojson(values.outline);

    dataExtractRequestFormData.append('geojson_file', projectAoiGeojsonFile);
    dataExtractRequestFormData.append('osm_category', values.formExampleSelection);
    dataExtractRequestFormData.append('geom_type', values.primaryGeomType as GeoGeomTypesEnum);
    if (values.primaryGeomType == GeoGeomTypesEnum.POINT)
      dataExtractRequestFormData.append('centroid', values.includeCentroid ? 'true' : 'false');

    setFetchingOSMData(true);
    try {
      const response = await axios.post(`${VITE_API_URL}/projects/generate-data-extract`, dataExtractRequestFormData, {
        params: { project_id: values.id },
      });

      const dataExtractGeojsonUrl = response.data.url;

      // Extract fgb and set geojson to map
      const geojsonExtractFile = await fetch(dataExtractGeojsonUrl);
      const geojsonExtract = await geojsonExtractFile.json();
      if ((geojsonExtract && (geojsonExtract as dataExtractGeojsonType))?.features?.length > 0) {
        setValue('dataExtractGeojson', { ...geojsonExtract, id: values.primaryGeomType });
      } else {
        dispatch(
          CommonActions.SetSnackBar({
            message: 'Map has no features. Please try adjusting the map area.',
          }),
        );
      }
      if (values.splitGeojsonByAlgorithm) {
        dispatch(CreateProjectActions.GetTaskSplittingPreview(null));
        setValue('splitGeojsonByAlgorithm', null);
      }
    } catch (error) {
      dispatch(
        CommonActions.SetSnackBar({
          message: 'Error generating map data',
        }),
      );
    } finally {
      setFetchingOSMData(false);
    }
  };

  return (
    <div className="fmtm-flex fmtm-flex-col fmtm-gap-[1.125rem] fmtm-w-full">
      <div className="fmtm-flex fmtm-flex-col fmtm-gap-1">
        <FieldLabel label="What type of geometry do you wish to map?" astric />
        <Controller
          control={control}
          name="primaryGeomType"
          render={({ field }) => (
            <RadioButton
              value={field.value || ''}
              options={primaryGeomOptions}
              onChangeData={(value) => {
                field.onChange(value);
                if (value === GeoGeomTypesEnum.POLYLINE) setValue('dataExtractType', null);
              }}
              ref={field.ref}
            />
          )}
        />
        {errors?.primaryGeomType?.message && <ErrorMessage message={errors.primaryGeomType.message as string} />}
      </div>

      {values.primaryGeomType === GeoGeomTypesEnum.POINT && (
        <div className="fmtm-flex fmtm-items-center fmtm-gap-2">
          <FieldLabel label="Include polygon centroids" />
          <Controller
            control={control}
            name="includeCentroid"
            render={({ field }) => (
              <Switch ref={field.ref} checked={field.value} onCheckedChange={field.onChange} className="" />
            )}
          />
        </div>
      )}

      <div className="fmtm-flex fmtm-items-center fmtm-gap-2">
        <FieldLabel label="I want to use a mix of geometry types" />
        <Controller
          control={control}
          name="useMixedGeomTypes"
          render={({ field }) => (
            <Switch
              ref={field.ref}
              checked={field.value}
              onCheckedChange={(value) => {
                field.onChange(value);
                setValue('newGeomType', null);
              }}
              className=""
            />
          )}
        />
      </div>

      {values.useMixedGeomTypes && (
        <div className="fmtm-flex fmtm-flex-col fmtm-gap-1">
          <FieldLabel label="New geometries collected should be of type" astric />
          <Controller
            control={control}
            name="newGeomType"
            render={({ field }) => (
              <RadioButton
                value={field.value || ''}
                options={newGeomOptions}
                onChangeData={field.onChange}
                ref={field.ref}
              />
            )}
          />
          {errors?.newGeomType?.message && <ErrorMessage message={errors.newGeomType.message as string} />}
        </div>
      )}

      {values.primaryGeomType && (
        <div className="fmtm-flex fmtm-flex-col fmtm-gap-1">
          <FieldLabel label="Upload your own map data or use OSM" astric />
          <Controller
            control={control}
            name="dataExtractType"
            render={({ field }) => (
              <RadioButton
                value={field.value || ''}
                options={dataExtractOptions}
                onChangeData={(value) => {
                  field.onChange(value);
                  if (value === data_extract_type.NONE) resetMapDataFile();
                }}
                ref={field.ref}
              />
            )}
          />
          {errors?.dataExtractType?.message && <ErrorMessage message={errors.dataExtractType.message as string} />}
        </div>
      )}

      {values.dataExtractType === 'osm_data_extract' && (
        <div className="fmtm-flex fmtm-flex-col fmtm-gap-1">
          <Button
            variant="primary-red"
            onClick={() => {
              resetMapDataFile();
              generateDataExtract();
            }}
            isLoading={fetchingOSMData}
          >
            Fetch OSM Data
          </Button>
          {errors?.dataExtractGeojson?.message && (
            <ErrorMessage message={errors.dataExtractGeojson.message as string} />
          )}
        </div>
      )}

      {values.dataExtractType === 'custom_data_extract' && (
        <div className="fmtm-flex fmtm-flex-col fmtm-gap-1">
          <FieldLabel label="Upload Map Data" astric />
          <UploadArea
            title=""
            label="The supported file formats are .geojson, .json, .fgb"
            data={values.customDataExtractFile ? [values.customDataExtractFile] : []}
            onUploadFile={(updatedFiles, fileInputRef) => {
              changeFileHandler(updatedFiles?.[0] as fileType, fileInputRef);
            }}
            acceptedInput=".geojson,.json,.fgb"
          />
          {errors?.customDataExtractFile?.message && (
            <ErrorMessage message={errors.customDataExtractFile.message as string} />
          )}
        </div>
      )}

      {values.dataExtractGeojson && (
        <p className="fmtm-text-gray-500 fmtm-text-sm">
          Total number of features:{' '}
          <span className="fmtm-font-bold">{values.dataExtractGeojson?.features?.length || 0}</span>
        </p>
      )}
    </div>
  );
};

export default MapData;
