import React, { useEffect, useState } from 'react';
import environment from '@/environment';
import ProjectDescriptionTab from './ProjectDescriptionTab';
import FormUpdateTab from './FormUpdateTab';
import { GetIndividualProjectDetails } from '@/api/CreateProjectService';
import CoreModules from '@/shared/CoreModules';

const tabList: ['Project Description', 'Form Update'] = ['Project Description', 'Form Update'];

const EditTab = () => {
  const dispatch = CoreModules.useAppDispatch();
  const params = CoreModules.useParams();
  const encodedProjectId = params.id;
  const decodedProjectId = environment.decode(encodedProjectId);
  const [tabView, setTabView] = useState<'Project Description' | 'Form Update'>('Project Description');

  useEffect(() => {
    dispatch(GetIndividualProjectDetails(`${import.meta.env.VITE_API_URL}/projects/${decodedProjectId}`));
  }, [decodedProjectId]);

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
      <div className="fmtm-max-w-[29.5rem]">
        {tabView === 'Project Description' ? <ProjectDescriptionTab /> : <FormUpdateTab />}
      </div>
    </div>
  );
};

export default EditTab;