import React, { useState } from 'react';
import ConflationMap from '@/components/DataConflation/ConflationMap';
import TaskInfo from '@/components/DataConflation/TaskInfo';
import { Modal } from '@/components/common/Modal';
import Button from '@/components/common/Button';

const DataConflation = () => {
  const [openModal, setOpenModal] = useState(true);

  return (
    <div className="fmtm-bg-[#F5F5F5] fmtm-p-6 fmtm-h-full fmtm-relative">
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
        open={openModal}
        onOpenChange={(status) => setOpenModal(status)}
        className=""
      />

      <div className="fmtm-flex fmtm-gap-5 fmtm-w-full fmtm-h-full fmtm-overflow-hidden fmtm-pb-5">
        <TaskInfo />
        <ConflationMap />
      </div>
    </div>
  );
};

export default DataConflation;
