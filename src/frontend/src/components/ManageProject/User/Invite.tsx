import React, { useState } from 'react';
import AssetModules from '@/shared/AssetModules.js';
import Button from '@/components/common/Button';
import Chips from '@/components/common/Chips.js';
import InputTextField from '@/components/common/InputTextField.js';
import Select2 from '@/components/common/Select2.js';
import useDocumentTitle from '@/utilfunctions/useDocumentTitle';

const InviteTab = () => {
  useDocumentTitle('Manage Project: Invite User');
  const [user, setUser] = useState<string | null>('');
  const [inviteUser, setInviteUser] = useState<string[]>([]);

  return (
    <div className="fmtm-flex fmtm-flex-col fmtm-gap-5 lg:fmtm-gap-10">
      <div>
        <div className="fmtm-flex fmtm-gap-2">
          <div className="fmtm-flex-grow">
            <InputTextField
              id="name"
              name="name"
              label="Invite User"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              fieldType="text"
            />
          </div>
          <AssetModules.AddIcon
            className="fmtm-bg-red-600 fmtm-text-white fmtm-rounded-full hover:fmtm-bg-red-700 hover:fmtm-cursor-pointer fmtm-mt-9"
            onClick={() => {
              setInviteUser([...inviteUser, user]);
              setUser('');
            }}
          />
        </div>
        {inviteUser.length > 0 && (
          <div>
            <Chips
              data={inviteUser}
              clearChip={(i) => {
                setInviteUser((prevAssignUser) => inviteUser.filter((_, index) => index !== i));
              }}
            />
          </div>
        )}
      </div>
      <div className="fmtm-flex fmtm-justify-center">
        <Button variant="primary-red">ASSIGN</Button>
      </div>
    </div>
  );
};

export default InviteTab;
