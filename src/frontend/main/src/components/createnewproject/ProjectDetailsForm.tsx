import React from 'react';

const ProjectDetailsForm = () => {
  return (
    <div className="fmtm-flex fmtm-gap-7">
      <div className="fmtm-bg-white xl:fmtm-w-[17%] fmtm-px-5 fmtm-py-6">
        <h6 className="fmtm-text-xl fmtm-font-[600] fmtm-pb-6">Project Details</h6>
        <p className="fmtm-text-gray-500 fmtm-flex fmtm-flex-col fmtm-gap-3">
          <span>Fill in your project basic information such as name, description, hashtag, etc. </span>
          <span>To complete the first step, you will need the account credentials of ODK central server.</span>{' '}
          <span>Here are the instructions for setting up a Central ODK Server on Digital Ocean.</span>
        </p>
      </div>
      <div className="xl:fmtm-w-[83%] fmtm-bg-white fmtm-px-5 fmtm-py-6">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default ProjectDetailsForm;
