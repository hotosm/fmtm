import React, { useEffect, useState } from 'react';

import BasicDetails from '@/components/CreateProject/01-BasicDetails';
import ProjectDetails from '@/components/CreateProject/02-ProjectDetails';
import UploadSurvey from '@/components/CreateProject/03-UploadSurvey';
import MapData from '@/components/CreateProject/04-MapData';
import SplitTasks from '@/components/CreateProject/05-SplitTasks';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useHasManagedAnyOrganization, useIsAdmin } from '@/hooks/usePermissions';

import Forbidden from '@/views/Forbidden';
import Stepper from '@/components/CreateProject/Stepper';
import Button from '@/components/common/Button';
import AssetModules from '@/shared/AssetModules';
import Map from '@/components/CreateProject/Map';
import {
  createProjectValidationSchema,
  basicDetailsValidationSchema,
  mapDataValidationSchema,
  projectDetailsValidationSchema,
  splitTasksValidationSchema,
  uploadSurveyValidationSchema,
} from '@/components/CreateProject/validation';
import { z } from 'zod/v4';
import { useAppDispatch, useAppSelector } from '@/types/reduxTypes';
import {
  CreateDraftProjectService,
  CreateProjectService,
  GetBasicProjectDetails,
  OrganisationService,
} from '@/api/CreateProjectService';
import { defaultValues } from '@/components/CreateProject/constants/defaultValues';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import FormFieldSkeletonLoader from '@/components/Skeletons/common/FormFieldSkeleton';
import { CreateProjectActions } from '@/store/slices/CreateProjectSlice';
import { convertGeojsonToJsonFile, getDirtyFieldValues } from '@/utilfunctions';
import { data_extract_type, task_split_type } from '@/types/enums';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const validationSchema = {
  1: basicDetailsValidationSchema,
  2: projectDetailsValidationSchema,
  3: uploadSurveyValidationSchema,
  4: mapDataValidationSchema,
  5: splitTasksValidationSchema,
};

