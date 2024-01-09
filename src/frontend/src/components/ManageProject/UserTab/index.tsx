import React, { useState } from 'react';
import AssignTab from './AssignTab';
import InviteTab from './InviteTab';

const tabList = ['Assign', 'Invite'];

const UserTab = () => {
  const [tabView, setTabView] = useState<'Assign' | 'Invite' | string>('Assign');

  return (
    <div>
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
      <div className="fmtm-max-w-[17.5rem]">{tabView === 'Assign' ? <AssignTab /> : <InviteTab />}</div>
    </div>
  );
};

export default UserTab;
