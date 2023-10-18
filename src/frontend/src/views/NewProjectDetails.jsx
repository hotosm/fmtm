import React, { useEffect, useRef, useState } from 'react';
import '../../node_modules/ol/ol.css';
import '../styles/home.scss';
import WindowDimension from '../hooks/WindowDimension';
import MapDescriptionComponents from '../components/MapDescriptionComponents';
import ActivitiesPanel from '../components/ActivitiesPanel';
import OpenLayersMap from '../components/OpenLayersMap';
import environment from '../environment';
import { ProjectById } from '../api/Project';
import { ProjectActions } from '../store/slices/ProjectSlice';
import CustomizedSnackbar from '../utilities/CustomizedSnackbar';
import { defaults } from 'ol/control/defaults';
import OnScroll from '../hooks/OnScroll';
import TasksLayer from '../components/TasksLayer';
import { HomeActions } from '../store/slices/HomeSlice';
import CoreModules from '../shared/CoreModules';
import AssetModules from '../shared/AssetModules';
import FmtmLogo from '../assets/images/hotLog.png';

import GenerateMbTiles from '../components/GenerateMbTiles';
import { ProjectBuildingGeojsonService } from '../api/SubmissionService';
import TaskSectionPopup from '../components/ProjectDetails/TaskSectionPopup';
import DialogTaskActions from '../components/DialogTaskActions';
import QrcodeComponent from '../components/QrcodeComponent';
import MobileFooter from '../components/ProjectDetails/MobileFooter';
import MobileActivitiesContents from '../components/ProjectDetails/MobileActivitiesContents';
import BottomSheet from '../components/common/BottomSheet';
import MobileProjectInfoContent from '../components/ProjectDetails/MobileProjectInfoContent';
import { useNavigate } from 'react-router-dom';
import ProjectOptions from '../components/ProjectDetails/ProjectOptions';
import { MapContainer as MapComponent, useOLMap } from '../components/MapComponent/OpenLayersComponent';
import LayerSwitcherControl from '../components/MapComponent/OpenLayersComponent/LayerSwitcher/index';
import MapControlComponent from '../components/ProjectDetails/MapControlComponent';
import { VectorLayer } from '../components/MapComponent/OpenLayersComponent/Layers';
import { geojsonObjectModel } from '../constants/geojsonObjectModal';
import { buildingStyle, basicGeojsonTemplate } from '../utilities/mapUtils';

