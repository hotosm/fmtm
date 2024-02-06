import React, { useState } from 'react';
import { consentQuestions } from '@/constants/ConsentQuestions';
import { CustomCheckbox } from '@/components/common/Checkbox';
import RadioButton from '@/components/common/RadioButton';
import Button from '@/components/common/Button';

const ConsentDetailsForm = () => {
  const [checkeditem, setcheckeditem] = useState<any>([]);
  const [rad, setrad] = useState('');
  return (
    <div className="fmtm-flex fmtm-flex-col lg:fmtm-flex-row fmtm-gap-5 lg:fmtm-gap-10">
      <div className="lg:fmtm-w-[30%] xl:fmtm-w-[20rem] fmtm-bg-white fmtm-py-5 lg:fmtm-py-10 fmtm-px-5 fmtm-h-fit">
        <h5 className="fmtm-text-xl fmtm-font-[600] fmtm-pb-3 lg:fmtm-pb-7">Project Details</h5>
        <p className="fmtm-text-[#7A7676] fmtm-flex fmtm-flex-col fmtm-gap-3 lg:fmtm-gap-5">
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
      <div className="fmtm-bg-white lg:fmtm-w-[70%] xl:fmtm-w-[55rem] fmtm-py-5 lg:fmtm-py-10 fmtm-px-5 lg:fmtm-px-9">
        <h5 className="fmtm-text-[#484848] fmtm-text-2xl fmtm-font-[600] fmtm-pb-3 lg:fmtm-pb-7 fmtm-font-archivo fmtm-tracking-wide">
          Consent Details
        </h5>
        <div className="fmtm-flex fmtm-flex-col fmtm-gap-6">
          {consentQuestions.map((question) => (
            <div key={question.id}>
              <div className="fmtm-mb-3 fmtm-flex fmtm-flex-col">
                <h6 className="fmtm-text-lg">
                  {question.question} {question.required && <span className="fmtm-text-red-500">*</span>}
                </h6>
                {question.description && (
                  <p className="fmtm-text-[#7A7676] fmtm-font-archivo fmtm-text-base">{question.description}</p>
                )}
              </div>
              {question.type === 'radio' ? (
                <RadioButton
                  options={question.options}
                  direction="column"
                  value={rad}
                  onChangeData={(value) => {
                    setrad(value);
                  }}
                  className="fmtm-font-archivo fmtm-text-base fmtm-text-[#7A7676] fmtm-mt-1"
                  // errorMsg={errors.dataExtractFeatureType}
                />
              ) : (
                <div className="fmtm-flex fmtm-flex-col fmtm-gap-2">
                  {question.options.map((option) => (
                    <CustomCheckbox
                      key={option.id}
                      label={option.label}
                      checked={checkeditem?.includes(option.id)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? setcheckeditem((prev) => [...prev, option.id])
                          : setcheckeditem((prev) => prev.filter((value) => value !== option.id));
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="fmtm-flex fmtm-items-center fmtm-justify-center fmtm-gap-6 fmtm-mt-8 lg:fmtm-mt-16">
          <Button btnText="Cancel" btnType="other" className="fmtm-font-bold" onClick={() => {}} />
          <Button btnText="NEXT" btnType="primary" className="fmtm-font-bold" onClick={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default ConsentDetailsForm;
