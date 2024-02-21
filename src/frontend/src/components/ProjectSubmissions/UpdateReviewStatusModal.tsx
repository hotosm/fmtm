import React from 'react';
import { Modal } from '@/components/common/Modal';
import CoreModules from '@/shared/CoreModules';
import { useDispatch } from 'react-redux';
import { SubmissionActions } from '@/store/slices/SubmissionSlice';

const UpdateReviewStatusModal = () => {
  const dispatch = useDispatch();
  const updateReviewStatusModal = CoreModules.useAppSelector((state) => state.submission.updateReviewStatusModal);
  console.log(updateReviewStatusModal, 'toggleStatus');
  return (
    <Modal
      className={`fmtm-w-[700px]`}
      description={
        <div>
          <p className="fmtm-text-base"></p>
        </div>
      }
      open={updateReviewStatusModal.toggleModalStatus}
      onOpenChange={(value) => {
        dispatch(
          SubmissionActions.SetUpdateReviewStatusModal({
            toggleModalStatus: value,
            submissionId: null,
          }),
        );
      }}
    />
  );
};

export default UpdateReviewStatusModal;
