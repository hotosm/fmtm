import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/types/reduxTypes';
import { useIsAdmin } from '@/hooks/usePermissions';

import { GetUserListForSelect } from '@/api/User';
import { UserActions } from '@/store/slices/UserSlice';

import { CustomCheckbox } from '@/components/common/Checkbox';
import FieldLabel from '@/components/common/FieldLabel';
import { Input } from '@/components/RadixComponents/Input';
import Select2 from '@/components/common/Select2';
import { Textarea } from '@/components/RadixComponents/TextArea';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const BasicDetails = () => {
  const dispatch = useAppDispatch();
  const isAdmin = useIsAdmin();

  const [userSearchText, setUserSearchText] = useState('');

  //@ts-ignore
  const authDetails = useAppSelector((state) => state.login.authDetails);
  const organisationListData = useAppSelector((state) => state.createproject.organisationList);
  const organisationListLoading = useAppSelector((state) => state.createproject.organisationListLoading);
  const userList = useAppSelector((state) => state.user.userListForSelect)?.map((user) => ({
    id: user.sub,
    label: user.username,
    value: user.sub,
  }));
  const userListLoading = useAppSelector((state) => state.user.userListLoading);

  const form = useFormContext();
  const { watch, register, control, setValue } = form;

  const values = watch();

  useEffect(() => {
    if (!userSearchText) return;
    dispatch(
      GetUserListForSelect(`${VITE_API_URL}/users/usernames`, {
        search: userSearchText,
        signin_type: 'osm',
      }),
    );
  }, [userSearchText]);

  useEffect(() => {
    if (!values.useDefaultODKCredentials) {
      setValue('odk_central_url', '');
      setValue('odk_central_user', '');
      setValue('odk_central_password', '');
    }
  }, [values.useDefaultODKCredentials]);

  const handleOrganizationChange = (orgId: number) => {
    const orgIdInt = orgId && +orgId;
    if (!orgIdInt) return;
    const selectedOrg = organisationList.find((org) => org.value === orgIdInt);
    setValue('hasODKCredentials', selectedOrg?.hasODKCredentials);
    setValue('useDefaultODKCredentials', selectedOrg?.hasODKCredentials);
  };

  const organisationList = organisationListData.map((org) => ({
    id: org.id,
    label: org.name,
    value: org.id,
    hasODKCredentials: !!org?.odk_central_url,
  }));

  return (
    <div className="fmtm-flex fmtm-flex-col fmtm-gap-[1.125rem] fmtm-w-full">
      <div>
        <FieldLabel label="Project Name" astric className="fmtm-mb-1" />
        <Input {...register('name')} />
      </div>

      <div>
        <FieldLabel label="Short Description" astric className="fmtm-mb-1" />
        <div className="relative">
          <Textarea {...register('short_description')} maxLength={200} />
          <p className="fmtm-text-xs fmtm-absolute fmtm-bottom-1 fmtm-right-2 fmtm-text-gray-400">
            {values.short_description.length}/200
          </p>
        </div>
      </div>

      <div>
        <FieldLabel label="Description" astric className="fmtm-mb-1" />
        <Textarea {...register('description')} />
      </div>

      <div>
        {/* preselect organization if user org-admin & manages only one org */}
        <FieldLabel label="Organization Name" astric className="fmtm-mb-1" />
        <Controller
          control={control}
          name="organisation_id"
          render={({ field }) => (
            <Select2
              options={organisationList || []}
              value={field.value}
              onChange={(value: any) => {
                field.onChange(value);
                handleOrganizationChange(value);
              }}
              placeholder="Organization Name"
              disabled={!isAdmin && authDetails?.orgs_managed?.length === 1}
              isLoading={organisationListLoading}
              ref={field.ref}
            />
          )}
        />
      </div>

      {values.organisation_id && values.hasODKCredentials && (
        <CustomCheckbox
          key="useDefaultODKCredentials"
          label="Use default or requested ODK credentials"
          checked={values.useDefaultODKCredentials}
          onCheckedChange={(value) => {
            setValue('useDefaultODKCredentials', value);
          }}
          className="fmtm-text-black"
          labelClickable={values.useDefaultODKCredentials}
        />
      )}

      {values.organisation_id && !values.useDefaultODKCredentials && (
        <>
          <div>
            <FieldLabel label="ODK Central URL" astric className="fmtm-mb-1" />
            <Input {...register('odk_central_url')} />
          </div>
          <div>
            <FieldLabel label="ODK Central Email" astric className="fmtm-mb-1" />
            <Input {...register('odk_central_user')} />
          </div>
          <div>
            <FieldLabel label="ODK Central Password" astric className="fmtm-mb-1" />
            <Input {...register('odk_central_password')} />
          </div>
        </>
      )}

      <div>
        <FieldLabel label="Assign Project Admin" astric className="fmtm-mb-1" />
        <Controller
          control={control}
          name="project_admins"
          render={({ field }) => (
            <Select2
              options={userList || []}
              value={field.value}
              onChange={(value: any) => field.onChange(value)}
              placeholder="Search for Field-TM users"
              multiple
              checkBox
              isLoading={userListLoading}
              handleApiSearch={(value) => {
                if (value) {
                  setUserSearchText(value);
                } else {
                  dispatch(UserActions.SetUserListForSelect([]));
                }
              }}
              ref={field.ref}
            />
          )}
        />
      </div>
    </div>
  );
};

export default BasicDetails;
