import React, { useState } from 'react';
import ConflationMap from '@/components/DataConflation/ConflationMap';
import TaskInfo from '@/components/DataConflation/TaskInfo';
import { Modal } from '@/components/common/Modal';
import Button from '@/components/common/Button';
import SubmissionConflation from '@/components/DataConflation/SubmissionConflation';

const DataConflation = () => {
  const [openModal, setOpenModal] = useState(true);
  const [showSubmissionConflation, setShowSubmissionConflation] = useState(true);

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
        <div className="2xl:fmtm-w-[15%] lg:fmtm-h-full">
          <TaskInfo />
        </div>
        <div className="md:fmtm-h-[calc(100%-205px)] lg:fmtm-h-full fmtm-flex fmtm-flex-col md:fmtm-flex-row fmtm-gap-5 fmtm-w-full lg:fmtm-w-[85%]">
          <div className="fmtm-h-[50vh] fmtm-w-full md:fmtm-h-full md:fmtm-w-[60%]">
            <ConflationMap />
          </div>
          <div className="fmtm-w-full md:fmtm-h-full md:fmtm-w-[40%]">
            {showSubmissionConflation && <SubmissionConflation />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataConflation;
