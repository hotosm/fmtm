import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AssetModules from '@/shared/AssetModules.js';
import useForm from '@/hooks/useForm';
import { InviteNewUser } from '@/api/User';
import Button from '@/components/common/Button';
import Chips from '@/components/common/Chips.js';
import InputTextField from '@/components/common/InputTextField.js';
import Select2 from '@/components/common/Select2.js';
import useDocumentTitle from '@/utilfunctions/useDocumentTitle';
import { project_roles } from '@/types/enums';
import InviteValidation from '@/components/ManageProject/User/validation/InviteValidation';
import RadioButton from '@/components/common/RadioButton';
import { useAppDispatch, useAppSelector } from '@/types/reduxTypes';
import InviteTable from './InviteTable';

const VITE_API_URL = import.meta.env.VITE_API_URL;

type propType = {
  roleList: {
    id: string;
    value: project_roles;
    label: string;
  }[];
};

const inviteOptions = [
  {
    name: 'invite_options',
    value: 'osm',
    label: 'Invite via OSM',
  },
  {
    name: 'invite_options',
    value: 'gmail',
    label: 'Invite via Gmail',
  },
];

const initialFormState = {
  inviteVia: 'osm',
  user: [],
  role: null,
};

const InviteTab = ({ roleList }: propType) => {
  useDocumentTitle('Manage Project: Invite User');
  const dispatch = useAppDispatch();
  const params = useParams();

  const projectId = params.id;
  const [user, setUser] = useState('');

  const inviteNewUserPending = useAppSelector((state) => state.user.inviteNewUserPending);

  const submission = () => {
    dispatch(InviteNewUser(`${VITE_API_URL}/users/invite`, { ...values, projectId }));
  };

  const { handleSubmit, handleCustomChange, values, errors }: any = useForm(
    initialFormState,
    submission,
    InviteValidation,
  );

  return (
    <div className="fmtm-flex fmtm-h-[calc(100%-24px)] fmtm-w-full fmtm-gap-5">
      <form
        onSubmit={handleSubmit}
        className="fmtm-flex fmtm-flex-col fmtm-gap-5 fmtm-bg-white fmtm-rounded-xl fmtm-p-6 fmtm-w-[17.5rem] fmtm-h-full fmtm-overflow-y-scroll scrollbar"
      >
        <RadioButton
          value={values?.inviteVia || ''}
          topic=""
          options={inviteOptions}
          direction="row"
          onChangeData={(value) => {
            handleCustomChange('inviteVia', value);
          }}
        />
        <div className="fmtm-w-full">
          <div className="fmtm-flex fmtm-gap-2 fmtm-mb-2">
            <InputTextField
              id="name"
              name="name"
              label="Invite User"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              fieldType="text"
              classNames="fmtm-flex-grow"
              placeholder={values.inviteVia === 'osm' ? 'Enter Username' : 'Enter Gmail'}
            />
            <AssetModules.AddIcon
              disabled={!user}
              className="fmtm-bg-red-600 fmtm-text-white fmtm-rounded-full hover:fmtm-bg-red-700 hover:fmtm-cursor-pointer fmtm-mt-9"
              onClick={() => {
                if (!user) return;
                handleCustomChange('user', [...values.user, user]);
                setUser('');
              }}
            />
          </div>
          {values.user.length > 0 && (
            <Chips
              data={values.user}
              clearChip={(i) => {
                handleCustomChange(
                  'user',
                  values.user.filter((_, index) => index !== i),
                );
              }}
              className="fmtm-w-full fmtm-flex-wrap"
            />
          )}
          {errors?.user && <p className="fmtm-form-error fmtm-text-red-600 fmtm-text-sm">{errors.user}</p>}
        </div>
        <div>
          <p className={`fmtm-text-[1rem] fmtm-mb-2 fmtm-font-semibold !fmtm-bg-transparent`}>Assign as</p>
          <Select2
            options={roleList || []}
            value={values.role}
            onChange={(value: any) => {
              handleCustomChange('role', value);
            }}
            placeholder="Role"
            className="naxatw-w-1/5 naxatw-min-w-[9rem]"
          />
          {errors.role && <p className="fmtm-form-error fmtm-text-red-600 fmtm-text-sm">{errors.role}</p>}
        </div>
        <div className="fmtm-flex fmtm-justify-center">
          <Button type="submit" variant="primary-red" isLoading={inviteNewUserPending}>
            ASSIGN
          </Button>
        </div>
      </form>
      <div className="fmtm-flex-1">
        <InviteTable />
      </div>
    </div>
  );
};

export default InviteTab;
