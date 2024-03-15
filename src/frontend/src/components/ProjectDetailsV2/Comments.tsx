import React, { useEffect, useState } from 'react';
import RichTextEditor from '@/components/common/Editor/Editor';
import Button from '@/components/common/Button';
import { PostProjectComments, GetProjectComments } from '@/api/Project';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import environment from '@/environment';
import { useAppSelector } from '@/types/reduxTypes';
import AssetModules from '@/shared/AssetModules';
import { ProjectCommentsSekeletonLoader } from '@/components/ProjectDetailsV2/SkeletonLoader';
import { ProjectActions } from '@/store/slices/ProjectSlice';

const Comments = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const [comment, setComment] = useState('');
  const projectCommentsList = useAppSelector((state) => state?.project?.projectCommentsList);
  const projectGetCommentsLoading = useAppSelector((state) => state?.project?.projectGetCommentsLoading);
  const projectPostCommentsLoading = useAppSelector((state) => state?.project?.projectPostCommentsLoading);

  const projectId = environment.decode(params.id);

  useEffect(() => {
    dispatch(
      GetProjectComments(`${import.meta.env.VITE_API_URL}/tasks/task-comments/?project_id=${projectId}&task_id=3968`),
    );
  }, []);

  const handleComment = () => {
    dispatch(
      PostProjectComments(`${import.meta.env.VITE_API_URL}/tasks/task-comments/`, {
        task_id: 3968,
        project_id: projectId,
        comment,
      }),
    );
    // dispatch(ProjectActions.ClearEditorContent(true));
    setComment('');
  };

  return (
    <div style={{ height: 'calc(100% - 60px)' }} className="fmtm-w-full fmtm-z-50">
      <div style={{ height: 'calc(100% - 271px)' }} className="fmtm-overflow-y-scroll scrollbar">
        {projectGetCommentsLoading ? (
          <div className="fmtm-flex fmtm-flex-col fmtm-gap-4 fmtm-mb-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProjectCommentsSekeletonLoader key={i} />
            ))}
          </div>
        ) : (
          <div className="fmtm-flex fmtm-flex-col fmtm-gap-4 fmtm-mb-1">
            {projectCommentsList?.map((projectComment, i) => (
              <div key={i} className="fmtm-flex fmtm-w-full fmtm-gap-4 fmtm-px-2">
                <div className="fmtm-h-8 fmtm-w-8 fmtm-rounded-full fmtm-flex fmtm-justify-center fmtm-items-center fmtm-bg-white">
                  <AssetModules.PersonIcon color="success" sx={{ fontSize: '30px' }} />
                </div>
                <div className=" fmtm-flex-1">
                  <div className="fmtm-flex fmtm-gap-3 fmtm-items-center">
                    <p>{projectComment?.commented_by}</p>
                    <p className="fmtm-text-sm fmtm-text-gray-600">
                      {projectComment?.created_at?.split('T')[0]} {projectComment?.created_at?.split('T')[1]}
                    </p>
                  </div>
                  <div className="fmtm-mt-2">
                    <RichTextEditor editorHtmlContent={projectComment?.comment} editable={false} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="fmtm-pt-2">
        <RichTextEditor
          editorHtmlContent={comment}
          setEditorHtmlContent={(content) => setComment(content)}
          editable={true}
        />
      </div>
      <div className="fmtm-mt-2 fmtm-w-full fmtm-flex fmtm-justify-center">
        <Button type="button" btnText="Comment" btnType="primary" className="!fmtm-rounded" onClick={handleComment} />
      </div>
    </div>
  );
};

export default Comments;
