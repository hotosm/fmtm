import React, { useEffect, useRef, useState } from 'react';
import enviroment from '../../environment';
import CoreModules from '../../shared/CoreModules';
import FormGroup from '@mui/material/FormGroup';
import { CreateProjectService, FormCategoryService, GenerateProjectLog } from '../../api/CreateProjectService';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { InputLabel, LinearProgress, MenuItem, Select } from '@mui/material';
import AssetModules from '../../shared/AssetModules.js';
import useForm from '../../hooks/useForm';
import SelectFormValidation from './validation/SelectFormValidation';
import { CommonActions } from '../../store/slices/CommonSlice';

const theme = CoreModules.createTheme({
  palette: {
    primary: {
      main: '#7679d1',
    },
    secondary: {
      main: '#dba7f0',
    },
  },
});

const totalSteps = 5;

const LoadingBar = ({ steps, activeStep }) => {
  const calculateProgress = (totalSteps, activeStep) => {
    return (activeStep / totalSteps) * 100;
  };

  const calculateRemainingTime = (totalSteps, activeStep, elapsedSeconds) => {
    const averageSecondsPerStep = elapsedSeconds / activeStep;
    const remainingSteps = totalSteps - activeStep;
    const remainingTime = remainingSteps * averageSecondsPerStep;
    return remainingTime.toFixed(2);
  };

  const startTimestamp = useRef(Date.now());

  useEffect(() => {
    startTimestamp.current = Date.now();
  }, [activeStep]);

  const elapsedSeconds = (Date.now() - startTimestamp.current) / 1000;
  const completedPercentage = calculateProgress(steps, activeStep);
  const remainingTime = calculateRemainingTime(steps, activeStep, elapsedSeconds);

  return (
    <CoreModules.Box>
      <CoreModules.Box sx={{ display: 'flex', width: '80%', justifyContent: 'space-between', alignItems: 'center' }}>
        <CoreModules.Typography variant="subtitle6">
          Your Progress
          <CoreModules.Typography variant="subtitle1">{`${completedPercentage}% Completed`}</CoreModules.Typography>
        </CoreModules.Typography>

        <CoreModules.Typography variant="subtitle6">{`${remainingTime} secs remaining`}</CoreModules.Typography>
      </CoreModules.Box>
      <CoreModules.ThemeProvider theme={theme}>
        <CoreModules.Tooltip title={`Step : ${totalSteps} / ${activeStep + 1}`} placement="top">
          <CoreModules.Box
            component="span"
            sx={{
              position: 'absolute',
              borderRadius: '20%',
            }}
          >
            <LinearProgress
              variant="determinate"
              value={completedPercentage}
              sx={{
                borderRadius: '12px',
                height: '20px',
                width: 430,
                backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main} 0%, ${
                  theme.palette.secondary.main
                } ${calculateProgress(steps, totalSteps)}%, grey ${calculateProgress(steps, activeStep)}%, grey 100%)`,
              }}
            />
          </CoreModules.Box>
        </CoreModules.Tooltip>
      </CoreModules.ThemeProvider>
    </CoreModules.Box>
  );
};

// import { SelectPicker } from 'rsuite';
let generateProjectLogIntervalCb = null;

const FormSelection: React.FC = () => {
  const defaultTheme: any = CoreModules.useSelector<any>((state) => state.theme.hotTheme);
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = CoreModules.useDispatch();
  // //dispatch function to perform redux state mutation

  const formCategoryList = CoreModules.useSelector((state: any) => state.createproject.formCategoryList);
  // //we use use-selector from redux to get all state of formCategory from createProject slice

  const projectDetails = CoreModules.useSelector((state: any) => state.createproject.projectDetails);
  // //we use use-selector from redux to get all state of projectDetails from createProject slice

  const generateProjectLog: any = CoreModules.useSelector<any>((state) => state.createproject.generateProjectLog);
  // //we use use-selector from redux to get all state of loginToken from login slice
  const generateQrSuccess: any = CoreModules.useSelector<any>((state) => state.createproject.generateQrSuccess);
  // //we use use-selector from redux to get all state of loginToken from login slice
  const projectDetailsResponse = CoreModules.useSelector((state: any) => state.createproject.projectDetailsResponse);
  // //we use use-selector from redux to get all state of projectDetails from createProject slice

  // Fetching form category list
  useEffect(() => {
    dispatch(FormCategoryService(`${enviroment.baseApiUrl}/central/list-forms`));
  }, []);
  // END
  const selectExtractWaysList = ['Centroid', 'Polygon'];
  const selectExtractWays = selectExtractWaysList.map((item) => ({ label: item, value: item }));
  const selectFormWaysList = ['Use Existing Form', 'Upload a Custom Form'];
  const selectFormWays = selectFormWaysList.map((item) => ({ label: item, value: item }));
  const formCategoryData = formCategoryList.map((item) => ({ label: item.title, value: item.title }));
  const userDetails: any = CoreModules.useSelector<any>((state) => state.login.loginToken);
  // //we use use-selector from redux to get all state of loginToken from login slice

  const submission = () => {
    const previousValues = location.state.values;
    console.log(previousValues, 'previousValues');
    dispatch(
      CreateProjectService(
        `${enviroment.baseApiUrl}/projects/create_project`,
        {
          project_info: { ...previousValues },
          author: {
            username: userDetails.username,
            id: userDetails.id,
          },
          odk_central: {
            odk_central_url: previousValues.odk_central_url,
            odk_central_user: previousValues.odk_central_user,
            odk_central_password: previousValues.odk_central_password,
          },
          // dont send xform_title if upload custom form is selected
          xform_title: values.form_ways === 'Upload a Form' ? null : values.xform_title,
          dimension: projectDetails.dimension,
          splitting_algorithm: projectDetails.splitting_algorithm,
          organization: previousValues.organization,
          form_ways: projectDetails.form_ways,
          uploaded_form: previousValues.uploaded_form,
          data_extractWays: values.data_extractWays === 'Polygon' ? true : false,
        },
        previousValues?.areaGeojson,
      ),
    );
    // navigate("/select-form", { replace: true, state: { values: values } });
  };

  // Fetching form category list
  useEffect(() => {
    dispatch(FormCategoryService(`${enviroment.baseApiUrl}/central/list-forms`));
    return () => {
      clearInterval(generateProjectLogIntervalCb);
    };
  }, []);
  // END

  // Fetching form category list
  useEffect(() => {
    if (generateQrSuccess) {
      if (generateProjectLogIntervalCb === null) {
        dispatch(
          GenerateProjectLog(`${enviroment.baseApiUrl}/projects/generate-log/`, {
            project_id: projectDetailsResponse?.id,
            uuid: generateQrSuccess.task_id,
          }),
        );
      }
    }
  }, [generateQrSuccess]);
  useEffect(() => {
    if (generateProjectLog?.status === 'SUCCESS') {
      clearInterval(generateProjectLogIntervalCb);
      navigate('/');
      dispatch(
        CommonActions.SetSnackBar({
          open: true,
          message: 'QR Generation Completed.',
          variant: 'success',
          duration: 2000,
        }),
      );
    }
    if (generateQrSuccess && generateProjectLog?.status === 'PENDING') {
      if (generateProjectLogIntervalCb === null) {
        generateProjectLogIntervalCb = setInterval(() => {
          dispatch(
            GenerateProjectLog(`${enviroment.baseApiUrl}/projects/generate-log/`, {
              project_id: projectDetailsResponse?.id,
              uuid: generateQrSuccess.task_id,
            }),
          );
        }, 2000);
      }
    }
  }, [generateQrSuccess, generateProjectLog]);
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
  const divRef = useRef(null);
  useEffect(() => {
    console.log(divRef?.current, 'current');
    if (!divRef?.current) return;
    const myDiv = divRef?.current;
    myDiv.scrollTop = myDiv?.scrollHeight;
  });

  const { handleSubmit, handleCustomChange, values, errors }: any = useForm(
    projectDetails,
    submission,
    SelectFormValidation,
  );

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setActiveStep(1.5);
  }, []);

  return (
    <CoreModules.Stack sx={{ width: '80%', display: 'flex', flexDirection: 'row' }}>
      <CoreModules.Stack sx={{ width: '50%' }}>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <CoreModules.FormControl sx={{ mb: 3, width: '60%' }} variant="filled">
              <InputLabel
                id="form-category"
                sx={{
                  '&.Mui-focused': {
                    color: defaultTheme.palette.black,
                  },
                }}
              >
                Data Extract Category
              </InputLabel>
              <Select
                labelId="data_extractWays-label"
                id="data_extractWays"
                value={values.data_extractWays}
                label="Data Extract Category"
                onChange={(e) => handleCustomChange('data_extractWays', e.target.value)}
              >
                {/* onChange={(e) => dispatch(CreateProjectActions.SetProjectDetails({ key: 'xform_title', value: e.target.value }))} > */}
                {selectExtractWays?.map((form) => (
                  <MenuItem value={form.value}>{form.label}</MenuItem>
                ))}
              </Select>
              {errors.data_extractWays && (
                <CoreModules.FormLabel component="h3" sx={{ color: defaultTheme.palette.error.main }}>
                  {errors.data_extractWays}
                </CoreModules.FormLabel>
              )}
            </CoreModules.FormControl>
            <CoreModules.FormControl sx={{ mb: 3, width: '60%' }} variant="filled">
              <InputLabel
                id="form-category"
                sx={{
                  '&.Mui-focused': {
                    color: defaultTheme.palette.black,
                  },
                }}
              >
                Form Category
              </InputLabel>
              <Select
                labelId="form_category-label"
                id="form_category"
                value={values.xform_title}
                label="Form Category"
                onChange={(e) => handleCustomChange('xform_title', e.target.value)}
              >
                {/* onChange={(e) => dispatch(CreateProjectActions.SetProjectDetails({ key: 'xform_title', value: e.target.value }))} > */}
                {formCategoryData?.map((form) => (
                  <MenuItem value={form.value}>{form.label}</MenuItem>
                ))}
              </Select>
              {errors.xform_title && (
                <CoreModules.FormLabel component="h3" sx={{ color: defaultTheme.palette.error.main }}>
                  {errors.xform_title}
                </CoreModules.FormLabel>
              )}
            </CoreModules.FormControl>
            <CoreModules.FormControl sx={{ mb: 3, width: '60%' }} variant="filled">
              <InputLabel
                id="form-category"
                sx={{
                  '&.Mui-focused': {
                    color: defaultTheme.palette.black,
                  },
                }}
              >
                Form Selection
              </InputLabel>
              <Select
                labelId="form_ways-label"
                id="form_ways"
                value={values.form_ways}
                label="Form Ways"
                onChange={(e) => handleCustomChange('form_ways', e.target.value)}
                // onChange={(e) => dispatch(CreateProjectActions.SetProjectDetails({ key: 'form_ways', value: e.target.value }))}
              >
                {selectFormWays?.map((form) => (
                  <MenuItem value={form.value}>{form.label}</MenuItem>
                ))}
              </Select>
              {errors.form_ways && (
                <CoreModules.FormLabel component="h3" sx={{ color: defaultTheme.palette.error.main }}>
                  {errors.form_ways}
                </CoreModules.FormLabel>
              )}
            </CoreModules.FormControl>

            {values.form_ways === 'Upload a Custom Form' ? (
              <>
                <a download>
                  Download Form Template{' '}
                  <CoreModules.IconButton style={{ borderRadius: 0 }} color="primary" component="label">
                    <AssetModules.FileDownloadIcon style={{ color: '#2DCB70' }} />
                  </CoreModules.IconButton>
                </a>
                <CoreModules.FormLabel>Upload XLS Form</CoreModules.FormLabel>
                <CoreModules.Button variant="contained" component="label">
                  <CoreModules.Input
                    type="file"
                    onChange={(e) => {
                      handleCustomChange('uploaded_form', e.target.files);
                      // setFormFileUpload(e.target.files)
                    }}
                  />
                </CoreModules.Button>
                {!values.uploaded_form && (
                  <CoreModules.FormLabel component="h3" sx={{ mt: 2, color: defaultTheme.palette.error.main }}>
                    Form File is required.
                  </CoreModules.FormLabel>
                )}
              </>
            ) : null}

            <CoreModules.Stack
              sx={{ display: 'flex', flexDirection: 'row', width: '60%', justifyContent: 'space-between' }}
            >
              {/* Previous Button  */}
              <Link to="/create-project">
                <CoreModules.Button variant="outlined" color="error" sx={{ padding: '8px' }}>
                  Previous
                </CoreModules.Button>
              </Link>
              {/* END */}

              {/* Submit Button For Create Project on Area Upload */}
              <CoreModules.Stack>
                <CoreModules.Button
                  sx={{ padding: '8px' }}
                  variant="contained"
                  color="error"
                  type="submit"
                  // disabled={!fileUpload ? true : false}
                >
                  Next
                </CoreModules.Button>
              </CoreModules.Stack>
              {/* END */}
            </CoreModules.Stack>
          </FormGroup>
        </form>
      </CoreModules.Stack>
      <CoreModules.Stack sx={{ display: 'flex', flexDirection: 'col', gap: 2, width: '40%' }}>
        <CoreModules.Typography variant="subtitle1">Progress Bar</CoreModules.Typography>
        <LoadingBar steps={totalSteps} activeStep={activeStep} />
      </CoreModules.Stack>
      {generateProjectLog ? (
        <CoreModules.Stack sx={{ width: '60%', height: '68vh' }}>
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
  );
};
export default FormSelection;
