import React from 'react';
import ApproveOrganizationHeader from '@/components/ApproveOrganization/ApproveOrganizationHeader';
import OrganizationForm from '@/components/ApproveOrganization/OrganizationForm';
import useDocumentTitle from '@/utilfunctions/useDocumentTitle';
import { useAdminAccess } from '@/hooks/usePermissions';
import NoAccessComponent from '@/views/NoAccessComponent';

const ApproveOrganization = () => {
  const adminAccess = useAdminAccess();
  if (!adminAccess) return <NoAccessComponent />;

  useDocumentTitle('Approve Organization');
  return (
    <div className="fmtm-bg-[#F5F5F5]">
      <ApproveOrganizationHeader />
      <div className="fmtm-box-border fmtm-border-[1px] fmtm-border-t-white fmtm-border-t-[0px] fmtm-px-5 fmtm-py-4">
        <OrganizationForm />
      </div>
    </div>
  );
};

export default ApproveOrganization;
