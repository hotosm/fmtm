import React, { useState } from 'react';
import AssetModules from '../shared/AssetModules.js';
import ProjectInfo from '../components/ProjectSubmissions/ProjectInfo.js';
import SubmissionsInfographics from '../components/ProjectSubmissions/SubmissionsInfographics.js';
import SubmissionsTable from '../components/ProjectSubmissions/SubmissionsTable.js';

const ProjectSubmissions = () => {
  const [viewBy, setViewBy] = useState<'infographics' | 'table'>('infographics');
  return (
    <div className="fmtm-bg-[#F5F5F5]">
      <div className="fmtm-flex">
        <div className="fmtm-bg-white fmtm-flex fmtm-flex-col fmtm-gap-4 fmtm-mx-4 fmtm-my-4 fmtm-p-2">
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
        <div>
          <ProjectInfo />
        </div>
      </div>
      <div>{viewBy === 'infographics' ? <SubmissionsInfographics /> : <SubmissionsTable />}</div>
    </div>
  );
};

export default ProjectSubmissions;
