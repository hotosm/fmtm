import React, { useState } from 'react';
import { consentQuestions } from '@/constants/ConsentQuestions';
import { CustomCheckbox } from '@/components/common/Checkbox';
import RadioButton from '@/components/common/RadioButton';
import Button from '@/components/common/Button';
import useForm from '@/hooks/useForm';
import CoreModules from '@/shared/CoreModules';
import ConsentDetailsValidation from '@/components/CreateEditOrganization/validation/ConsentDetailsValidation';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { OrganisationAction } from '@/store/slices/organisationSlice';

const ConsentDetailsForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const consentDetailsFormData: any = CoreModules.useAppSelector((state) => state.organisation.consentDetailsFormData);

  const submission = () => {
    dispatch(OrganisationAction.SetConsentApproval(true));
    dispatch(OrganisationAction.SetConsentDetailsFormData(values));
  };

  const { handleSubmit, handleCustomChange, values, errors }: any = useForm(
    consentDetailsFormData,
    submission,
    ConsentDetailsValidation,
  );

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
                  value={values[question.id]}
                  onChangeData={(value) => {
                    handleCustomChange(question.id, value);
                  }}
                  className="fmtm-font-archivo fmtm-text-base fmtm-text-[#7A7676] fmtm-mt-1"
                  errorMsg={errors.give_consent}
                />
              ) : (
                <div className="fmtm-flex fmtm-flex-col fmtm-gap-2">
                  {question.options.map((option) => (
                    <CustomCheckbox
                      key={option.id}
                      label={option.label}
                      checked={values[question.id].includes(option.id)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? handleCustomChange(question.id, [...values[question.id], option.id])
                          : handleCustomChange(
                              question.id,
                              values[question.id].filter((value) => value !== option.id),
                            );
                      }}
                    />
                  ))}
                  {errors[question.id] && <p className="fmtm-text-red-500 fmtm-text-sm">{errors[question.id]}</p>}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="fmtm-flex fmtm-items-center fmtm-justify-center fmtm-gap-6 fmtm-mt-8 lg:fmtm-mt-16">
          <Button
            btnText="Cancel"
            btnType="other"
            className="fmtm-font-bold"
            onClick={() => navigate('/organisation')}
          />
          <Button btnText="NEXT" btnType="primary" className="fmtm-font-bold" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default ConsentDetailsForm;
