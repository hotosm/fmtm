import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import Button from '@/components/common/Button';
import AssetModules from '@/shared/AssetModules';
import { GetIndividualOrganizationService } from '@/api/OrganisationService';
import { useAppDispatch, useAppSelector } from '@/types/reduxTypes';
import { OrganizationInfoSkeleton } from '@/components/OrganizationDashboard/SkeletonLoader';
import { useIsOrganizationAdmin } from '@/hooks/usePermissions';

const fakeusers = [
  { id: 1, username: 'svcfmtm', profile_img: null },
  {
    id: 5,
    username: 'ram',
    profile_img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxpjzMkaU0p9zhQMTqe4ckWkComL6uCz0Jqg&s',
  },
  { id: 6, username: 'ham', profile_img: 'https://cdn-icons-png.flaticon.com/512/5231/5231019.png' },
  { id: 4, username: 'Nam', profile_img: null },
  {
    id: 3,
    username: 'nsuwal',
    profile_img: 'https://cdn1.iconfinder.com/data/icons/bokbokstars-121-classic-stock-icons-1/512/person-man.png',
  },
  { id: 2, username: 'LocalAdmin', profile_img: null },
];

const VITE_API_URL = import.meta.env.VITE_API_URL;

const OrganizationAdminList = ({ users }) => {
  return (
    <div className="fmtm-flex fmtm-items-center">
      {users.slice(0, 5).map((user, index) => (
        <Tooltip key={user.id} title={user.username} arrow>
          <div
            style={{ zIndex: users.length - index }}
            className="fmtm-border fmtm-rounded-full fmtm-h-[1.688rem] fmtm-w-[1.688rem] fmtm-relative fmtm-mr-[-0.5rem] fmtm-bg-white fmtm-overflow-hidden fmtm-cursor-pointer"
          >
            {user.profile_img ? (
              <img
                src={user.profile_img}
                alt="img"
                className="fmtm-rounded-lg"
                style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '50%' }}
              />
            ) : (
              <div className="fmtm-bg-[#757575] fmtm-flex fmtm-justify-center fmtm-items-center">
                <p className="fmtm-text-white fmtm-font-semibold">
                  {user.username
                    .split(' ')
                    .map((part) => part.charAt(0).toUpperCase())
                    .join('')}
                </p>
              </div>
            )}
          </div>
        </Tooltip>
      ))}
      {users.length <= 4 ? null : (
        <Tooltip
          title={
            <ul>
              {users.slice(5).map((user) => (
                <li key={user.id}>{user.username}</li>
              ))}
            </ul>
          }
          arrow
        >
          <p className="fmtm-ml-[0.8rem] fmtm-body-lg-medium fmtm-cursor-pointer">+{users.slice(5).length}</p>
        </Tooltip>
      )}
    </div>
  );
};

const OrganizationInfo = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const organizationId = params.id;
  const isOrganizationAdmin = useIsOrganizationAdmin(+(organizationId as string));

  const organization = useAppSelector((state) => state.organisation.organisationFormData);
  const organizationLoading = useAppSelector((state) => state.organisation.organisationFormDataLoading);

  useEffect(() => {
    dispatch(GetIndividualOrganizationService(`${VITE_API_URL}/organisation/${organizationId}`));
  }, []);

  if (organizationLoading) return <OrganizationInfoSkeleton />;

  return (
    <div className="fmtm-flex fmtm-justify-between fmtm-flex-wrap sm:fmtm-flex-nowrap fmtm-gap-x-8 fmtm-gap-y-2 fmtm-bg-white fmtm-rounded-lg fmtm-p-4">
      <div className="fmtm-flex fmtm-gap-x-6">
        <div className="fmtm-w-[4.688rem] fmtm-min-w-[4.688rem] fmtm-min-h-[4.688rem] fmtm-max-w-[4.688rem] fmtm-max-h-[4.688rem]">
          {organization?.logo ? (
            <img src={organization?.logo} className="fmtm-w-full" alt="organization-logo" />
          ) : (
            <div className="fmtm-bg-[#757575] fmtm-w-full fmtm-h-full fmtm-rounded-full fmtm-flex fmtm-items-center fmtm-justify-center">
              <h2 className="fmtm-text-white">{organization?.name?.[0]}</h2>
            </div>
          )}
        </div>
        <div>
          <h3 className="fmtm-mb-2">{organization?.name}</h3>
          <p className="fmtm-body-lg xl:fmtm-w-[39rem] xl:fmtm-max-w-[39rem] fmtm-line-clamp-3 fmtm-overflow-y-scroll scrollbar">
            {organization?.description}
          </p>
        </div>
      </div>

      <div className="fmtm-text-grey-800">
        <p className="fmtm-body-lg-medium fmtm-mb-1">Organization Admins</p>
        <OrganizationAdminList users={fakeusers} />
        <a href={organization?.url} target="_" className="fmtm-flex fmtm-items-center fmtm-gap-2 fmtm-mt-3 fmtm-mb-1">
          <AssetModules.LinkIcon className="!fmtm-text-lg" />
          <p className="fmtm-body-lg-medium">{organization?.url}</p>
        </a>
        <a href={`mailto:${organization?.associated_email}`} className="fmtm-flex fmtm-items-center fmtm-gap-2">
          <AssetModules.AlternateEmailIcon className="!fmtm-text-lg" />
          <p className="fmtm-body-lg-medium">{organization?.associated_email}</p>
        </a>
      </div>

      {isOrganizationAdmin && (
        <div className="fmtm-my-auto">
          <Button
            variant="secondary-grey"
            onClick={() => {
              navigate(`/manage/organization/${organizationId}`);
            }}
          >
            <AssetModules.EditIcon className="!fmtm-text-lg" />
            Edit Organization
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrganizationInfo;
