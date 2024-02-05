import React from 'react';
import CoreModules from '@/shared/CoreModules';
import environment from '@/environment';
import CreateEditOrganizationHeader from '@/components/CreateEditOrganization/CreateEditOrganizationHeader';

const CreateEditOrganization = () => {
  const params = CoreModules.useParams();
  const encodedId = params.id;
  const decodedId = encodedId ? environment.decode(encodedId) : null;

  return (
    <div className="fmtm-bg-[#F5F5F5]">
      <CreateEditOrganizationHeader projectId={decodedId} />
    </div>
  );
};

export default CreateEditOrganization;
