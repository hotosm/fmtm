import React, { useState } from 'react';
import AssetModules from '../shared/AssetModules.js';
import ProjectInfo from '../components/ProjectSubmissions/ProjectInfo.js';
import SubmissionsInfographics from '../components/ProjectSubmissions/SubmissionsInfographics.js';
import SubmissionsTable from '../components/ProjectSubmissions/SubmissionsTable.js';

const ProjectSubmissions = () => {
  const [viewBy, setViewBy] = useState<'infographics' | 'table'>('infographics');
  return (
    <div className="fmtm-bg-[#F5F5F5] fmtm-px-5 sm:fmtm-px-0 sm:fmtm-pr-10 2xl:fmtm-pr-20">
      <div className="fmtm-flex fmtm-flex-col sm:fmtm-flex-row fmtm-my-4 fmtm-w-full">
        <div className="sm:fmtm-bg-white fmtm-flex sm:fmtm-flex-col fmtm-gap-4 sm:fmtm-mx-6 sm:fmtm-p-2 fmtm-justify-end sm:fmtm-justify-start">
          <AssetModules.GridViewIcon
            style={{ fontSize: '30px' }}
            className={`${
              viewBy === 'infographics' ? 'fmtm-text-primaryRed' : 'fmtm-text-[#545454]'
            } hover:fmtm-text-primaryRed fmtm-cursor-pointer`}
            onClick={() => setViewBy('infographics')}
          />
          <AssetModules.ListAltIcon
            style={{ fontSize: '30px' }}
            className={`${
              viewBy === 'table' ? 'fmtm-text-primaryRed' : 'fmtm-text-[#545454]'
            } hover:fmtm-text-primaryRed fmtm-cursor-pointer`}
            onClick={() => setViewBy('table')}
          />
        </div>
        <div className="fmtm-flex fmtm-flex-grow ">
          <ProjectInfo />
        </div>
      </div>
      <div className="fmtm-w-ful">{viewBy === 'infographics' ? <SubmissionsInfographics /> : <SubmissionsTable />}</div>
    </div>
  );
};

export default ProjectSubmissions;
