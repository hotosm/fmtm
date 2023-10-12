import React, { useEffect, useRef, useState } from 'react';
import Button from '../../components/common/Button';
import RadioButton from '../../components/common/RadioButton';
import AssetModules from '../../shared/AssetModules.js';
import { useDispatch } from 'react-redux';
import { CommonActions } from '../../store/slices/CommonSlice';
import { useNavigate } from 'react-router-dom';
import { CreateProjectActions } from '../../store/slices/CreateProjectSlice';
import CoreModules from '../../shared/CoreModules';
import useForm from '../../hooks/useForm';
import DefineTaskValidation from '../../components/createproject/validation/DefineTaskValidation';
import NewDefineAreaMap from '../../views/NewDefineAreaMap';
import { useAppSelector } from '../../types/reduxTypes';
import {
  CreateProjectService,
  GenerateProjectLog,
  GetDividedTaskFromGeojson,
  TaskSplittingPreviewService,
} from '../../api/CreateProjectService';
import environment from '../../environment';
import LoadingBar from '../../components/createproject/LoadingBar';

const alogrithmList = [
  { name: 'define_tasks', value: 'divide_on_square', label: 'Divide on square' },
  { name: 'define_tasks', value: 'choose_area_as_task', label: 'Choose area as task' },
  { name: 'define_tasks', value: 'task_splitting_algorithm', label: 'Task Splitting Algorithm' },
];
let generateProjectLogIntervalCb: any = null;

