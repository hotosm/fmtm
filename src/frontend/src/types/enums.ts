export enum task_split_type {
  divide_on_square = 'DIVIDE_ON_SQUARE',
  choose_area_as_task = 'CHOOSE_AREA_AS_TASK',
  task_splitting_algorithm = 'TASK_SPLITTING_ALGORITHM',
}

export enum task_actions {
  MAP = 'MAP',
  FINISH = 'FINISH',
  VALIDATE = 'VALIDATE',
  GOOD = 'GOOD',
  BAD = 'BAD',
  SPLIT = 'SPLIT',
  MERGE = 'MERGE',
  ASSIGN = 'ASSIGN',
  COMMENT = 'COMMENT',
}

export enum task_state {
  UNLOCKED_TO_MAP = 'UNLOCKED_TO_MAP',
  LOCKED_FOR_MAPPING = 'LOCKED_FOR_MAPPING',
  UNLOCKED_TO_VALIDATE = 'UNLOCKED_TO_VALIDATE',
  LOCKED_FOR_VALIDATION = 'LOCKED_FOR_VALIDATION',
  UNLOCKED_DONE = 'UNLOCKED_DONE',
}

export enum user_roles {
  READ_ONLY = 'READ_ONLY',
  MAPPER = 'MAPPER',
  ADMIN = 'ADMIN',
}