const Home = () => {
  const dispatch = CoreModules.useAppDispatch();
  const params = CoreModules.useParams();
  const navigate = useNavigate();

  const defaultTheme = CoreModules.useAppSelector((state) => state.theme.hotTheme);
  const state = CoreModules.useAppSelector((state) => state.project);
  const taskModalStatus = CoreModules.useAppSelector((state) => state.project.taskModalStatus);

  const projectInfo = CoreModules.useAppSelector((state) => state.home.selectedProject);
  const stateDialog = CoreModules.useAppSelector((state) => state.home.dialogStatus);
  const stateSnackBar = CoreModules.useAppSelector((state) => state.home.snackbar);
  const [taskId, setTaskId] = useState();
  const [toggleGenerateModal, setToggleGenerateModal] = useState(false);
  const [mainView, setView] = useState();
  const [featuresLayer, setFeaturesLayer] = useState();
  const encodedId = params.id;
  const decodedId = environment.decode(encodedId);
  const { windowSize, type } = WindowDimension();
  const projectBuildingGeojson = CoreModules.useAppSelector((state) => state.project.projectBuildingGeojson);
  const mobileFooterSelection = CoreModules.useAppSelector((state) => state.project.mobileFooterSelection);
  const [taskBuildingGeojson, setTaskBuildingGeojson] = useState(null);
  const [initialFeaturesLayer, setInitialFeaturesLayer] = useState(null);
  //snackbar handle close funtion
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(
      HomeActions.SetSnackBar({
        open: false,
        message: stateSnackBar.message,
        variant: stateSnackBar.variant,
        duration: 0,
      }),
    );
  };
  //Fetch project for the first time
  useEffect(() => {
    dispatch(ProjectActions.SetNewProjectTrigger());
    if (state.projectTaskBoundries.findIndex((project) => project.id == environment.decode(encodedId)) == -1) {
      dispatch(ProjectActions.SetProjectTaskBoundries([]));

      dispatch(
        ProjectById(
          `${import.meta.env.VITE_API_URL}/projects/${environment.decode(encodedId)}`,
          state.projectTaskBoundries,
          environment.decode(encodedId),
        ),
        state.projectTaskBoundries,
      );
      // dispatch(ProjectBuildingGeojsonService(`${import.meta.env.VITE_API_URL}/projects/${environment.decode(encodedId)}/features`))
    } else {
      dispatch(ProjectActions.SetProjectTaskBoundries([]));
      dispatch(
        ProjectById(
          `${import.meta.env.VITE_API_URL}/projects/${environment.decode(encodedId)}`,
          state.projectTaskBoundries,
          environment.decode(encodedId),
        ),
        state.projectTaskBoundries,
      );
    }
    if (Object.keys(state.projectInfo)?.length == 0) {
      dispatch(ProjectActions.SetProjectInfo(projectInfo));
    } else {
      if (state.projectInfo.id != environment.decode(encodedId)) {
        dispatch(ProjectActions.SetProjectInfo(projectInfo));
      }
    }
    return () => {
      dispatch(ProjectActions.SetProjectBuildingGeojson(null));
    };
  }, [params.id]);

  const { mapRef, map } = useOLMap({
    center: [0, 0],
    zoom: 4,
    // maxZoom: 17,
  });

  const { y } = OnScroll(map, windowSize.width);

  useEffect(() => {
    if (!map) return;

    // console.log(state.projectTaskBoundries[0]?.taskBoundries);
    const features = state.projectTaskBoundries[0]?.taskBoundries?.map((feature) => ({
      type: 'Feature',
      geometry: { ...feature.outline_geojson.geometry },
      properties: {
        ...feature.outline_geojson.properties,
        centroid: feature.bbox,
      },
      id: `${feature.project_task_name}_${feature.task_status_str}`,
    }));
    const taskBuildingGeojsonFeatureCollection = {
      ...geojsonObjectModel,
      features: features,
    };
    setInitialFeaturesLayer(taskBuildingGeojsonFeatureCollection);
  }, [state.projectTaskBoundries[0]?.taskBoundries]);

  // console.log(initialFeaturesLayer, 'initialFeaturesLayer');
  // console.log(featuresLayer, 'featuresLayer');

  useEffect(() => {
    if (!map) return;
    if (!projectBuildingGeojson) return;

    const taskBuildingGeojsonFeatureCollection = {
      ...basicGeojsonTemplate,
      features: [
        ...projectBuildingGeojson?.map((feature) => ({
          ...feature.geometry,
          id: feature.id,
        })),
      ],
    };

    setTaskBuildingGeojson(taskBuildingGeojsonFeatureCollection);
  }, [map, projectBuildingGeojson]);

  // TasksLayer(map, mainView, featuresLayer);
  const projectClickOnMap = (properties, feature) => {
    setFeaturesLayer(feature, 'feature');
    let extent = properties.geometry.getExtent();
    dispatch(
      ProjectBuildingGeojsonService(
        `${import.meta.env.VITE_API_URL}/projects/${decodedId}/features?task_id=${properties.uid}`,
      ),
    );
    mapRef.current?.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    });
    setTaskId(properties.uid);
    dispatch(ProjectActions.ToggleTaskModalStatus(true));
    if (windowSize.width < 768) {
      map.getView().fit(extent, {
        padding: [10, 20, 300, 20],
      });
    } else {
      map.getView().fit(extent, {
        padding: [20, 350, 50, 10],
      });
    }
  };

  return (
    <div>
      {/* Customized Modal For Generate Tiles */}
      <div>
        <GenerateMbTiles
          toggleGenerateModal={toggleGenerateModal}
          setToggleGenerateModal={setToggleGenerateModal}
          projectInfo={state.projectInfo}
        />

        {/* Home snackbar */}
        <CustomizedSnackbar
          duration={stateSnackBar.duration}
          open={stateSnackBar.open}
          variant={stateSnackBar.variant}
          message={stateSnackBar.message}
          handleClose={handleClose}
        />
      </div>

      {/* Top project details heading medium dimension*/}
      {windowSize.width >= 640 && (
        <div>
          <CoreModules.Stack
            sx={{ display: { md: 'flex', xs: 'none' } }}
            direction="column"
            justifyContent="center"
            spacing={5}
            alignItems={'center'}
          >
            <CoreModules.Stack
              direction={'row'}
              p={2}
              spacing={2}
              divider={
                <CoreModules.Divider
                  sx={{ backgroundColor: defaultTheme.palette.grey['main'] }}
                  orientation="vertical"
                  flexItem
                />
              }
            >
              <CoreModules.Stack direction={'row'} justifyContent={'center'}>
                <AssetModules.LocationOn color="error" style={{ fontSize: 22 }} />
                <CoreModules.Typography variant="h1">{state.projectInfo.title}</CoreModules.Typography>
              </CoreModules.Stack>

              <CoreModules.Stack>
                <CoreModules.Typography variant="h4" fontSize={defaultTheme.typography.fontSize}>
                  {`#${state.projectInfo.id}`}
                </CoreModules.Typography>
              </CoreModules.Stack>

              <CoreModules.Stack mt={'5%'}>
                <CoreModules.Typography
                  variant="h4"
                  fontSize={defaultTheme.typography.fontSize}
                  color={defaultTheme.palette.warning['main']}
                >
                  {state.projectInfo.priority_str}
                </CoreModules.Typography>
              </CoreModules.Stack>
            </CoreModules.Stack>
          </CoreModules.Stack>
          {/* project Details Title */}
          <CoreModules.Stack sx={{ display: { xs: 'flex', md: 'none' } }} spacing={2}>
            <CoreModules.Stack direction={'row'} justifyContent={'center'}>
              <AssetModules.LocationOn color="error" style={{ marginTop: '1.5%', fontSize: 22 }} />
              <CoreModules.Typography variant="caption">{state.projectInfo.title}</CoreModules.Typography>
            </CoreModules.Stack>

            <CoreModules.Stack direction={'row'} justifyContent={'center'}>
              <CoreModules.Typography variant="h1" fontSize={defaultTheme.typography.fontSize}>
                {`#${state.projectInfo.id}`}
              </CoreModules.Typography>
            </CoreModules.Stack>

            <CoreModules.Stack direction={'row'} justifyContent={'center'}>
              <CoreModules.Typography
                variant="h1"
                fontSize={defaultTheme.typography.fontSize}
                color={defaultTheme.palette.warning['main']}
              >
                {state.projectInfo.priority_str}
              </CoreModules.Typography>
            </CoreModules.Stack>
          </CoreModules.Stack>
        </div>
      )}

      {/* Center description and map */}
      <CoreModules.Stack direction={'column'} spacing={1}>
        {windowSize.width >= 640 && (
          <div>
            <MapDescriptionComponents defaultTheme={defaultTheme} state={state} type={type} />
            <ProjectOptions setToggleGenerateModal={setToggleGenerateModal} />
          </div>
        )}

        {/* <ProjectMap /> */}
        {params?.id && (
          <div className="fmtm-relative sm:fmtm-static">
            <MapComponent
              ref={mapRef}
              mapInstance={map}
              className={`map naxatw-relative naxatw-min-h-full naxatw-w-full ${
                windowSize.width <= 640
                  ? 'fmtm-h-[100vh]'
                  : 'fmtm-border-y-[4px] sm:fmtm-border-x-[4px] fmtm-border-primaryRed fmtm-h-[608px]'
              }`}
            >
              <LayerSwitcherControl visible={'outdoors'} />

              {initialFeaturesLayer && initialFeaturesLayer?.features?.length > 0 && (
                <VectorLayer
                  geojson={initialFeaturesLayer}
                  // style={projectGeojsonLayerStyle}
                  viewProperties={{
                    size: map?.getSize(),
                    padding: [50, 50, 50, 50],
                    constrainResolution: true,
                    duration: 2000,
                  }}
                  mapOnClick={projectClickOnMap}
                  zoomToLayer
                  zIndex={5}
                />
              )}
              {taskBuildingGeojson && taskBuildingGeojson?.features?.length > 0 && (
                <VectorLayer
                  geojson={taskBuildingGeojson}
                  style={buildingStyle}
                  viewProperties={{
                    size: map?.getSize(),
                    padding: [50, 50, 50, 50],
                    constrainResolution: true,
                    duration: 2000,
                  }}
                  zoomToLayer
                  zIndex={5}
                />
              )}
              <MapControlComponent map={map} />
            </MapComponent>
            <div
              className="fmtm-absolute fmtm-top-4 fmtm-left-4 fmtm-bg-white fmtm-rounded-full fmtm-p-1 hover:fmtm-bg-red-50 fmtm-duration-300 fmtm-border-[1px] sm:fmtm-hidden fmtm-cursor-pointer"
              onClick={() => navigate('/')}
            >
              <AssetModules.ArrowBackIcon className="fmtm-text-grey-800" />
            </div>
            {mobileFooterSelection === 'projectInfo' && (
              <BottomSheet
                body={<MobileProjectInfoContent projectInfo={state.projectInfo} />}
                onClose={() => dispatch(ProjectActions.SetMobileFooterSelection('explore'))}
              />
            )}
            {mobileFooterSelection === 'activities' && (
              <BottomSheet
                body={<MobileActivitiesContents map={map} view={mainView} mapDivPostion={y} />}
                onClose={() => dispatch(ProjectActions.SetMobileFooterSelection('explore'))}
              />
            )}
            {mobileFooterSelection === 'explore' && (
              <div className="fmtm-absolute fmtm-bottom-[5.8rem] sm:fmtm-hidden">
                <img src={FmtmLogo} alt="Hot Fmtm Logo" className="fmtm-ml-2 fmtm-z-10 fmtm-w-[5.2rem]" />
              </div>
            )}
            {mobileFooterSelection === 'others' && (
              <BottomSheet
                body={
                  <div className="fmtm-mb-[10vh]">
                    <ProjectOptions setToggleGenerateModal={setToggleGenerateModal} />
                  </div>
                }
                onClose={() => dispatch(ProjectActions.SetMobileFooterSelection('explore'))}
              />
            )}

            <MobileFooter />
          </div>
        )}
      </CoreModules.Stack>

      {windowSize.width >= 640 && (
        <div>
          <CoreModules.Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <ActivitiesPanel
              params={params}
              state={state.projectTaskBoundries}
              defaultTheme={defaultTheme}
              map={map}
              view={mainView}
              mapDivPostion={y}
              states={state}
            />
          </CoreModules.Stack>
        </div>
      )}
      {featuresLayer != undefined && (
        <TaskSectionPopup
          body={
            <div>
              <DialogTaskActions map={map} view={mainView} feature={featuresLayer} taskId={taskId} />
              <QrcodeComponent defaultTheme={defaultTheme} task={taskId} type={type} />
            </div>
          }
        />
      )}
    </div>
  );
};

export default Home;
