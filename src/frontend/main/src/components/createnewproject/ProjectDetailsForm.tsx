import TextArea from '../../components/common/TextArea';
import InputTextField from '../../components/common/InputTextField';
import React, { useState } from 'react';
import { CreateProjectActions } from '../../store/slices/CreateProjectSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../types/reduxTypes';
import useForm from '../../hooks/useForm';
import CreateProjectValidation from '../../components/createproject/validation/CreateProjectValidation';

const ProjectDetailsForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const projectDetails: any = useAppSelector((state) => state.createproject.projectDetails);

  const submission = () => {
    dispatch(CreateProjectActions.SetIndividualProjectDetailsData(values));
    dispatch(CreateProjectActions.SetCreateProjectFormStep('upload-area'));
    navigate('/upload-area', { replace: true, state: { values: values } });
  };

  const { handleSubmit, handleCustomChange, values, errors }: any = useForm(
    projectDetails,
    submission,
    CreateProjectValidation,
  );

  const hashtagPrefix = '#FMTM ';

  // Checks if hashtag value starts with hotosm-fmtm'
  const handleHashtagOnChange = (e) => {
    let enteredText = e.target.value;
    if (!enteredText.startsWith(hashtagPrefix)) {
      handleCustomChange('hashtags', hashtagPrefix);
      return;
    }
    handleCustomChange('hashtags', enteredText);
  };

  // Doesn't let the user to press 'Backspace' or 'Delete' if input value is 'hotosm-fmtm '
  const handleHashtagKeyPress = (e) => {
    if (
      ((e.key === 'Backspace' || e.key === 'Delete') && values.hashtags === hashtagPrefix) ||
      (e.ctrlKey && e.key === 'Backspace')
    ) {
      e.preventDefault();
    }
  };

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
      <div className="xl:fmtm-w-[83%] xl:fmtm-h-[60vh] fmtm-bg-white fmtm-px-11 fmtm-py-6 fmtm-flex xl:fmtm-gap-14 fmtm-overflow-y-scroll scrollbar">
        <div className="fmtm-flex fmtm-flex-col fmtm-gap-6 xl:fmtm-w-[50%]">
          <InputTextField
            label="Project Name"
            value={values.name}
            onChange={(e) => handleCustomChange('name', e.target.value)}
            fieldType="text"
          />
          <TextArea
            label="Short Description"
            rows={3}
            value={values.short_description}
            onChange={(e) => handleCustomChange('short_description', e.target.value)}
          />
          <InputTextField
            label="ODK Central URL"
            value={values.odk_central_url}
            onChange={(e) => handleCustomChange('odk_central_url', e.target.value)}
            fieldType="text"
          />
          <InputTextField
            label="Central ODK Password"
            value={values.odk_central_password}
            onChange={(e) => handleCustomChange('odk_central_password', e.target.value)}
            fieldType="text"
          />
          <InputTextField
            label="Central ODK Email/Username"
            value={values.odk_central_user}
            onChange={(e) => handleCustomChange('odk_central_user', e.target.value)}
            fieldType="text"
          />
          <InputTextField
            label="Changeset Comment"
            value={values.hashtags}
            onChange={(e) => {
              handleHashtagOnChange(e);
            }}
            onKeyDown={(e) => {
              handleHashtagKeyPress(e);
            }}
            fieldType="text"
          />
        </div>
        <div className="xl:fmtm-w-[50%] fmtm-flex fmtm-flex-col fmtm-gap-6">
          <InputTextField
            label="Organization Name"
            value={values.organisation_name}
            onChange={(e) => handleCustomChange('organisation_name', e.target.value)}
            fieldType="text"
          />
          <TextArea
            label="Description"
            rows={3}
            value={values.description}
            onChange={(e) => handleCustomChange('description', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsForm;
