import EditTab from '../components/ManageProject/EditTab';
import UserTab from '../components/ManageProject/UserTab';
import React, { useState } from 'react';
import AssetModules from '../shared/AssetModules.js';

const tabList = [
  { id: 'users', name: 'USERS', icon: <AssetModules.PersonIcon style={{ fontSize: '20px' }} /> },
  { id: 'edit', name: 'EDIT', icon: <AssetModules.EditIcon style={{ fontSize: '20px' }} /> },
];
const ManageProject = () => {
  const [tabView, setTabView] = useState<'users' | 'edit' | string>('users');
  return (
    <div className="fmtm-flex fmtm-bg-[#F5F5F5] fmtm-p-5 fmtm-gap-8 fmtm-min-h-full">
      <div>
        <div className="fmtm-flex fmtm-items-center fmtm-mb-8">
          <AssetModules.ArrowBackIosIcon style={{ fontSize: '20px' }} />
          <p className="fmtm-text-base">BACK</p>
        </div>
        <div className="fmtm-w-[15rem]">
          {tabList.map((tab) => (
            <div
              key={tab.id}
              className={`fmtm-flex fmtm-items-center fmtm-gap-2 fmtm-text-base fmtm-px-5 fmtm-py-3 fmtm-duration-300 fmtm-cursor-pointer hover:fmtm-text-primaryRed hover:fmtm-bg-[#EFE0E0] ${
                tabView === tab.id ? 'fmtm-text-primaryRed fmtm-bg-[#EFE0E0]' : ''
              }`}
              onClick={() => setTabView(tab.id)}
            >
              <div className="fmtm-pb-1">{tab.icon}</div>
              <p>{tab.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="fmtm-font-archivo fmtm-text-xl fmtm-font-semibold fmtm-text-[#484848] fmtm-tracking-wider fmtm-mb-8">
          Cameroon Road Assessment for Sustainable Development in Rural Communities in Africa
        </h2>
        {tabView === 'users' ? <UserTab /> : <EditTab />}
      </div>
    </div>
  );
};

export default ManageProject;
