import React, { useEffect, useState } from 'react';
import '../../node_modules/ol/ol.css';
import '../styles/home.scss';
import ActivitiesPanel from '@/components/ProjectDetails/ActivitiesPanel';
import { ProjectById, GetEntityStatusList, GetGeometryLog } from '@/api/Project';
import { ProjectActions } from '@/store/slices/ProjectSlice';
import CoreModules from '@/shared/CoreModules';
import AssetModules from '@/shared/AssetModules';
import GenerateBasemap from '@/components/GenerateBasemap';
import TaskSelectionPopup from '@/components/ProjectDetails/TaskSelectionPopup';
import FeatureSelectionPopup from '@/components/ProjectDetails/FeatureSelectionPopup';
import DialogTaskActions from '@/components/DialogTaskActions';
import MobileFooter from '@/components/ProjectDetails/MobileFooter';
import MobileActivitiesContents from '@/components/ProjectDetails/MobileActivitiesContents';
import BottomSheet from '@/components/common/BottomSheet';
import MobileProjectInfoContent from '@/components/ProjectDetails/MobileProjectInfoContent';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectOptions from '@/components/ProjectDetails/ProjectOptions';
import Button from '@/components/common/Button';
import ProjectInfo from '@/components/ProjectDetails/ProjectInfo';
import useOutsideClick from '@/hooks/useOutsideClick';
import { useAppDispatch, useAppSelector } from '@/types/reduxTypes';
import Comments from '@/components/ProjectDetails/Comments';
import Instructions from '@/components/ProjectDetails/Instructions';
import useDocumentTitle from '@/utilfunctions/useDocumentTitle';
import ProjectDetailsMap from '@/components/ProjectDetails/ProjectDetailsMap';

const VITE_API_URL = import.meta.env.VITE_API_URL;

type tabType = 'project_info' | 'task_activity' | 'comments' | 'instructions';

const tabList: { id: tabType; name: string }[] = [
  { id: 'project_info', name: 'Project Info' },
  { id: 'task_activity', name: 'Task Activity' },
  { id: 'comments', name: 'Comments' },
  { id: 'instructions', name: 'Instructions' },
];

