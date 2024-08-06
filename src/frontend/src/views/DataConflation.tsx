import React, { useEffect, useState } from 'react';
import ConflationMap from '@/components/DataConflation/ConflationMap';
import TaskInfo from '@/components/DataConflation/TaskInfo';
import { Modal } from '@/components/common/Modal';
import Button from '@/components/common/Button';
import SubmissionConflation from '@/components/DataConflation/SubmissionConflation';
import { useDispatch } from 'react-redux';
import { SubmissionConflationGeojsonService } from '@/api/DataConflation';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/types/reduxTypes';

const DataConflation = () => {
  const dispatch = useDispatch();
  const { projectId, taskId } = useParams();
  const [openModal, setOpenModal] = useState(true);
  const selectedFeatureOSMId = useAppSelector((state) => state.dataconflation.selectedFeatureOSMId);

  useEffect(() => {
    dispatch(
      SubmissionConflationGeojsonService(
        `${
          import.meta.env.VITE_API_URL
        }/submission/conflate-submission-geojson/?project_id=${projectId}&task_id=${taskId}`,
      ),
    );
  }, []);

  return (
    <div className="fmtm-bg-[#F5F5F5] md:fmtm-h-full fmtm-relative fmtm-p-5">
      <Modal
        title={<p className="fmtm-text-left">Merge Data With OSM</p>}
        description={
          <div className="fmtm-mt-1">
            <p className="fmtm-text-sm fmtm-text-[#7A7676]">
              This step compares FMTM submission with OSM tags/geometry, highlighting conflicts in different colors
            </p>
            <div className="fmtm-flex fmtm-gap-[0.625rem] fmtm-justify-end fmtm-mt-5">
              <Button
                btnText="Cancel"
                btnType="other"
                onClick={() => {
                  setOpenModal(false);
                }}
                type="button"
                className="!fmtm-rounded fmtm-text-sm !fmtm-py-2"
              />
              <Button
                btnText="Merge Data"
                btnType="primary"
                onClick={() => {
                  setOpenModal(false);
                }}
                type="button"
                className="!fmtm-rounded fmtm-text-sm !fmtm-py-2"
              />
            </div>
          </div>
        }
        open={false}
        onOpenChange={(status) => setOpenModal(status)}
        className=""
      />

      <div className="fmtm-w-full fmtm-flex fmtm-gap-5 fmtm-flex-col lg:fmtm-flex-row md:fmtm-h-full">
        <div className="2xl:fmtm-w-[20%] lg:fmtm-h-full">
          <TaskInfo />
        </div>
        <div className="md:fmtm-h-[calc(100%-205px)] lg:fmtm-h-full fmtm-flex fmtm-flex-col md:fmtm-flex-row fmtm-gap-5 fmtm-w-full lg:fmtm-w-[80%]">
          <div
            className={`fmtm-h-[50vh] fmtm-w-full md:fmtm-h-full fmtm-duration-200 ${
              selectedFeatureOSMId ? 'md:fmtm-w-[65%]' : 'md:fmtm-w-full'
            }`}
          >
            <ConflationMap />
          </div>
          {selectedFeatureOSMId && (
            <div className="fmtm-w-full md:fmtm-h-full md:fmtm-w-[35%] fmtm-duration-200">
              <SubmissionConflation />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataConflation;
