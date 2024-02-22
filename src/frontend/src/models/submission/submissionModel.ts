export type taskInfoType = {
  task_id: string;
  submission_count: number;
  last_submission: string | null;
  feature_count: number;
};

export type reviewListType = {
  id: string;
  title: string;
  className: string;
  hoverClass: string;
};
