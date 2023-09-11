import React from 'react';
import AssetModules from '../../shared/AssetModules.js';

const CreateProjectHeader = () => {
  return (
    <div className="fmtm-px-5 fmtm-border-b-white fmtm-border-[1px] fmtm-bg-gray-100">
      <div className="fmtm-flex fmtm-justify-between fmtm-items-center">
        <div className="fmtm-pt-3 fmtm-pb-1">
          <h1 className="sm:fmtm-text-xl md:fmtm-text-2xl">CREATE NEW PROJECT</h1>
          <p className="sm:fmtm-text-sm md:fmtm-text-lg fmtm-text-gray-500">
            Setup your field mapping project following the five comprehensive steps.
          </p>
        </div>
        <div className="">
          <AssetModules.CloseIcon />
        </div>
      </div>
    </div>
  );
};

export default CreateProjectHeader;