const SplitTasks = ({ flag, geojsonFile, setGeojsonFile, customLineUpload, customPolygonUpload, customFormFile }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const divRef = useRef(null);
  const splitTasksSelection = CoreModules.useAppSelector((state) => state.createproject.splitTasksSelection);
  const drawnGeojson = CoreModules.useAppSelector((state) => state.createproject.drawnGeojson);
  const projectDetails = CoreModules.useAppSelector((state) => state.createproject.projectDetails);
  const buildingGeojson = useAppSelector((state) => state.createproject.buildingGeojson);
  const lineGeojson = useAppSelector((state) => state.createproject.lineGeojson);
  const userDetails: any = CoreModules.useAppSelector((state) => state.login.loginToken);

  const generateQrSuccess: any = CoreModules.useAppSelector((state) => state.createproject.generateQrSuccess);
  const projectDetailsResponse = CoreModules.useAppSelector((state) => state.createproject.projectDetailsResponse);
  const generateProjectLog: any = CoreModules.useAppSelector((state) => state.createproject.generateProjectLog);

  const toggleStep = (step, url) => {
    dispatch(CommonActions.SetCurrentStepFormStep({ flag: flag, step: step }));
    navigate(url);
  };

  const submission = () => {
    console.log('submission triggered');

    const blob = new Blob([JSON.stringify(drawnGeojson)], { type: 'application/json' });

    // Create a file object from the Blob
    const drawnGeojsonFile = new File([blob], 'data.json', { type: 'application/json' });

    dispatch(CreateProjectActions.SetIndividualProjectDetailsData(formValues));
    const hashtags = projectDetails.hashtags;
    const arrayHashtag = hashtags
      .split('#')
      .map((item) => item.trim())
      .filter(Boolean);
    dispatch(
      CreateProjectService(
        `${import.meta.env.VITE_API_URL}/projects/create_project`,
        {
          project_info: {
            name: projectDetails.name,
            short_description: projectDetails.short_description,
            description: projectDetails.description,
          },
          author: {
            username: userDetails.username,
            id: userDetails.id,
          },
          odk_central: {
            odk_central_url: projectDetails.odk_central_url,
            odk_central_user: projectDetails.odk_central_user,
            odk_central_password: projectDetails.odk_central_password,
          },
          // dont send xform_title if upload custom form is selected
          xform_title: projectDetails.form_ways === 'Upload a Form' ? null : projectDetails.formCategorySelection,
          dimension: projectDetails.dimension,
          splitting_algorithm: splitTasksSelection,
          form_ways: projectDetails.form_ways,
          // "uploaded_form": projectDetails.uploaded_form,
          data_extractWays: projectDetails.data_extractWays,
          hashtags: arrayHashtag,
          organisation_id: projectDetails.organisation_id,
        },
        drawnGeojsonFile,
        customFormFile,
        customPolygonUpload,
        customLineUpload,
      ),
    );
    // if (formValues.splitting_algorithm === 'Divide on Square') {
    //   generateTasksOnMap();
    // }
    // dispatch(CreateProjectActions.SetIndividualProjectDetailsData({ ...projectDetails, ...formValues }));
    // navigate('/select-form');
    // toggleStep(5, '/new-select-form');
  };

  const {
    handleSubmit,
    handleCustomChange,
    values: formValues,
    errors,
  }: any = useForm(projectDetails, submission, DefineTaskValidation);

  const generateTaskBasedOnSelection = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const blob = new Blob([JSON.stringify(drawnGeojson)], { type: 'application/json' });

    // Create a file object from the Blob
    const drawnGeojsonFile = new File([blob], 'data.json', { type: 'application/json' });
    if (splitTasksSelection === 'divide_on_square') {
      dispatch(
        GetDividedTaskFromGeojson(`${import.meta.env.VITE_API_URL}/projects/preview_tasks/`, {
          geojson: drawnGeojsonFile,
          dimension: formValues?.dimension,
        }),
      );
    } else if (splitTasksSelection === 'task_splitting_algorithm') {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(drawnGeojsonFile);
      a.download = 'test.json';
      a.click();
      dispatch(
        TaskSplittingPreviewService(
          `${import.meta.env.VITE_API_URL}/projects/task_split`,
          drawnGeojsonFile,
          formValues?.average_buildings_per_task,
          false,
          // dataExtractFile ? true : false,
        ),
      );
    }
  };
  //Log Functions
  useEffect(() => {
    if (generateQrSuccess) {
      if (generateProjectLogIntervalCb === null) {
        dispatch(
          GenerateProjectLog(`${import.meta.env.VITE_API_URL}/projects/generate-log/`, {
            project_id: projectDetailsResponse?.id,
            uuid: generateQrSuccess.task_id,
          }),
        );
      }
    }
  }, [generateQrSuccess]);
  useEffect(() => {
    if (generateQrSuccess && generateProjectLog?.status === 'FAILED') {
      clearInterval(generateProjectLogIntervalCb);
      dispatch(
        CommonActions.SetSnackBar({
          open: true,
          message: `QR Generation Failed. ${generateProjectLog?.message}`,
          variant: 'error',
          duration: 10000,
        }),
      );
    } else if (generateQrSuccess && generateProjectLog?.status === 'SUCCESS') {
      clearInterval(generateProjectLogIntervalCb);
      const encodedProjectId = environment.encode(projectDetailsResponse?.id);
      navigate(`/project_details/${encodedProjectId}`);
      dispatch(
        CommonActions.SetSnackBar({
          open: true,
          message: 'QR Generation Completed.',
          variant: 'success',
          duration: 2000,
        }),
      );
      dispatch(CreateProjectActions.SetGenerateProjectLog(null));
    }
    if (generateQrSuccess && generateProjectLog?.status === 'PENDING') {
      if (generateProjectLogIntervalCb === null) {
        generateProjectLogIntervalCb = setInterval(() => {
          dispatch(
            GenerateProjectLog(`${import.meta.env.VITE_API_URL}/projects/generate-log/`, {
              project_id: projectDetailsResponse?.id,
              uuid: generateQrSuccess.task_id,
            }),
          );
        }, 2000);
      }
    }
  }, [generateQrSuccess, generateProjectLog]);

  useEffect(() => {
    return () => {
      clearInterval(generateProjectLogIntervalCb);
      generateProjectLogIntervalCb = null;
      dispatch(CreateProjectActions.SetGenerateProjectLog(null));
    };
  }, []);

  // END
  const renderTraceback = (errorText: string) => {
    if (!errorText) {
      return null;
    }

    return errorText.split('\n').map((line, index) => (
      <div key={index} style={{ display: 'flex' }}>
        <span style={{ color: 'gray', marginRight: '1em' }}>{index + 1}.</span>
        <span>{line}</span>
      </div>
    ));
  };
  const dividedTaskGeojson = CoreModules.useAppSelector((state) => state.createproject.dividedTaskGeojson);

  const parsedTaskGeojsonCount =
    dividedTaskGeojson?.features?.length ||
    JSON?.parse(dividedTaskGeojson)?.features?.length ||
    projectDetails?.areaGeojson?.features?.length;
  const totalSteps = dividedTaskGeojson?.features ? dividedTaskGeojson?.features?.length : parsedTaskGeojsonCount;

  return (
    <form onSubmit={handleSubmit}>
      <div className="fmtm-flex fmtm-gap-7 fmtm-flex-col lg:fmtm-flex-row">
        <div className="fmtm-bg-white lg:fmtm-w-[20%] xl:fmtm-w-[17%] fmtm-px-5 fmtm-py-6">
          <h6 className="fmtm-text-xl fmtm-font-[600] fmtm-pb-2 lg:fmtm-pb-6">Split Tasks</h6>
          <p className="fmtm-text-gray-500 lg:fmtm-flex lg:fmtm-flex-col lg:fmtm-gap-3">
            <span>Fill in your project basic information such as name, description, hashtag, etc. </span>
            <span>To complete the first step, you will need the account credentials of ODK central server.</span>{' '}
            <span>Here are the instructions for setting up a Central ODK Server on Digital Ocean.</span>
          </p>
        </div>
        <div className="lg:fmtm-w-[80%] xl:fmtm-w-[83%] lg:fmtm-h-[60vh] xl:fmtm-h-[58vh] fmtm-bg-white fmtm-px-5 lg:fmtm-px-11 fmtm-py-6 lg:fmtm-overflow-y-scroll lg:scrollbar">
          <div className="fmtm-w-full fmtm-flex fmtm-gap-6 md:fmtm-gap-14 fmtm-flex-col md:fmtm-flex-row fmtm-h-full">
            <div className="fmtm-flex fmtm-flex-col fmtm-gap-6 lg:fmtm-w-[40%] fmtm-justify-between">
              <div>
                <RadioButton
                  value={splitTasksSelection}
                  topic="Select an option to split the task"
                  options={alogrithmList}
                  direction="column"
                  onChangeData={(value) => {
                    handleCustomChange('splitTaskOption', value);
                    dispatch(CreateProjectActions.SetSplitTasksSelection(value));
                  }}
                  errorMsg={errors.splitTaskOption}
                />
                {splitTasksSelection === 'divide_on_square' && (
                  <>
                    <div className="fmtm-mt-6 fmtm-flex fmtm-items-center fmtm-gap-4">
                      <p className="fmtm-text-gray-500">Dimension of square in metres: </p>
                      <input
                        type="number"
                        value={formValues.dimension}
                        onChange={(e) => handleCustomChange('dimension', e.target.value)}
                        className="fmtm-outline-none fmtm-border-[1px] fmtm-border-gray-600 fmtm-h-7 fmtm-w-16 fmtm-px-2 "
                      />
                    </div>
                    {errors.dimension && (
                      <p className="fmtm-form-error fmtm-text-red-600 fmtm-text-sm fmtm-py-1">{errors.dimension}</p>
                    )}
                  </>
                )}
                {formValues.splitTaskOption === 'task_splitting_algorithm' && (
                  <>
                    <div className="fmtm-mt-6 fmtm-flex fmtm-items-center fmtm-gap-4">
                      <p className="fmtm-text-gray-500">Average number of buildings per task: </p>
                      <input
                        type="number"
                        value={formValues.average_buildings_per_task}
                        onChange={(e) => handleCustomChange('average_buildings_per_task', e.target.value)}
                        className="fmtm-outline-none fmtm-border-[1px] fmtm-border-gray-600 fmtm-h-7 fmtm-w-16 fmtm-px-2 "
                      />
                    </div>
                    {errors.average_buildings_per_task && (
                      <p className="fmtm-form-error fmtm-text-red-600 fmtm-text-sm fmtm-py-1">
                        {errors.average_buildings_per_task}
                      </p>
                    )}
                  </>
                )}
                {(splitTasksSelection === 'divide_on_square' || splitTasksSelection === 'task_splitting_algorithm') && (
                  <div className="fmtm-mt-6 fmtm-pb-3">
                    <div className="fmtm-flex fmtm-items-center fmtm-gap-4">
                      <Button
                        btnText="Click to generate task"
                        btnType="primary"
                        type="button"
                        onClick={generateTaskBasedOnSelection}
                        className=""
                        icon={<AssetModules.SettingsIcon className="fmtm-text-white" />}
                      />
                      <Button
                        btnText="Stop generating"
                        btnType="secondary"
                        type="button"
                        onClick={() => console.log('stop gen')}
                        className=""
                      />
                    </div>
                  </div>
                )}
                {splitTasksSelection && (
                  <p className="fmtm-text-gray-500 fmtm-mt-5">
                    Total number of task: <span className="fmtm-font-bold">10</span>
                  </p>
                )}
              </div>
              <div className="fmtm-flex fmtm-gap-5 fmtm-mx-auto fmtm-mt-10 fmtm-my-5">
                <Button
                  btnText="PREVIOUS"
                  btnType="secondary"
                  type="button"
                  onClick={() => toggleStep(3, '/new-data-extract')}
                  className="fmtm-font-bold"
                />
                <Button btnText="SUBMIT" btnType="primary" type="submit" className="fmtm-font-bold" />
              </div>
            </div>
            <div className="fmtm-w-full lg:fmtm-w-[60%] fmtm-flex fmtm-flex-col fmtm-gap-6 fmtm-bg-gray-300 fmtm-h-[60vh] lg:fmtm-h-full">
              <NewDefineAreaMap
                uploadedOrDrawnGeojsonFile={drawnGeojson}
                buildingExtractedGeojson={buildingGeojson}
                lineExtractedGeojson={lineGeojson}
              />
            </div>
            <div className="fmtm-w-full lg:fmtm-w-[60%] fmtm-flex fmtm-flex-col fmtm-gap-6 fmtm-bg-gray-300 fmtm-h-[60vh] lg:fmtm-h-full">
              <CoreModules.Stack>
                {generateProjectLog ? (
                  <CoreModules.Stack
                    sx={{ display: 'flex', flexDirection: 'col', gap: 2, width: { xs: '100%', md: '60%' }, pb: '2rem' }}
                  >
                    <CoreModules.Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <CoreModules.Typography component="h4">Status: </CoreModules.Typography>
                      <CoreModules.Typography
                        component="h4"
                        sx={{ ml: 2, fontWeight: 'bold', borderRadius: '20px', border: '1px solid gray', p: 1 }}
                      >
                        {generateProjectLog.status}
                      </CoreModules.Typography>
                    </CoreModules.Stack>
                    <LoadingBar
                      title={'Task Progress'}
                      activeStep={generateProjectLog.progress}
                      totalSteps={totalSteps}
                    />
                  </CoreModules.Stack>
                ) : null}
                {generateProjectLog ? (
                  <CoreModules.Stack sx={{ width: '90%', height: '48vh' }}>
                    <div
                      ref={divRef}
                      style={{
                        backgroundColor: 'black',
                        color: 'white',
                        padding: '10px',
                        fontSize: '12px',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace',
                        overflow: 'auto',
                        height: '100%',
                      }}
                    >
                      {renderTraceback(generateProjectLog?.logs)}
                    </div>
                  </CoreModules.Stack>
                ) : null}
              </CoreModules.Stack>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SplitTasks;
