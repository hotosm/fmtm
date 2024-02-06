import React from 'react';
import { consentQuestions } from '@/constants/ConsentQuestions';

const ConsentDetailsForm = () => {
  return (
    <div>
      <div className="fmtm-w-[20rem] fmtm-bg-white fmtm-py-10 fmtm-px-5">
        <h5 className="fmtm-text-xl fmtm-font-[600] fmtm-pb-7">Project Details</h5>
        <p className="fmtm-text-[#7A7676] fmtm-flex fmtm-flex-col fmtm-gap-5">
          <span>
            Fill in your project basic information such as name, description, hashtag, etc. This captures essential
            information about your project.
          </span>
          <span>To complete the first step, you will need the login credentials of ODK Central Server.</span>
          <span>
            Here are the instructions for setting up a Central ODK Server on Digital Ocean, if you haven’t already.
          </span>
        </p>
      </div>
    </div>
  );
};

export default ConsentDetailsForm;
