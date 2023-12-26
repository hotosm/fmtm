/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react';
import environment from '../../environment';
import CoreModules from '../../shared/CoreModules';
import AssetModules from '../../shared/AssetModules';
import { CustomSelect } from '../../components/common/Select';
import profilePic from '../../assets/images/project_icon.png';
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import { ActivitiesCardSkeletonLoader, ShowingCountSkeletonLoader } from './SkeletonLoader';

const ActivitiesPanel = ({ defaultTheme, state, params, map, view, mapDivPostion, states }) => {
  const displayLimit = 10;
  const [searchText, setSearchText] = useState('');
  const [taskHistories, setTaskHistories] = useState([]);
  const [taskDisplay, setTaskDisplay] = React.useState(displayLimit);
  const [allActivities, setAllActivities] = useState(0);
  const projectDetailsLoading = CoreModules.useAppSelector((state) => state?.project?.projectDetailsLoading);

  const handleOnchange = (event) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    const index = state.findIndex((project) => project.id == environment.decode(params.id));
    let taskHistories = [];

    if (index != -1) {
      state[index].taskBoundries.forEach((task) => {
        taskHistories = taskHistories.concat(
          task.task_history.map((history) => {
            return {
              ...history,
              changedToStatus: history.status,
              taskId: task.id,
              status: task.task_status,
              outlineGeojson: task.outline_geojson,
            };
          }),
        );
      });
    }
    setAllActivities(taskHistories.length);

    let finalTaskHistory = taskHistories.filter((task) => {
      return (
        task.taskId.toString().includes(searchText) ||
        task.action_text.split(':')[1].replace(/\s+/g, '').toString().includes(searchText.toString())
      );
    });

    if (searchText != '') {
      setTaskHistories(finalTaskHistory);
    } else {
      setTaskHistories(taskHistories);
    }
  }, [taskDisplay, state, searchText]);

  const zoomToTask = (taskId) => {
    const geojson = taskHistories
      .filter((history) => history.taskId === taskId)
      .map((history) => history.outlineGeojson)[0];

    const olFeature = new Feature({
      geometry: new Polygon(geojson.geometry.coordinates).transform('EPSG:4326', 'EPSG:3857'),
    });
    // Get the extent of the OpenLayers feature
    const extent = olFeature.getGeometry().getExtent();
    map.getView().fit(extent, {
      padding: [0, 0, 0, 0],
    });
  };

  const ActivitiesCard = ({ taskHistory }) => {
    const actionDate = taskHistory?.action_date?.split('T')[0];
    const actionTime = `${taskHistory?.action_date?.split('T')[1].split(':')[0]}:${taskHistory?.action_date
      ?.split('T')[1]
      .split(':')[1]}`;
    return (
      <div className="fmtm-flex fmtm-gap-2 fmtm-items-center fmtm-justify-between fmtm-px-1 fmtm-border-b-[2px] fmtm-border-white fmtm-py-3">
        <div className="fmtm-flex fmtm-items-center">
          <div className="fmtm-w-[2.81rem] fmtm-h-[2.81rem] fmtm-border fmtm-rounded-full fmtm-overflow-hidden fmtm-mr-4">
            {taskHistory?.profile_img ? (
              <img src={taskHistory?.profile_img} alt="Profile Picture" />
            ) : (
              <div className="fmtm-w-full fmtm-h-full fmtm-flex fmtm-justify-center fmtm-items-center fmtm-bg-white">
                <AssetModules.PersonIcon color="success" sx={{ fontSize: '30px' }} />
              </div>
            )}
          </div>
          <div className="fmtm-text-base">
            <span className="fmtm-text-[#555555] fmtm-font-medium fmtm-font-archivo">{taskHistory?.username} </span>
            <span className="fmtm-text-[#7A7676] fmtm-font-extralight fmtm-italic fmtm-font-archivo">
              updated status to{' '}
            </span>
            <p
              style={{ color: defaultTheme.statusTextTheme[taskHistory?.changedToStatus] }}
              className="fmtm-font-archivo"
            >
              {taskHistory?.changedToStatus}
            </p>
            <div className="fmtm-flex fmtm-items-center fmtm-justify-between">
              <p className="fmtm-font-archivo fmtm-text-sm fmtm-text-[#7A7676]">#{taskHistory.taskId}</p>
              <div className="fmtm-flex fmtm-items-center fmtm-mb-1">
                <AssetModules.AccessTimeIcon className="fmtm-text-primaryRed" style={{ fontSize: '20px' }} />
              </div>
              <p className="fmtm-font-archivo fmtm-text-sm fmtm-text-[#7A7676]">
                <span>{actionDate} </span>
                <span>{actionTime}</span>
              </p>
            </div>
          </div>
        </div>
        <div title="Zoom to Task" onClick={() => zoomToTask(taskHistory.taskId)}>
          <AssetModules.MapIcon
            className="fmtm-text-[#9B9999] hover:fmtm-text-[#555555] fmtm-cursor-pointer"
            style={{ fontSize: '20px' }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="fmtm-w-full fmtm-px-2 sm:fmtm-px-0">
      <div className="fmtm-flex fmtm-items-center fmtm-w-full fmtm-gap-2">
        <input
          type="text"
          onChange={handleOnchange}
          value={searchText}
          placeholder="Search by task id or username"
          className="fmtm-w-[67%] fmtm-text-md fmtm-px-1 fmtm-py-[0.18rem] fmtm-outline-none fmtm-border-[1px] fmtm-border-[#E7E2E2]"
        />
        <div className="fmtm-w-[33%]">
          <CustomSelect
            //   title="Organization Name"
            placeholder="Filters"
            //   data={organizationList}
            //   dataKey="value"
            //   value={values.organisation_id?.toString()}
            //   valueKey="value"
            //   label="label"
            //   onValueChange={(value) => handleCustomChange('organisation_id', value && +value)}
            className="fmtm-bg-white fmtm-overflow-hidden"
          />
        </div>
      </div>
      {projectDetailsLoading ? (
        <ShowingCountSkeletonLoader />
      ) : (
        <p className="fmtm-text-[#A8A6A6] fmtm-text-base fmtm-my-1">
          showing {taskHistories?.length} of {allActivities} activities
        </p>
      )}
      <div className="fmtm-h-[52vh] fmtm-overflow-y-scroll scrollbar">
        {projectDetailsLoading ? (
          <div>
            {Array.from({ length: 10 }).map((i) => (
              <ActivitiesCardSkeletonLoader key={i} />
            ))}
          </div>
        ) : (
          <div>{taskHistories?.map((taskHistory) => <ActivitiesCard taskHistory={taskHistory} />)}</div>
        )}
      </div>
    </div>
  );
};

export default ActivitiesPanel;
