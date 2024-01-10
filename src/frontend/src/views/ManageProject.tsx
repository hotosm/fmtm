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
    <div className="fmtm-flex fmtm-flex-col sm:fmtm-flex-row fmtm-bg-[#F5F5F5] fmtm-p-5 fmtm-gap-8 lg:fmtm-min-h-full">
      <div className="sm:fmtm-w-[15%] sm:fmtm-min-w-[7.3rem] fmtm-flex sm:fmtm-flex-col fmtm-items-center sm:fmtm-items-start fmtm-gap-4 sm:fmtm-gap-0 ">
        <div className="fmtm-flex fmtm-items-center sm:fmtm-mb-8 fmtm-cursor-pointer hover:fmtm-text-primaryRed fmtm-duration-300">
          <AssetModules.ArrowBackIosIcon style={{ fontSize: '20px' }} />
          <p className="fmtm-text-base">BACK</p>
        </div>
        <div className="fmtm-flex fmtm-flex-row sm:fmtm-flex-col sm:fmtm-w-full fmtm-bg-[#F2F2F2] fmtm-h-full">
          {tabList.map((tab) => (
            <div
              key={tab.id}
              className={`fmtm-flex fmtm-items-center fmtm-gap-2 fmtm-text-base fmtm-px-3 sm:fmtm-px-5 fmtm-py-1 sm:fmtm-py-3 fmtm-duration-300 fmtm-cursor-pointer hover:fmtm-text-primaryRed hover:fmtm-bg-[#EFE0E0] ${
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
      <div className=" sm:fmtm-w-[calc(100%-140px)] lg:fmtm-w-[85%]">
        <h2 className="fmtm-font-archivo fmtm-text-xl fmtm-font-semibold fmtm-text-[#484848] fmtm-tracking-wider fmtm-mb-8">
          Cameroon Road Assessment for Sustainable Development in Rural Communities in Africa
        </h2>
        {tabView === 'users' ? <UserTab /> : <EditTab />}
      </div>
    </div>
  );
};

export default ManageProject;
