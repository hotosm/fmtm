import React, { useState } from 'react';
import AssignTab from './Assign';
import InviteTab from './Invite';

const tabList: ['Assign', 'Invite'] = ['Assign', 'Invite'];

const UserTab = () => {
  const [tabView, setTabView] = useState<'Assign' | 'Invite'>('Assign');

  return (
    <div className="fmtm-py-5 lg:fmtm-py-10 fmtm-px-5 lg:fmtm-px-9">
      <div className="fmtm-flex fmtm-flex-col lg:fmtm-flex-row fmtm-gap-5 lg:fmtm-gap-10 fmtm-w-full">
        <div className="fmtm-max-w-[18rem] lg:fmtm-w-[23%] lg:fmtm-min-w-[18rem]">
          <div className="fmtm-flex fmtm-gap-3 fmtm-mb-5">
            {tabList.map((tab) => (
              <div
                key={tab}
                className={`fmtm-w-fit fmtm-text-[#9B9999] fmtm-px-2 fmtm-border-b-[1px] hover:fmtm-border-primaryRed fmtm-duration-300 fmtm-cursor-pointer ${
                  tabView === tab ? 'fmtm-border-primaryRed' : 'fmtm-border-transparent'
                }`}
                onClick={() => setTabView(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
          <div>{tabView === 'Assign' ? <AssignTab /> : <InviteTab />}</div>
        </div>
      </div>
    </div>
  );
};

export default UserTab;
