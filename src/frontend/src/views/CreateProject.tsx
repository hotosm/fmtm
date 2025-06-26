import React, { use, useEffect, useState } from 'react';

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
  basicDetailsValidationSchema,
  createProjectValidationSchema,
  mapDataValidationSchema,
  projectDetailsValidationSchema,
  splitTasksValidationSchema,
  uploadSurveyValidationSchema,
} from '@/components/CreateProject/validation';
import { z } from 'zod';
import { project_visibility } from '@/types/enums';
import { useAppDispatch } from '@/types/reduxTypes';
import { OrganisationService } from '@/api/CreateProjectService';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const defaultValues: z.infer<typeof createProjectValidationSchema> = {
  // 01 Basic Details
  name: '',
  short_description: '',
  description: '',
  organisation_id: null,
  useDefaultODKCredentials: false,
  odk_central_url: '',
  odk_central_user: '',
  odk_central_password: '',
  project_admins: [],
  per_task_instructions: '',
  AOIGeojson: undefined,
  AOIArea: undefined,
  uploadAreaSelection: '',
  uploadedAOIFile: undefined,

  visibility: project_visibility.PUBLIC,
  hashtags: [],
  hasCustomTMS: false,
  custom_tms_url: '',
  use_odk_collect: false,
};

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
  const [step, setStep] = useState(1);
  const [toggleEdit, setToggleEdit] = useState(false);

  useEffect(() => {
    dispatch(
      OrganisationService(isAdmin ? `${VITE_API_URL}/organisation` : `${VITE_API_URL}/organisation/my-organisations`),
    );
  }, []);

  const formMethods = useForm<z.infer<typeof createProjectValidationSchema>>({
    defaultValues: defaultValues,
    resolver: zodResolver(validationSchema[step]),
  });

  const { handleSubmit, formState, watch, setValue } = formMethods;
  const values = watch();

  const form = {
    1: <BasicDetails />,
    2: <ProjectDetails />,
    3: <UploadSurvey />,
    4: <MapData />,
    5: <SplitTasks />,
  };

  const onSubmit = (data) => {
    setStep(step + 1);
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
              {step === 1 && (
                <Button variant="secondary-grey" onClick={() => {}}>
                  Save as Draft
                </Button>
              )}
              {step > 1 && (
                <Button variant="link-grey" onClick={() => setStep(step - 1)}>
                  <AssetModules.ArrowBackIosIcon className="!fmtm-text-sm" /> Previous
                </Button>
              )}
              <Button variant="primary-grey" type="submit">
                {step === 5 ? 'Submit' : 'Next'} <AssetModules.ArrowForwardIosIcon className="!fmtm-text-sm" />
              </Button>
            </div>
          </form>
        </FormProvider>

        {/* map container */}
        <div className="fmtm-col-span-12 sm:fmtm-col-span-5 lg:fmtm-col-span-4 fmtm-h-[20rem] sm:fmtm-h-full fmtm-rounded-xl fmtm-bg-white fmtm-overflow-hidden">
          <Map
            drawToggle={values.uploadAreaSelection === 'draw' && step === 1}
            uploadedOrDrawnGeojsonFile={values.AOIGeojson}
            onDraw={
              values.AOIGeojson || values.uploadAreaSelection === 'upload_file'
                ? null
                : (geojson, area) => {
                    setValue('AOIGeojson', JSON.parse(geojson));
                    setValue('uploadedAOIFile', undefined);
                  }
            }
            onModify={
              toggleEdit && values.AOIGeojson && step === 1
                ? (geojson, area) => {
                    setValue('AOIGeojson', JSON.parse(geojson));

                    // RESET STATES OF OTHER STEPS
                    // handleCustomChange('drawnGeojson', geojson);
                    // dispatch(CreateProjectActions.SetDrawnGeojson(JSON.parse(geojson)));
                    // dispatch(CreateProjectActions.SetTotalAreaSelection(area));
                    // dispatch(CreateProjectActions.ClearProjectStepState(formValues));
                    // setCustomDataExtractUpload(null);
                  }
                : null
            }
            toggleEdit={toggleEdit}
            setToggleEdit={setToggleEdit}
            getAOIArea={(area) => {
              if (values.AOIGeojson && area !== values.AOIArea) setValue('AOIArea', area);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
