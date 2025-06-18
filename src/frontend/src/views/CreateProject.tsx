import React from 'react';
import { useNavigate } from 'react-router-dom';

import AssetModules from '@/shared/AssetModules';
import BasicDetails from '@/components/CreateProject/01-BasicDetails';

const CreateProject = () => {
  const navigate = useNavigate();
  return (
    <div className="fmtm-bg-red-200 fmtm-w-full fmtm-h-full">
      <div className="fmtm-flex fmtm-items-center fmtm-justify-between fmtm-w-full fmtm-bg-green-400">
        <h5>CREATE NEW PROJECT</h5>
        <AssetModules.CloseIcon className="!fmtm-text-xl hover:fmtm-text-red-medium" />
      </div>

      <div className="sm:fmtm-grid fmtm-grid-rows-[auto_1fr] lg:fmtm-grid-rows-1 fmtm-grid-cols-12 fmtm-w-full fmtm-h-[calc(100%-2.344rem)] fmtm-gap-2 lg:fmtm-gap-5 fmtm-mt-3">
        <div className="fmtm-col-span-12 lg:fmtm-col-span-3 fmtm-h-20 lg:fmtm-h-full fmtm-bg-violet-500"></div>
        <div className="fmtm-col-span-12 sm:fmtm-col-span-7 lg:fmtm-col-span-5 fmtm-h-32 sm:fmtm-h-full fmtm-bg-blue-500 fmtm-my-2 sm:fmtm-my-0"></div>
        <div className="fmtm-col-span-12 sm:fmtm-col-span-5 lg:fmtm-col-span-4 fmtm-h-44 sm:fmtm-h-full fmtm-bg-pink-500"></div>
      </div>
    </div>
  );
};

export default CreateProject;
