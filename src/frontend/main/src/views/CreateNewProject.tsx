import StepSwitcher from '../components/common/StepSwitcher';
import CreateProjectHeader from '../components/createnewproject/CreateProjectHeader';
import React from 'react';
import { createProjectSteps } from '../constants/StepFormConstants';
import CoreModules from '../shared/CoreModules.js';
import ProjectDetailsForm from '../components/createnewproject/ProjectDetailsForm';
import UploadArea from '../components/createnewproject/UploadArea';
import DataExtract from '../components/createnewproject/DataExtract';
import SplitTasks from '../components/createnewproject/SplitTasks';
import SelectForm from '../components/createnewproject/SelectForm';

const CreateNewProject = () => {
  const currentStep = CoreModules.useAppSelector((state) => state.common.currentStepFormStep.create_project);
  const getCreteProjectContent = (): JSX.Element => {
    switch (currentStep.step) {
      case 1:
        return <ProjectDetailsForm />;
      case 2:
        return <UploadArea />;
      case 3:
        return <DataExtract />;
      case 4:
        return <SplitTasks />;
      case 5:
        return <SelectForm />;
      default:
        return <ProjectDetailsForm />;
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
        <div className="fmtm-mx-5">{(() => getCreteProjectContent())()}</div>
      </div>
    </div>
  );
};

export default CreateNewProject;
