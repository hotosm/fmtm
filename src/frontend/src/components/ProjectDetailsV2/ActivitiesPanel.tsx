/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react';
import environment from '../../environment';
import CoreModules from '../../shared/CoreModules';
import AssetModules from '../../shared/AssetModules';
import { CustomSelect } from '../../components/common/Select';
import profilePic from '../../assets/images/project_icon.png';

const Search = AssetModules.styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: AssetModules.alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: AssetModules.alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  opacity: 0.8,
  border: `1px solid ${theme.palette.warning['main']}`,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = AssetModules.styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = AssetModules.styled(CoreModules.InputBase)(({ theme }) => ({
  color: 'primary',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    fontFamily: theme.typography.h3.fontFamily,
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const ActivitiesPanel = ({ defaultTheme, state, params, map, view, mapDivPostion, states }) => {
  const displayLimit = 10;
  const [searchText, setSearchText] = useState('');
  const [taskHistories, setTaskHistories] = useState([]);
  const [paginationSize, setPaginationSize] = useState(0);
  const [taskDisplay, setTaskDisplay] = React.useState(displayLimit);
  const [allActivities, setAllActivities] = useState(0);
  const [prev, setPrv] = React.useState(0);

  const handleChange = (event, value) => {
    setPrv(value * displayLimit - displayLimit);
    setTaskDisplay(value * displayLimit);
  };

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
            return { ...history, taskId: task.id, status: task.task_status };
          }),
        );
      });
    }

    let finalTaskHistory = taskHistories.filter((task) => {
      return (
        task.taskId.toString().includes(searchText) ||
        task.action_text.split(':')[1].replace(/\s+/g, '').toString().includes(searchText.toString())
      );
    });

    if (searchText != '') {
      setAllActivities(finalTaskHistory.length);
      const tasksToDisplay = finalTaskHistory.filter((task, index) => {
        return index <= taskDisplay - 1 && index >= prev;
      });
      setTaskHistories(tasksToDisplay);
      const paginationSize =
        finalTaskHistory.length % displayLimit == 0
          ? Math.floor(finalTaskHistory.length / displayLimit)
          : Math.floor(finalTaskHistory.length / displayLimit) + 1;
      setPaginationSize(paginationSize);
    } else {
      setAllActivities(taskHistories.length);
      const tasksToDisplay = taskHistories.filter((task, index) => {
        return index <= taskDisplay - 1 && index >= prev;
      });

      setTaskHistories(tasksToDisplay);
      const paginationSize =
        taskHistories.length % displayLimit == 0
          ? Math.floor(taskHistories.length / displayLimit)
          : Math.floor(taskHistories.length / displayLimit) + 1;
      setPaginationSize(paginationSize);
    }
  }, [taskDisplay, state, searchText]);

  const ActivitiesCard = () => {
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
              <p className="fmtm-font-archivo fmtm-text-sm">#12346</p>
              <div className="fmtm-flex fmtm-items-center fmtm-mb-1">
                <AssetModules.AccessTimeIcon className="fmtm-text-primaryRed" style={{ fontSize: '20px' }} />
              </div>
              <p className="fmtm-font-archivo fmtm-text-sm">2023 - 02- 23 : 14:00</p>
            </div>
          </div>
        </div>
        <AssetModules.MapIcon
          className="fmtm-text-[#9B9999] hover:fmtm-text-[#555555] fmtm-cursor-pointer"
          style={{ fontSize: '20px' }}
        />
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
      <p className="fmtm-text-[#A8A6A6] fmtm-text-base fmtm-my-1">showing 6 of 10 activities</p>
      <div className="fmtm-h-[52vh] fmtm-overflow-y-scroll scrollbar">
        {Array.from({ length: 10 }, (_, index) => (
          <ActivitiesCard />
        ))}
      </div>
    </div>
  );
};

export default ActivitiesPanel;
