import React from 'react';
import TaskSubmissionsMap from './TaskSubmissionsMap';
import InputTextField from '../../components/common/InputTextField';
import Button from '../../components/common/Button';
import AssetModules from '../../shared/AssetModules.js';

const TaskSubmissions = () => {
  const TaskCard = () => (
    <div className="fmtm-bg-red-50 fmtm-px-5 fmtm-pb-5 fmtm-pt-2 fmtm-rounded-lg">
      <div className="fmtm-flex fmtm-flex-col fmtm-gap-4">
        <div className="fmtm-flex fmtm-flex-col fmtm-gap-1">
          <p>#12346</p>
          <div className="fmtm-flex fmtm-justify-between">
            <p>Expected Count</p>
            <p>25</p>
          </div>
          <div className="fmtm-flex fmtm-justify-between">
            <p>Submission Count</p>
            <p>27</p>
          </div>
        </div>
        <div className="fmtm-flex fmtm-justify-between fmtm-items-center">
          <Button btnText="View Submissions" btnType="primary" onClick={() => {}} />
          <button className="fmtm-border-primaryRed fmtm-border-[2px] fmtm-flex fmtm-w-fit fmtm-px-2 fmtm-py-1 fmtm-rounded-md fmtm-items-center fmtm-gap-2 fmtm-bg-white hover:fmtm-bg-gray-100 fmtm-duration-150">
            <AssetModules.MapIcon style={{ fontSize: '18px' }} /> <p className="fmtm-truncate">Zoom to Task</p>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fmtm-h-[70vh] fmtm-flex fmtm-gap-10">
      <div className="fmtm-w-[39rem] fmtm-bg-white fmtm-rounded-xl fmtm-p-5">
        <InputTextField fieldType="string" label="" onChange={() => {}} value="" placeholder="Search by task id" />
        <div className="fmtm-mt-5 fmtm-flex fmtm-flex-col fmtm-gap-4 fmtm-h-[58vh] fmtm-overflow-y-scroll scrollbar">
          {Array.from({ length: 10 }, (_, index) => (
            <TaskCard />
          ))}
        </div>
      </div>
      <div className="fmtm-h-full fmtm-w-full fmtm-rounded-xl fmtm-overflow-hidden">
        <TaskSubmissionsMap />
      </div>
    </div>
  );
};

export default TaskSubmissions;
