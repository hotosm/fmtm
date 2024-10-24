export enum task_split_type {
  divide_on_square = 'DIVIDE_ON_SQUARE',
  choose_area_as_task = 'CHOOSE_AREA_AS_TASK',
  task_splitting_algorithm = 'TASK_SPLITTING_ALGORITHM',
}

export enum task_status {
  READY = 'READY',
  LOCKED_FOR_MAPPING = 'LOCKED_FOR_MAPPING',
  MAPPED = 'MAPPED',
  LOCKED_FOR_VALIDATION = 'LOCKED_FOR_VALIDATION',
  VALIDATED = 'VALIDATED',
  INVALIDATED = 'INVALIDATED',
  BAD = 'BAD',
  SPLIT = 'SPLIT',
  ARCHIVED = 'ARCHIVED',
}

export enum user_roles {
  READ_ONLY = 'READ_ONLY',
  MAPPER = 'MAPPER',
  ADMIN = 'ADMIN',
}