const ProjectDetails = () => {
  useDocumentTitle('Project Details');
  const dispatch = useAppDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [divRef, toggle, handleToggle] = useOutsideClick();

  const projectId: string | undefined = params.id;

  const [map, setMap] = useState();
  const [selectedTaskArea, setSelectedTaskArea] = useState<Record<string, any> | null>(null);
  const [selectedTaskFeature, setSelectedTaskFeature] = useState();
  const [selectedTab, setSelectedTab] = useState<tabType>('project_info');

  const defaultTheme = useAppSelector((state) => state.theme.hotTheme);
  const projectTaskBoundries = useAppSelector((state) => state.project.projectTaskBoundries);
  const projectInfo = useAppSelector((state) => state.project.projectInfo);
  const selectedTask = useAppSelector((state) => state.task.selectedTask);
  const selectedFeatureProps = useAppSelector((state) => state.task.selectedFeatureProps);
  const mobileFooterSelection = useAppSelector((state) => state.project.mobileFooterSelection);
  const projectDetailsLoading = useAppSelector((state) => state.project.projectDetailsLoading);
  const taskModalStatus = useAppSelector((state) => state.project.taskModalStatus);

  useEffect(() => {
    if (projectInfo.name) {
      document.title = `${projectInfo.name} - HOT Field Mapping Tasking Manager`;
    } else {
      document.title = 'HOT Field Mapping Tasking Manager';
    }
  }, [projectInfo.name]);

  //Fetch project for the first time
  useEffect(() => {
    if (!projectId) return;

    dispatch(ProjectActions.SetNewProjectTrigger());
    if (projectTaskBoundries.findIndex((project) => project.id.toString() === projectId) == -1) {
      dispatch(ProjectActions.SetProjectTaskBoundries([]));
      dispatch(ProjectById(projectId));
    } else {
      dispatch(ProjectActions.SetProjectTaskBoundries([]));
      dispatch(ProjectById(projectId));
    }
    return () => {};
  }, [projectId]);

  useEffect(() => {
    if (mobileFooterSelection !== '') {
      dispatch(ProjectActions.ToggleGenerateMbTilesModalStatus(false));
    }
  }, [mobileFooterSelection]);

  useEffect(() => {
    if (taskModalStatus) {
      dispatch(ProjectActions.ToggleTaskModalStatus(false));
    }
  }, []);

  useEffect(() => {
    if (taskModalStatus) {
      setSelectedTab('task_activity');
    } else {
      setSelectedTab('project_info');
    }
  }, [taskModalStatus]);

  const getEntityStatusList = () => {
    dispatch(GetEntityStatusList(`${VITE_API_URL}/projects/${projectId}/entities/statuses`));
  };

  const getGeometryLog = () => {
    dispatch(GetGeometryLog(`${VITE_API_URL}/projects/${projectId}/geometry/records`));
  };

  useEffect(() => {
    getEntityStatusList();
    getGeometryLog();
  }, []);

  const getTabContent = (tabState: tabType) => {
    switch (tabState) {
      case 'project_info':
        return <ProjectInfo />;
      case 'task_activity':
        return <ActivitiesPanel params={params} state={projectTaskBoundries} defaultTheme={defaultTheme} map={map} />;
      case 'comments':
        return <Comments />;
      case 'instructions':
        return <Instructions instructions={projectInfo?.instructions} />;
      default:
        return <></>;
    }
  };

  const getMobileBottomSheetContent = (
    mobileTabState: '' | 'projectInfo' | 'activities' | 'comment' | 'instructions',
  ) => {
    switch (mobileTabState) {
      case 'projectInfo':
        return <MobileProjectInfoContent projectInfo={projectInfo} />;
      case 'activities':
        return <MobileActivitiesContents map={map} />;
      case 'instructions':
        return (
          <div className="fmtm-mb-[10vh]">
            <Instructions instructions={projectInfo?.instructions} />
          </div>
        );
      case 'comment':
        return (
          <div className="fmtm-mb-[10vh]">
            <Comments />
          </div>
        );
      default:
        return <></>;
    }
  };

  return (
    <div className="fmtm-bg-[#f5f5f5] !fmtm-h-[100dvh] sm:!fmtm-h-full">
      {/* Customized Modal For Generate Tiles */}
      <GenerateBasemap projectInfo={projectInfo} />

      <div className="fmtm-flex fmtm-h-full fmtm-gap-6">
        <div className="fmtm-w-[22rem] fmtm-h-full fmtm-hidden md:fmtm-block">
          <div className="fmtm-flex fmtm-justify-between fmtm-items-center fmtm-mb-4">
            {projectDetailsLoading ? (
              <div className="fmtm-flex fmtm-gap-1 fmtm-items-center">
                <p className="fmtm-text-[#9B9999]">#</p>
                <CoreModules.Skeleton className="!fmtm-w-[50px] fmtm-h-[20px]" />
              </div>
            ) : (
              <p className="fmtm-text-lg fmtm-font-archivo fmtm-text-[#9B9999]">{`#${projectInfo.id}`}</p>
            )}
            <Button variant="secondary-red" onClick={() => navigate(`/manage/project/${params?.id}`)}>
              MANAGE PROJECT <AssetModules.SettingsIcon />
            </Button>
          </div>
          <div
            className="fmtm-flex fmtm-flex-col fmtm-gap-4 fmtm-flex-auto"
            style={{ height: `${selectedTab === 'comments' ? 'calc(100% - 63px)' : 'calc(100% - 103px)'}` }}
          >
            {projectDetailsLoading ? (
              <CoreModules.Skeleton className="!fmtm-w-[250px] fmtm-h-[25px]" />
            ) : (
              <div className="fmtm-relative">
                <p className="fmtm-text-xl fmtm-font-archivo fmtm-line-clamp-3 fmtm-mr-4" title={projectInfo.name}>
                  {projectInfo.name}
                </p>
              </div>
            )}
            <div className="fmtm-w-full fmtm-h-1 fmtm-bg-white"></div>
            <div className="fmtm-flex fmtm-w-full">
              {tabList.map((tab) => (
                <button
                  key={tab.id}
                  className={`fmtm-rounded-none fmtm-border-none fmtm-text-base fmtm-py-1 ${
                    selectedTab === tab.id
                      ? 'fmtm-bg-primaryRed fmtm-text-white hover:fmtm-bg-red-700'
                      : 'fmtm-bg-white fmtm-text-[#706E6E] hover:fmtm-bg-grey-50'
                  } ${(taskModalStatus && tab.id === 'project_info') || (!taskModalStatus && (tab.id === 'task_activity' || tab.id === 'comments')) ? 'fmtm-hidden' : ''}`}
                  onClick={() => setSelectedTab(tab.id)}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            {getTabContent(selectedTab)}
          </div>
          {selectedTab !== 'comments' && (
            <div className="fmtm-flex fmtm-gap-4">
              <Button
                variant="secondary-red"
                className="!fmtm-w-1/2"
                onClick={() => navigate(`/project-submissions/${projectId}`)}
              >
                VIEW INFOGRAPHICS
              </Button>
              <div className="fmtm-relative fmtm-w-1/2" ref={divRef}>
                <Button variant="secondary-red" className="fmtm-w-full" onClick={handleToggle}>
                  DOWNLOAD
                </Button>
                <div
                  className={`fmtm-flex fmtm-gap-4 fmtm-absolute fmtm-duration-200 fmtm-z-[1000] fmtm-bg-[#F5F5F5] fmtm-px-2 fmtm-py-[2px] fmtm-rounded ${
                    toggle
                      ? 'fmtm-left-0 fmtm-bottom-0 lg:fmtm-top-0'
                      : '-fmtm-left-[65rem] fmtm-bottom-0 lg:fmtm-top-0'
                  }`}
                >
                  <ProjectOptions projectName={projectInfo?.name as string} />
                </div>
              </div>
            </div>
          )}
        </div>
        {projectId && (
          <div className="fmtm-relative sm:fmtm-static fmtm-flex-grow fmtm-h-full sm:fmtm-rounded-2xl fmtm-overflow-hidden">
            <ProjectDetailsMap
              setSelectedTaskArea={setSelectedTaskArea}
              setSelectedTaskFeature={setSelectedTaskFeature}
              setMap={setMap}
            />
            <div
              className="fmtm-absolute fmtm-top-4 fmtm-left-4 fmtm-bg-white fmtm-rounded-full fmtm-p-1 hover:fmtm-bg-red-50 fmtm-duration-300 fmtm-border-[1px] md:fmtm-hidden fmtm-cursor-pointer"
              onClick={() => navigate('/')}
            >
              <AssetModules.ArrowBackIcon className="fmtm-text-grey-800" />
            </div>
            {['projectInfo', 'activities', 'instructions', 'comment'].includes(mobileFooterSelection) && (
              <BottomSheet
                body={getMobileBottomSheetContent(mobileFooterSelection)}
                onClose={() => dispatch(ProjectActions.SetMobileFooterSelection(''))}
              />
            )}
            <MobileFooter />
          </div>
        )}
      </div>
      {selectedTaskArea != undefined && selectedTaskFeature === undefined && selectedTask && (
        <TaskSelectionPopup
          taskId={selectedTask}
          feature={selectedTaskArea}
          body={
            <div>
              <DialogTaskActions feature={selectedTaskArea} taskId={selectedTask} />
            </div>
          }
        />
      )}
      {selectedTaskFeature != undefined && selectedTask && selectedTaskArea && (
        <FeatureSelectionPopup featureProperties={selectedFeatureProps} taskId={selectedTask} />
      )}
    </div>
  );
};

export default ProjectDetails;
