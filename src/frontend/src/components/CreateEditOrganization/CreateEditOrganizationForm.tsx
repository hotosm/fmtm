import React, { useEffect, useRef, useState } from 'react';
import Button from '@/components/common/Button';
import InputTextField from '@/components/common/InputTextField';
import TextArea from '@/components/common/TextArea';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { OrganisationAction } from '@/store/slices/organisationSlice';
import useForm from '@/hooks/useForm';
import CoreModules from '@/shared/CoreModules';
import AssetModules from '@/shared/AssetModules';
import OrganizationDetailsValidation from '@/components/CreateEditOrganization/validation/OrganizationDetailsValidation';
import RadioButton from '@/components/common/RadioButton';
import { useDispatch } from 'react-redux';
import { PostOrganisationDataService } from '@/api/OrganisationService';

type optionsType = {
  name: string;
  value: string;
  label: string;
};

const organizationTypeOptions: optionsType[] = [
  { name: 'osm_community', value: 'osm_community', label: 'OSM Community' },
  { name: 'company', value: 'company', label: 'Company' },
  { name: 'non_profit', value: 'non_profit', label: 'Non-profit' },
  { name: 'university', value: 'university', label: 'University' },
  { name: 'other', value: 'other', label: 'Other' },
];

const CreateEditOrganizationForm = ({ organizationId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const inputFileRef = useRef<any>(null);
  const organisationFormData: any = CoreModules.useAppSelector((state) => state.organisation.organisationFormData);
  const postOrganisationDataLoading: boolean = CoreModules.useAppSelector(
    (state) => state.organisation.postOrganisationDataLoading,
  );
  const postOrganisationData: any = CoreModules.useAppSelector((state) => state.organisation.postOrganisationData);
  const [previewSource, setPreviewSource] = useState<any>('');

  const submission = () => {
    dispatch(PostOrganisationDataService(`${import.meta.env.VITE_API_URL}/organisation/`, values));
  };

  const { handleSubmit, handleChange, handleCustomChange, values, errors }: any = useForm(
    organisationFormData,
    submission,
    OrganizationDetailsValidation,
  );

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); //reads file as data url (base64 encoding)
    reader.onload = () => {
      if (reader) {
        setPreviewSource(reader?.result);
      }
    };
  };

  // redirect to manage-org page after post success
  useEffect(() => {
    if (postOrganisationData) {
      dispatch(OrganisationAction.postOrganisationData(null));
      dispatch(OrganisationAction.SetOrganisationFormData({}));
      if (searchParams.get('popup') === 'true') {
        window.close();
      } else {
        navigate('/organisation');
      }
    }
  }, [postOrganisationData]);

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
          Organizational Details
        </h5>
        <div className="fmtm-flex fmtm-flex-col fmtm-gap-6">
          <InputTextField
            id="name"
            name="name"
            label="Community or Organization Name"
            subLabel="Please name the local community or organization you are asking to create"
            value={values?.name}
            onChange={handleChange}
            fieldType="text"
            required
            errorMsg={errors.name}
          />
          <InputTextField
            id="email"
            name="email"
            label="Email?"
            subLabel="We will use this email for scheduling on-boarding training sessions and follow-up needed to create your org."
            value={values?.email}
            onChange={handleChange}
            fieldType="text"
            required
            errorMsg={errors.email}
          />
          <InputTextField
            id="osm_profile"
            name="osm_profile"
            label="Please send a link to your OpenStreetMap Profile?"
            subLabel={
              <span>
                Format: https://www.openstreetmap.org/user&lt;your OSM username&gt;. Note: they are case sensitive and
                if there is a mistake we will not be able to grant you the proper role(s). If you don’t have an OSM
                account please create one now by following steps 1-4 outlined{' '}
                <a
                  href="https://tasks.hotosm.org/learn/quickstart"
                  className="fmtm-text-primaryRed hover:fmtm-text-red-700 fmtm-cursor-pointer fmtm-w-fit"
                  target="_"
                >
                  Here
                </a>
              </span>
            }
            value={values?.osm_profile}
            onChange={handleChange}
            fieldType="text"
            required
            errorMsg={errors.osm_profile}
          />
          <InputTextField
            id="url"
            name="url"
            label="Website URL"
            value={values?.url}
            onChange={handleChange}
            fieldType="text"
            required
            errorMsg={errors.url}
          />
          <TextArea
            id="description"
            name="description"
            label="Description"
            rows={3}
            value={values?.description}
            onChange={handleChange}
            required
            errorMsg={errors.description}
          />
          <InputTextField
            id="odk_central_url"
            name="odk_central_url"
            label="ODK Central URL (Optional)"
            value={values?.odk_central_url}
            onChange={handleChange}
            fieldType="text"
          />
          <InputTextField
            id="odk_central_user"
            name="odk_central_user"
            label="ODK Central User (Optional)"
            value={values?.odk_central_user}
            onChange={handleChange}
            fieldType="text"
          />
          <InputTextField
            id="odk_central_password"
            name="odk_central_password"
            label="ODK Central Password (Optional)"
            value={values?.odk_central_password}
            onChange={handleChange}
            fieldType="text"
          />
          <RadioButton
            topic="What type of community or organization are you applying for? "
            options={organizationTypeOptions}
            direction="column"
            value={values.organization_type}
            onChangeData={(value) => {
              handleCustomChange('organization_type', value);
            }}
            className="fmtm-text-base fmtm-text-[#7A7676] fmtm-mt-1"
            errorMsg={errors.organization_type}
            required
          />
          <div className="flex items-center">
            <p className="fmtm-text-[1rem] fmtm-mb-2 fmtm-font-semibold">Upload Logo</p>
            <div className="fmtm-flex fmtm-flex-col fmtm-gap-5">
              <input
                ref={inputFileRef}
                type="file"
                className="fmtm-max-w-[250px]"
                onChange={(e) => {
                  handleCustomChange('logo', e.target?.files?.[0]);
                  if (e.target?.files?.[0]) {
                    previewFile(e.target?.files?.[0]);
                  }
                }}
                accept="image/png, image/gif, image/jpeg"
              />
              {previewSource && (
                <div className="fmtm-relative fmtm-w-fit">
                  <div className="fmtm-absolute -fmtm-top-3 -fmtm-right-3" title="Remove Logo">
                    <AssetModules.DeleteIcon
                      style={{ fontSize: '28px' }}
                      className="fmtm-text-primaryRed hover:fmtm-text-red-700 fmtm-cursor-pointer"
                      onClick={() => {
                        inputFileRef.current.value = '';
                        handleCustomChange('logo', '');
                        setPreviewSource('');
                      }}
                    />
                  </div>
                  <img src={previewSource} alt="" className="fmtm-h-[100px] fmtm-rounded-sm fmtm-border-[1px]" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="fmtm-flex fmtm-items-center fmtm-justify-center fmtm-gap-6 fmtm-mt-8 lg:fmtm-mt-16">
          <Button
            btnText="Back"
            btnType="other"
            className="fmtm-font-bold"
            onClick={() => dispatch(OrganisationAction.SetConsentApproval(false))}
          />
          <Button
            isLoading={postOrganisationDataLoading}
            loadingText="Submitting"
            btnText="Submit"
            btnType="primary"
            className="fmtm-font-bold"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateEditOrganizationForm;
