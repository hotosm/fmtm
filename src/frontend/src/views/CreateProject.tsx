import React, { useState } from 'react';

import BasicDetails from '@/components/CreateProject/01-BasicDetails';
import ProjectDetails from '@/components/CreateProject/02-ProjectDetails';
import UploadSurvey from '@/components/CreateProject/03-UploadSurvey';
import MapData from '@/components/CreateProject/04-MapData';
import SplitTasks from '@/components/CreateProject/05-SplitTasks';

import { useHasManagedAnyOrganization } from '@/hooks/usePermissions';

import Forbidden from '@/views/Forbidden';
import Stepper from '@/components/CreateProject/Stepper';
import Button from '@/components/common/Button';
import AssetModules from '@/shared/AssetModules';
import Map from '@/components/CreateProject/Map';

const CreateProject = () => {
  const hasManagedAnyOrganization = useHasManagedAnyOrganization();
  if (!hasManagedAnyOrganization) return <Forbidden />;
  const [step, setStep] = useState(1);

  const fields = {
    1: <BasicDetails />,
    2: <ProjectDetails />,
    3: <UploadSurvey />,
    4: <MapData />,
    5: <SplitTasks />,
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
        <div className="fmtm-flex fmtm-flex-col fmtm-col-span-12 sm:fmtm-col-span-7 lg:fmtm-col-span-5 sm:fmtm-h-full fmtm-overflow-y-hidden fmtm-rounded-xl fmtm-bg-white fmtm-my-2 sm:fmtm-my-0">
          <div className="fmtm-flex-1 fmtm-overflow-y-scroll scrollbar fmtm-px-10 fmtm-py-8">{fields[step]}</div>

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
            <Button variant="primary-grey" onClick={() => setStep(step + 1)}>
              {step === 5 ? 'Submit' : 'Next'} <AssetModules.ArrowForwardIosIcon className="!fmtm-text-sm" />
            </Button>
          </div>
        </div>

        {/* map container */}
        <div className="fmtm-col-span-12 sm:fmtm-col-span-5 lg:fmtm-col-span-4 fmtm-h-[20rem] sm:fmtm-h-full fmtm-rounded-xl fmtm-bg-white">
          <Map />
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