const CreateProject = () => {
  const isAdmin = useIsAdmin();
  const hasManagedAnyOrganization = useHasManagedAnyOrganization();

  if (!hasManagedAnyOrganization) return <Forbidden />;

  const dispatch = useAppDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const step = Number(searchParams.get('step'));

  const projectId = params.id ? +params.id : null;
  const [toggleEdit, setToggleEdit] = useState(false);
  const createDraftProjectLoading = useAppSelector((state) => state.createproject.createDraftProjectLoading);
  const createProjectLoading = useAppSelector((state) => state.createproject.createProjectLoading);
  const basicProjectDetails = useAppSelector((state) => state.createproject.basicProjectDetails);
  const basicProjectDetailsLoading = useAppSelector((state) => state.createproject.basicProjectDetailsLoading);

  useEffect(() => {
    if (step < 1 || step > 5 || !values.formExampleSelection) {
      setSearchParams({ step: '1' });
    }
  }, []);

  useEffect(() => {
    if (!projectId) return;
    dispatch(GetBasicProjectDetails(`${VITE_API_URL}/projects/${projectId}/minimal`));
  }, [projectId]);

  useEffect(() => {
    if (!basicProjectDetails || !projectId) return;
    reset({ ...defaultValues, ...basicProjectDetails });

    return () => {
      dispatch(CreateProjectActions.SetBasicProjectDetails(null));
    };
  }, [basicProjectDetails]);

  useEffect(() => {
    dispatch(
      OrganisationService(isAdmin ? `${VITE_API_URL}/organisation` : `${VITE_API_URL}/organisation/my-organisations`),
    );
  }, []);

  const formMethods = useForm<z.infer<typeof createProjectValidationSchema>>({
    defaultValues: defaultValues,
    resolver: zodResolver(validationSchema?.[step] || basicDetailsValidationSchema),
  });

  const { handleSubmit, watch, setValue, trigger, formState, reset, getValues } = formMethods;
  const { dirtyFields } = formState;
  const values = watch();

  const form = {
    1: <BasicDetails />,
    2: <ProjectDetails />,
    3: <UploadSurvey />,
    4: <MapData />,
    5: <SplitTasks />,
  };

  const createDraftProject = async (continueToNextStep: boolean) => {
    const isValidationSuccess = await trigger(undefined, { shouldFocus: true });

    if (!isValidationSuccess) return;
    const { name, short_description, description, organisation_id, project_admins, outline, uploadedAOIFile } = values;
    const payload = {
      name,
      short_description,
      description,
      organisation_id,
      outline,
      uploadedAOIFile,
    };
    const params = {
      org_id: organisation_id,
    };
    dispatch(
      CreateDraftProjectService(
        `${VITE_API_URL}/projects/stub`,
        payload,
        project_admins as string[],
        params,
        navigate,
        continueToNextStep,
      ),
    );
  };

  const createProject = async () => {
    const data = getValues();
    const { name, description, short_description } = data;

    // retrieve updated fields from basic details
    const dirtyValues = getDirtyFieldValues({ name, description, short_description }, dirtyFields);

    const projectData = {
      ...dirtyValues,
      visibility: data.visibility,
      hashtags: data.hashtags,
      custom_tms_url: data.custom_tms_url,
      per_task_instructions: data.per_task_instructions,
      use_odk_collect: data.use_odk_collect,
      osm_category: data.formExampleSelection,
      primary_geom_type: data.primaryGeomType,
      new_geom_type: data.newGeomType ? data.newGeomType : data.primaryGeomType,
      task_split_type: data.task_split_type,
      status: 'PUBLISHED',
    };

    if (data.task_split_type === task_split_type.TASK_SPLITTING_ALGORITHM) {
      projectData.task_num_buildings = data.average_buildings_per_task;
    } else {
      projectData.task_split_dimension = data.dimension;
    }

    const taskSplitGeojsonFile = convertGeojsonToJsonFile(
      data.splitGeojsonByAlgorithm || data.splitGeojsonBySquares || data.outline,
      'task',
    );
    const dataExtractGeojsonFile = convertGeojsonToJsonFile(data.dataExtractGeojson, 'extract');

    const file = { taskSplitGeojsonFile, dataExtractGeojsonFile, xlsFormFile: data.xlsFormFile?.file };
    const combinedFeaturesCount = data.dataExtractGeojson?.features?.length ?? 0;
    const isEmptyDataExtract = data.dataExtractType === data_extract_type.NONE;

    dispatch(
      CreateProjectService(
        `${VITE_API_URL}/projects?project_id=${projectId}`,
        data.id as number,
        projectData,
        file,
        combinedFeaturesCount,
        isEmptyDataExtract,
        navigate,
      ),
    );
  };

  const onSubmit = () => {
    if (step === 1 && !projectId) {
      createDraftProject(true);
      return;
    }
    if (step === 5) createProject();

    if (step < 5) setSearchParams({ step: (step + 1).toString() });
  };

  return (
    <div className="fmtm-w-full fmtm-h-full">
      <div className="fmtm-flex fmtm-items-center fmtm-justify-between fmtm-w-full">
        <h5>CREATE NEW PROJECT</h5>
        <AssetModules.CloseIcon className="!fmtm-text-xl hover:fmtm-text-red-medium" />
      </div>

      <div className="sm:fmtm-grid fmtm-grid-rows-[auto_1fr] lg:fmtm-grid-rows-1 fmtm-grid-cols-12 fmtm-w-full fmtm-h-[calc(100%-2.344rem)] fmtm-gap-2 lg:fmtm-gap-5 fmtm-mt-3">
        {/* stepper container */}
        <div className="fmtm-col-span-12 lg:fmtm-col-span-3 fmtm-h-fit lg:fmtm-h-full fmtm-bg-white fmtm-rounded-xl">
          <Stepper step={step} toggleStep={(value) => setSearchParams({ step: value.toString() })} />
        </div>

        {/* form container */}
        <FormProvider {...formMethods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="fmtm-flex fmtm-flex-col fmtm-col-span-12 sm:fmtm-col-span-7 lg:fmtm-col-span-5 sm:fmtm-h-full fmtm-overflow-y-hidden fmtm-rounded-xl fmtm-bg-white fmtm-my-2 sm:fmtm-my-0"
          >
            <div className="fmtm-flex-1 fmtm-overflow-y-scroll scrollbar fmtm-px-10 fmtm-py-8">
              {basicProjectDetailsLoading && projectId ? <FormFieldSkeletonLoader count={4} /> : form?.[step]}
            </div>

            {/* buttons */}
            <div className="fmtm-flex fmtm-justify-between fmtm-items-center fmtm-px-5 fmtm-py-3 fmtm-shadow-2xl">
              {step > 1 && (
                <Button
                  variant="link-grey"
                  onClick={() => setSearchParams({ step: (step - 1).toString() })}
                  disabled={createProjectLoading || basicProjectDetailsLoading}
                >
                  <AssetModules.ArrowBackIosIcon className="!fmtm-text-sm" /> Previous
                </Button>
              )}
              {createDraftProjectLoading ? (
                <div className="fmtm-w-full fmtm-flex fmtm-justify-center">
                  <Button
                    variant="secondary-grey"
                    disabled={createProjectLoading}
                    isLoading={createDraftProjectLoading}
                  >
                    Saving as Draft
                  </Button>
                </div>
              ) : (
                <>
                  {step === 1 &&
                    (!projectId ? (
                      <Button
                        variant="secondary-grey"
                        onClick={() => createDraftProject(false)}
                        isLoading={createDraftProjectLoading}
                        disabled={createProjectLoading || basicProjectDetailsLoading}
                      >
                        Save as Draft
                      </Button>
                    ) : (
                      <span></span>
                    ))}
                  <Button
                    variant="primary-grey"
                    type="submit"
                    disabled={createDraftProjectLoading || basicProjectDetailsLoading}
                    isLoading={createDraftProjectLoading || createProjectLoading}
                  >
                    {step === 5 ? 'Submit' : 'Next'}
                    <AssetModules.ArrowForwardIosIcon className="!fmtm-text-sm !fmtm-ml-auto" />
                  </Button>
                </>
              )}
            </div>
          </form>
        </FormProvider>

        {/* map container */}
        <div className="fmtm-col-span-12 sm:fmtm-col-span-5 lg:fmtm-col-span-4 fmtm-h-[20rem] sm:fmtm-h-full fmtm-rounded-xl fmtm-bg-white fmtm-overflow-hidden">
          <Map
            drawToggle={values.uploadAreaSelection === 'draw' && step === 1}
            uploadedOrDrawnGeojsonFile={values.outline}
            buildingExtractedGeojson={values.dataExtractGeojson}
            splittedGeojson={values.splitGeojsonBySquares || values.splitGeojsonByAlgorithm}
            onDraw={
              values.outline || values.uploadAreaSelection === 'upload_file'
                ? null
                : (geojson, area) => {
                    setValue('outline', JSON.parse(geojson));
                    setValue('uploadedAOIFile', undefined);
                  }
            }
            onModify={
              toggleEdit && values.outline && step === 1
                ? (geojson, area) => {
                    setValue('outline', JSON.parse(geojson));

                    if (values.customDataExtractFile) setValue('customDataExtractFile', null);
                    if (values.dataExtractGeojson) setValue('dataExtractGeojson', null);

                    if (values.splitGeojsonBySquares) setValue('splitGeojsonBySquares', null);
                    if (values.splitGeojsonByAlgorithm) setValue('splitGeojsonByAlgorithm', null);
                  }
                : null
            }
            toggleEdit={toggleEdit}
            setToggleEdit={setToggleEdit}
            getAOIArea={(area) => {
              if (values.outline && area !== values.outlineArea) setValue('outlineArea', area);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
