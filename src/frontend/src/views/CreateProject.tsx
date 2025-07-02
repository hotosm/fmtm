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
import { CreateDraftProjectService, GetBasicProjectDetails, OrganisationService } from '@/api/CreateProjectService';
import { defaultValues } from '@/components/CreateProject/constants/defaultValues';
import { useParams } from 'react-router-dom';

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

  const projectId = params.id ? +params.id : null;
  const [step, setStep] = useState(1);
  const [toggleEdit, setToggleEdit] = useState(false);
  const createDraftProjectLoading = useAppSelector((state) => state.createproject.createDraftProjectLoading);
  const basicProjectDetails = useAppSelector((state) => state.createproject.basicProjectDetails);

  useEffect(() => {
    if (!projectId) return;
    dispatch(GetBasicProjectDetails(`${VITE_API_URL}/projects/${projectId}/minimal`));
  }, [projectId]);

  useEffect(() => {
    if (!basicProjectDetails) return;
    reset({ ...defaultValues, ...basicProjectDetails });
  }, [basicProjectDetails]);

  useEffect(() => {
    dispatch(
      OrganisationService(isAdmin ? `${VITE_API_URL}/organisation` : `${VITE_API_URL}/organisation/my-organisations`),
    );
  }, []);

  const formMethods = useForm<z.infer<typeof createProjectValidationSchema>>({
    defaultValues: defaultValues,
    resolver: zodResolver(validationSchema[step]),
  });

  const { handleSubmit, watch, setValue, trigger, formState, reset } = formMethods;
  const { dirtyFields } = formState;
  const values = watch();

  const form = {
    1: <BasicDetails />,
    2: <ProjectDetails />,
    3: <UploadSurvey />,
    4: <MapData />,
    5: <SplitTasks />,
  };

  const onSubmit = (data: z.infer<typeof createProjectValidationSchema>) => {
    if (step < 5) setStep(step + 1);
  };

  const createDraftProject = async () => {
    const isValidationSuccess = await trigger(undefined, { shouldFocus: true });

    if (!isValidationSuccess) return;
    const { name, short_description, description, organisation_id, project_admins, outline, uploadedAOIFile } = values;
    const payload = {
      name,
      short_description,
      description,
      organisation_id,
      project_admins,
      outline,
      uploadedAOIFile,
    };
    const params = {
      org_id: organisation_id,
    };
    dispatch(CreateDraftProjectService(`${VITE_API_URL}/projects/stub`, payload, params));
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
          <Stepper step={step} toggleStep={setStep} />
        </div>

        {/* form container */}
        <FormProvider {...formMethods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="fmtm-flex fmtm-flex-col fmtm-col-span-12 sm:fmtm-col-span-7 lg:fmtm-col-span-5 sm:fmtm-h-full fmtm-overflow-y-hidden fmtm-rounded-xl fmtm-bg-white fmtm-my-2 sm:fmtm-my-0"
          >
            <div className="fmtm-flex-1 fmtm-overflow-y-scroll scrollbar fmtm-px-10 fmtm-py-8">{form[step]}</div>

            {/* buttons */}
            <div className="fmtm-flex fmtm-justify-between fmtm-items-center fmtm-px-5 fmtm-py-3 fmtm-shadow-2xl">
              {step === 1 &&
                (!projectId ? (
                  <Button variant="secondary-grey" onClick={createDraftProject} isLoading={createDraftProjectLoading}>
                    Save as Draft
                  </Button>
                ) : (
                  <span></span>
                ))}
              {step > 1 && (
                <Button variant="link-grey" onClick={() => setStep(step - 1)}>
                  <AssetModules.ArrowBackIosIcon className="!fmtm-text-sm" /> Previous
                </Button>
              )}
              <Button variant="primary-grey" type="submit">
                {step === 5 ? 'Submit' : 'Next'}{' '}
                <AssetModules.ArrowForwardIosIcon className="!fmtm-text-sm !fmtm-ml-auto" />
              </Button>
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
