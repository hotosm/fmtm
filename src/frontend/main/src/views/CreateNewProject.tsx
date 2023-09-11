import StepSwitcher from '../components/common/StepSwitcher';
import CreateProjectHeader from '../components/createnewproject/CreateProjectHeader';
import React from 'react';
import { createProjectSteps } from '../constants/StepFormConstants';
import CoreModules from '../shared/CoreModules.js';
import ProjectDetailsForm from '../components/createnewproject/ProjectDetailsForm';

const CreateNewProject = () => {
  const currentStep = CoreModules.useAppSelector((state) => state.common.currentStepFormStep.create_project);
  console.log(currentStep.step);
  const getCreteProjectContent = () => {
    switch (currentStep.step) {
      case 1:
        return <ProjectDetailsForm />;
      default:
        console.log('haha');
    }
  };
  return (
    <div>
      <CreateProjectHeader />
      <div className="fmtm-min-h-[72vh] fmtm-bg-gray-100 fmtm-box-border fmtm-border-[1px] fmtm-border-t-white fmtm-border-t-[0px]">
        <div className=" fmtm-w-full">
          <div>
            <StepSwitcher data={createProjectSteps} flag={'create_project'} />
          </div>
        </div>
        <div>{(() => getCreteProjectContent())()}</div>
      </div>
    </div>
  );
};

export default CreateNewProject;
