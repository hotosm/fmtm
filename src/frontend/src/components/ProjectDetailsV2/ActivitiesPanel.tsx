/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react';
import environment from '../../environment';
import CoreModules from '../../shared/CoreModules';
import AssetModules from '../../shared/AssetModules';
import { CustomSelect } from '../../components/common/Select';
import profilePic from '../../assets/images/project_icon.png';
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';

const ActivitiesPanel = ({ defaultTheme, state, params, map, view, mapDivPostion, states }) => {
  const displayLimit = 10;
  const [searchText, setSearchText] = useState('');
  const [taskHistories, setTaskHistories] = useState([]);
  const [taskDisplay, setTaskDisplay] = React.useState(displayLimit);
  const [allActivities, setAllActivities] = useState(0);

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
            return { ...history, taskId: task.id, status: task.task_status, outlineGeojson: task.outline_geojson };
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
      // setAllActivities(finalTaskHistory.length);
      setTaskHistories(finalTaskHistory);
    } else {
      // setAllActivities(taskHistories.length);
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
          <div className="fmtm-w-[2.81rem] fmtm-h-[2.81rem] fmtm-rounded-full fmtm-overflow-hidden fmtm-mr-4">
            <img src={profilePic} alt="Profile Picture" />
          </div>
          <div className="fmtm-text-base">
            <span className="fmtm-text-[#555555] fmtm-font-medium fmtm-font-archivo">Shushi_Maps </span>
            <span className="fmtm-text-[#7A7676] fmtm-font-extralight fmtm-italic fmtm-font-archivo">
              updated status to{' '}
            </span>
            <p className="fmtm-font-archivo">Locked For Mapping</p>
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
    <div className="">
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
      <p className="fmtm-text-[#A8A6A6] fmtm-text-base fmtm-my-1">
        showing {taskHistories?.length} of {allActivities} activities
      </p>
      <div className="fmtm-h-[52vh] fmtm-overflow-y-scroll scrollbar">
        {taskHistories?.map((taskHistory) => <ActivitiesCard taskHistory={taskHistory} />)}
      </div>
    </div>
  );
};

export default ActivitiesPanel;
