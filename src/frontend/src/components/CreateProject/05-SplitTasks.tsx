import React, { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { task_split_type } from '@/types/enums';
import { taskSplitOptionsType } from '@/store/types/ICreateProject';
import { useAppDispatch, useAppSelector } from '@/types/reduxTypes';
import { GetDividedTaskFromGeojson, TaskSplittingPreviewService } from '@/api/CreateProjectService';
import { createProjectValidationSchema } from './validation';
import { z } from 'zod/v4';

import FieldLabel from '@/components/common/FieldLabel';
import RadioButton from '@/components/common/RadioButton';
import { Input } from '@/components/RadixComponents/Input';
import Button from '@/components/common/Button';
import AssetModules from '@/shared/AssetModules';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const SplitTasks = () => {
  const dispatch = useAppDispatch();

  const splitGeojsonBySquares = useAppSelector((state) => state.createproject.splitGeojsonBySquares);
  const splitGeojsonByAlgorithm = useAppSelector((state) => state.createproject.splitGeojsonByAlgorithm);
  const dividedTaskLoading = useAppSelector((state) => state.createproject.dividedTaskLoading);
  const taskSplittingGeojsonLoading = useAppSelector((state) => state.createproject.taskSplittingGeojsonLoading);

  const form = useFormContext<z.infer<typeof createProjectValidationSchema>>();
  const { watch, control, register, setValue } = form;
  const values = watch();

  const taskSplitOptions: taskSplitOptionsType[] = [
    {
      name: 'define_tasks',
      value: task_split_type.DIVIDE_ON_SQUARE,
      label: 'Divide into square tasks',
      disabled: false,
    },
    {
      name: 'define_tasks',
      value: task_split_type.CHOOSE_AREA_AS_TASK,
      label: 'Use uploaded AOI as task areas',
      disabled: false,
    },
    {
      name: 'define_tasks',
      value: task_split_type.TASK_SPLITTING_ALGORITHM,
      label: 'Task Splitting Algorithm',
      disabled: !values.dataExtractGeojson?.features?.length || values.primaryGeomType === 'POLYLINE',
    },
  ];

  const generateTaskBasedOnSelection = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Create a file object from the project area Blob
    const projectAreaBlob = new Blob([JSON.stringify(values.outline)], { type: 'application/json' });
    const drawnGeojsonFile = new File([projectAreaBlob], 'outline.json', { type: 'application/json' });

    // Create a file object from the data extract Blob
    const dataExtractBlob = new Blob([JSON.stringify(values.dataExtractGeojson)], { type: 'application/json' });
    const dataExtractFile = new File([dataExtractBlob], 'extract.json', { type: 'application/json' });

    if (values.task_split_type === task_split_type.DIVIDE_ON_SQUARE) {
      dispatch(
        GetDividedTaskFromGeojson(`${VITE_API_URL}/projects/preview-split-by-square`, {
          geojson: drawnGeojsonFile,
          extract_geojson: values.dataExtractType === 'osm_data_extract' ? null : dataExtractFile,
          dimension: values?.dimension,
        }),
      );
    } else if (values.task_split_type === task_split_type.TASK_SPLITTING_ALGORITHM) {
      dispatch(
        TaskSplittingPreviewService(
          `${VITE_API_URL}/projects/task-split`,
          drawnGeojsonFile,
          values?.average_buildings_per_task,
          values.dataExtractType === 'osm_data_extract' ? null : dataExtractFile,
        ),
      );
    }
  };

  const downloadSplittedGeojson = (geojson) => {
    const blob = new Blob([JSON.stringify(geojson)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'task_splitted_geojson.geojson';
    a.click();
  };

  useEffect(() => {
    setValue('splitGeojsonBySquares', splitGeojsonBySquares);
  }, [splitGeojsonBySquares]);

  useEffect(() => {
    setValue('splitGeojsonByAlgorithm', splitGeojsonByAlgorithm);
  }, [splitGeojsonByAlgorithm]);

  return (
    <div className="fmtm-flex fmtm-flex-col fmtm-gap-[1.125rem] fmtm-w-full">
      <div>
        <FieldLabel label="New geometries collected should be of type" astric className="fmtm-mb-1" />
        <Controller
          control={control}
          name="task_split_type"
          render={({ field }) => (
            <RadioButton value={field.value} options={taskSplitOptions} onChangeData={field.onChange} ref={field.ref} />
          )}
        />
      </div>

      <div>
        <p className="fmtm-text-gray-500">
          Total number of features:{' '}
          <span className="fmtm-font-bold">{values.dataExtractGeojson?.features?.length || 0}</span>
        </p>
      </div>

      {values.task_split_type === task_split_type.DIVIDE_ON_SQUARE && (
        <div className="fmtm-flex fmtm-items-center fmtm-gap-2">
          <FieldLabel label="Dimension of square in metres:" />
          <Input {...register('dimension', { valueAsNumber: true })} className="fmtm-w-20" type="number" />
        </div>
      )}

      {values.task_split_type === task_split_type.TASK_SPLITTING_ALGORITHM && (
        <div className="fmtm-flex fmtm-items-center fmtm-gap-2">
          <FieldLabel label="Average number of buildings per task:" />
          <Input {...register('average_buildings_per_task', { valueAsNumber: true })} className="fmtm-w-20" />
        </div>
      )}

      {[task_split_type.DIVIDE_ON_SQUARE, task_split_type.TASK_SPLITTING_ALGORITHM].includes(
        values.task_split_type,
      ) && (
        <div className="fmtm-flex fmtm-items-center fmtm-gap-4">
          <Button
            variant="primary-red"
            isLoading={dividedTaskLoading || taskSplittingGeojsonLoading}
            onClick={generateTaskBasedOnSelection}
            disabled={
              (values.task_split_type === task_split_type.DIVIDE_ON_SQUARE && !values.dimension) ||
              (values.task_split_type === task_split_type.TASK_SPLITTING_ALGORITHM &&
                !values.average_buildings_per_task)
                ? true
                : false
            }
          >
            Click to generate task
            <AssetModules.SettingsIcon />
          </Button>
        </div>
      )}

      {values.task_split_type && (
        <div>
          <p className="fmtm-text-gray-500 fmtm-text-sm">
            Total number of task:{' '}
            <span className="fmtm-font-bold">
              {values.dividedTaskGeojson?.features?.length || values.outline?.features?.length || 1}
            </span>
          </p>
          {values.dividedTaskGeojson && (
            <Button variant="link-grey" onClick={() => downloadSplittedGeojson(values.dividedTaskGeojson)}>
              <AssetModules.FileDownloadOutlinedIcon />
              Download split geojson
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SplitTasks;
