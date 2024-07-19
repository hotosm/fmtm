import { z } from 'zod';
import type { Prisma } from './prismaClient';
import { type TableSchema, DbSchema, ElectricClient, type HKT } from 'electric-sql/client/model';
import migrations from './migrations';
import pgMigrations from './pg-migrations';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const QueryModeSchema = z.enum(['default','insensitive']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const Task_historyScalarFieldEnumSchema = z.enum(['project_id','task_id','action','action_text','action_date','user_id','event_id']);

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const taskactionSchema = z.enum(['RELEASED_FOR_MAPPING','LOCKED_FOR_MAPPING','MARKED_MAPPED','LOCKED_FOR_VALIDATION','VALIDATED','MARKED_INVALID','MARKED_BAD','SPLIT_NEEDED','RECREATED','COMMENT']);

export type taskactionType = `${z.infer<typeof taskactionSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// TASK HISTORY SCHEMA
/////////////////////////////////////////

export const Task_historySchema = z.object({
  action: taskactionSchema,
  project_id: z.number().int().gte(-2147483648).lte(2147483647).nullable(),
  task_id: z.number().int().gte(-2147483648).lte(2147483647),
  action_text: z.string().nullable(),
  action_date: z.coerce.date(),
  user_id: z.bigint(),
  event_id: z.string().uuid(),
})

export type Task_history = z.infer<typeof Task_historySchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// TASK HISTORY
//------------------------------------------------------

export const Task_historySelectSchema: z.ZodType<Prisma.Task_historySelect> = z.object({
  project_id: z.boolean().optional(),
  task_id: z.boolean().optional(),
  action: z.boolean().optional(),
  action_text: z.boolean().optional(),
  action_date: z.boolean().optional(),
  user_id: z.boolean().optional(),
  event_id: z.boolean().optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const Task_historyWhereInputSchema: z.ZodType<Prisma.Task_historyWhereInput> = z.object({
  AND: z.union([ z.lazy(() => Task_historyWhereInputSchema),z.lazy(() => Task_historyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => Task_historyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => Task_historyWhereInputSchema),z.lazy(() => Task_historyWhereInputSchema).array() ]).optional(),
  project_id: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  task_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  action: z.union([ z.lazy(() => EnumtaskactionFilterSchema),z.lazy(() => taskactionSchema) ]).optional(),
  action_text: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  action_date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user_id: z.union([ z.lazy(() => BigIntFilterSchema),z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]) ]).optional(),
  event_id: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
}).strict();

export const Task_historyOrderByWithRelationInputSchema: z.ZodType<Prisma.Task_historyOrderByWithRelationInput> = z.object({
  project_id: z.lazy(() => SortOrderSchema).optional(),
  task_id: z.lazy(() => SortOrderSchema).optional(),
  action: z.lazy(() => SortOrderSchema).optional(),
  action_text: z.lazy(() => SortOrderSchema).optional(),
  action_date: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  event_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const Task_historyWhereUniqueInputSchema: z.ZodType<Prisma.Task_historyWhereUniqueInput> = z.object({
  event_id: z.string().uuid().optional()
}).strict();

export const Task_historyOrderByWithAggregationInputSchema: z.ZodType<Prisma.Task_historyOrderByWithAggregationInput> = z.object({
  project_id: z.lazy(() => SortOrderSchema).optional(),
  task_id: z.lazy(() => SortOrderSchema).optional(),
  action: z.lazy(() => SortOrderSchema).optional(),
  action_text: z.lazy(() => SortOrderSchema).optional(),
  action_date: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  event_id: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => Task_historyCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => Task_historyAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => Task_historyMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => Task_historyMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => Task_historySumOrderByAggregateInputSchema).optional()
}).strict();

export const Task_historyScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.Task_historyScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => Task_historyScalarWhereWithAggregatesInputSchema),z.lazy(() => Task_historyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => Task_historyScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => Task_historyScalarWhereWithAggregatesInputSchema),z.lazy(() => Task_historyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  project_id: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  task_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  action: z.union([ z.lazy(() => EnumtaskactionWithAggregatesFilterSchema),z.lazy(() => taskactionSchema) ]).optional(),
  action_text: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  action_date: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  user_id: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]) ]).optional(),
  event_id: z.union([ z.lazy(() => UuidWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const Task_historyCreateInputSchema: z.ZodType<Prisma.Task_historyCreateInput> = z.object({
  project_id: z.number().int().gte(-2147483648).lte(2147483647).optional().nullable(),
  task_id: z.number().int().gte(-2147483648).lte(2147483647),
  action: z.lazy(() => taskactionSchema),
  action_text: z.string().optional().nullable(),
  action_date: z.coerce.date(),
  user_id: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),
  event_id: z.string().uuid()
}).strict();

export const Task_historyUncheckedCreateInputSchema: z.ZodType<Prisma.Task_historyUncheckedCreateInput> = z.object({
  project_id: z.number().int().gte(-2147483648).lte(2147483647).optional().nullable(),
  task_id: z.number().int().gte(-2147483648).lte(2147483647),
  action: z.lazy(() => taskactionSchema),
  action_text: z.string().optional().nullable(),
  action_date: z.coerce.date(),
  user_id: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),
  event_id: z.string().uuid()
}).strict();

export const Task_historyUpdateInputSchema: z.ZodType<Prisma.Task_historyUpdateInput> = z.object({
  project_id: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  task_id: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.lazy(() => taskactionSchema),z.lazy(() => EnumtaskactionFieldUpdateOperationsInputSchema) ]).optional(),
  action_text: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  action_date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user_id: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  event_id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const Task_historyUncheckedUpdateInputSchema: z.ZodType<Prisma.Task_historyUncheckedUpdateInput> = z.object({
  project_id: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  task_id: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.lazy(() => taskactionSchema),z.lazy(() => EnumtaskactionFieldUpdateOperationsInputSchema) ]).optional(),
  action_text: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  action_date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user_id: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  event_id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const Task_historyCreateManyInputSchema: z.ZodType<Prisma.Task_historyCreateManyInput> = z.object({
  project_id: z.number().int().gte(-2147483648).lte(2147483647).optional().nullable(),
  task_id: z.number().int().gte(-2147483648).lte(2147483647),
  action: z.lazy(() => taskactionSchema),
  action_text: z.string().optional().nullable(),
  action_date: z.coerce.date(),
  user_id: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),
  event_id: z.string().uuid()
}).strict();

export const Task_historyUpdateManyMutationInputSchema: z.ZodType<Prisma.Task_historyUpdateManyMutationInput> = z.object({
  project_id: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  task_id: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.lazy(() => taskactionSchema),z.lazy(() => EnumtaskactionFieldUpdateOperationsInputSchema) ]).optional(),
  action_text: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  action_date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user_id: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  event_id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const Task_historyUncheckedUpdateManyInputSchema: z.ZodType<Prisma.Task_historyUncheckedUpdateManyInput> = z.object({
  project_id: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  task_id: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.lazy(() => taskactionSchema),z.lazy(() => EnumtaskactionFieldUpdateOperationsInputSchema) ]).optional(),
  action_text: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  action_date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user_id: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  event_id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const EnumtaskactionFilterSchema: z.ZodType<Prisma.EnumtaskactionFilter> = z.object({
  equals: z.lazy(() => taskactionSchema).optional(),
  in: z.lazy(() => taskactionSchema).array().optional(),
  notIn: z.lazy(() => taskactionSchema).array().optional(),
  not: z.union([ z.lazy(() => taskactionSchema),z.lazy(() => NestedEnumtaskactionFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const BigIntFilterSchema: z.ZodType<Prisma.BigIntFilter> = z.object({
  equals: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  in: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n).array(), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt).array() ]).optional(),
  notIn: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n).array(), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt).array() ]).optional(),
  lt: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  lte: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  gt: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  gte: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  not: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => NestedBigIntFilterSchema) ]).optional(),
}).strict();

export const UuidFilterSchema: z.ZodType<Prisma.UuidFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedUuidFilterSchema) ]).optional(),
}).strict();

export const Task_historyCountOrderByAggregateInputSchema: z.ZodType<Prisma.Task_historyCountOrderByAggregateInput> = z.object({
  project_id: z.lazy(() => SortOrderSchema).optional(),
  task_id: z.lazy(() => SortOrderSchema).optional(),
  action: z.lazy(() => SortOrderSchema).optional(),
  action_text: z.lazy(() => SortOrderSchema).optional(),
  action_date: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  event_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const Task_historyAvgOrderByAggregateInputSchema: z.ZodType<Prisma.Task_historyAvgOrderByAggregateInput> = z.object({
  project_id: z.lazy(() => SortOrderSchema).optional(),
  task_id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const Task_historyMaxOrderByAggregateInputSchema: z.ZodType<Prisma.Task_historyMaxOrderByAggregateInput> = z.object({
  project_id: z.lazy(() => SortOrderSchema).optional(),
  task_id: z.lazy(() => SortOrderSchema).optional(),
  action: z.lazy(() => SortOrderSchema).optional(),
  action_text: z.lazy(() => SortOrderSchema).optional(),
  action_date: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  event_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const Task_historyMinOrderByAggregateInputSchema: z.ZodType<Prisma.Task_historyMinOrderByAggregateInput> = z.object({
  project_id: z.lazy(() => SortOrderSchema).optional(),
  task_id: z.lazy(() => SortOrderSchema).optional(),
  action: z.lazy(() => SortOrderSchema).optional(),
  action_text: z.lazy(() => SortOrderSchema).optional(),
  action_date: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  event_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const Task_historySumOrderByAggregateInputSchema: z.ZodType<Prisma.Task_historySumOrderByAggregateInput> = z.object({
  project_id: z.lazy(() => SortOrderSchema).optional(),
  task_id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const EnumtaskactionWithAggregatesFilterSchema: z.ZodType<Prisma.EnumtaskactionWithAggregatesFilter> = z.object({
  equals: z.lazy(() => taskactionSchema).optional(),
  in: z.lazy(() => taskactionSchema).array().optional(),
  notIn: z.lazy(() => taskactionSchema).array().optional(),
  not: z.union([ z.lazy(() => taskactionSchema),z.lazy(() => NestedEnumtaskactionWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumtaskactionFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumtaskactionFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const BigIntWithAggregatesFilterSchema: z.ZodType<Prisma.BigIntWithAggregatesFilter> = z.object({
  equals: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  in: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n).array(), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt).array() ]).optional(),
  notIn: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n).array(), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt).array() ]).optional(),
  lt: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  lte: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  gt: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  gte: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  not: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => NestedBigIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedBigIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBigIntFilterSchema).optional(),
  _max: z.lazy(() => NestedBigIntFilterSchema).optional()
}).strict();

export const UuidWithAggregatesFilterSchema: z.ZodType<Prisma.UuidWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedUuidWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const EnumtaskactionFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumtaskactionFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => taskactionSchema).optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const BigIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BigIntFieldUpdateOperationsInput> = z.object({
  set: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  increment: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  decrement: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  multiply: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  divide: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedEnumtaskactionFilterSchema: z.ZodType<Prisma.NestedEnumtaskactionFilter> = z.object({
  equals: z.lazy(() => taskactionSchema).optional(),
  in: z.lazy(() => taskactionSchema).array().optional(),
  notIn: z.lazy(() => taskactionSchema).array().optional(),
  not: z.union([ z.lazy(() => taskactionSchema),z.lazy(() => NestedEnumtaskactionFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedBigIntFilterSchema: z.ZodType<Prisma.NestedBigIntFilter> = z.object({
  equals: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  in: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n).array(), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt).array() ]).optional(),
  notIn: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n).array(), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt).array() ]).optional(),
  lt: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  lte: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  gt: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  gte: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  not: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => NestedBigIntFilterSchema) ]).optional(),
}).strict();

export const NestedUuidFilterSchema: z.ZodType<Prisma.NestedUuidFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedUuidFilterSchema) ]).optional(),
}).strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedEnumtaskactionWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumtaskactionWithAggregatesFilter> = z.object({
  equals: z.lazy(() => taskactionSchema).optional(),
  in: z.lazy(() => taskactionSchema).array().optional(),
  notIn: z.lazy(() => taskactionSchema).array().optional(),
  not: z.union([ z.lazy(() => taskactionSchema),z.lazy(() => NestedEnumtaskactionWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumtaskactionFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumtaskactionFilterSchema).optional()
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedBigIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBigIntWithAggregatesFilter> = z.object({
  equals: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  in: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n).array(), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt).array() ]).optional(),
  notIn: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n).array(), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt).array() ]).optional(),
  lt: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  lte: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  gt: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  gte: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  not: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => NestedBigIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedBigIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBigIntFilterSchema).optional(),
  _max: z.lazy(() => NestedBigIntFilterSchema).optional()
}).strict();

export const NestedUuidWithAggregatesFilterSchema: z.ZodType<Prisma.NestedUuidWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedUuidWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const Task_historyFindFirstArgsSchema: z.ZodType<Prisma.Task_historyFindFirstArgs> = z.object({
  select: Task_historySelectSchema.optional(),
  where: Task_historyWhereInputSchema.optional(),
  orderBy: z.union([ Task_historyOrderByWithRelationInputSchema.array(),Task_historyOrderByWithRelationInputSchema ]).optional(),
  cursor: Task_historyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: Task_historyScalarFieldEnumSchema.array().optional(),
}).strict() 

export const Task_historyFindFirstOrThrowArgsSchema: z.ZodType<Prisma.Task_historyFindFirstOrThrowArgs> = z.object({
  select: Task_historySelectSchema.optional(),
  where: Task_historyWhereInputSchema.optional(),
  orderBy: z.union([ Task_historyOrderByWithRelationInputSchema.array(),Task_historyOrderByWithRelationInputSchema ]).optional(),
  cursor: Task_historyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: Task_historyScalarFieldEnumSchema.array().optional(),
}).strict() 

export const Task_historyFindManyArgsSchema: z.ZodType<Prisma.Task_historyFindManyArgs> = z.object({
  select: Task_historySelectSchema.optional(),
  where: Task_historyWhereInputSchema.optional(),
  orderBy: z.union([ Task_historyOrderByWithRelationInputSchema.array(),Task_historyOrderByWithRelationInputSchema ]).optional(),
  cursor: Task_historyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: Task_historyScalarFieldEnumSchema.array().optional(),
}).strict() 

export const Task_historyAggregateArgsSchema: z.ZodType<Prisma.Task_historyAggregateArgs> = z.object({
  where: Task_historyWhereInputSchema.optional(),
  orderBy: z.union([ Task_historyOrderByWithRelationInputSchema.array(),Task_historyOrderByWithRelationInputSchema ]).optional(),
  cursor: Task_historyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() 

export const Task_historyGroupByArgsSchema: z.ZodType<Prisma.Task_historyGroupByArgs> = z.object({
  where: Task_historyWhereInputSchema.optional(),
  orderBy: z.union([ Task_historyOrderByWithAggregationInputSchema.array(),Task_historyOrderByWithAggregationInputSchema ]).optional(),
  by: Task_historyScalarFieldEnumSchema.array(),
  having: Task_historyScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() 

export const Task_historyFindUniqueArgsSchema: z.ZodType<Prisma.Task_historyFindUniqueArgs> = z.object({
  select: Task_historySelectSchema.optional(),
  where: Task_historyWhereUniqueInputSchema,
}).strict() 

export const Task_historyFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.Task_historyFindUniqueOrThrowArgs> = z.object({
  select: Task_historySelectSchema.optional(),
  where: Task_historyWhereUniqueInputSchema,
}).strict() 

export const Task_historyCreateArgsSchema: z.ZodType<Prisma.Task_historyCreateArgs> = z.object({
  select: Task_historySelectSchema.optional(),
  data: z.union([ Task_historyCreateInputSchema,Task_historyUncheckedCreateInputSchema ]),
}).strict() 

export const Task_historyUpsertArgsSchema: z.ZodType<Prisma.Task_historyUpsertArgs> = z.object({
  select: Task_historySelectSchema.optional(),
  where: Task_historyWhereUniqueInputSchema,
  create: z.union([ Task_historyCreateInputSchema,Task_historyUncheckedCreateInputSchema ]),
  update: z.union([ Task_historyUpdateInputSchema,Task_historyUncheckedUpdateInputSchema ]),
}).strict() 

export const Task_historyCreateManyArgsSchema: z.ZodType<Prisma.Task_historyCreateManyArgs> = z.object({
  data: Task_historyCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict() 

export const Task_historyDeleteArgsSchema: z.ZodType<Prisma.Task_historyDeleteArgs> = z.object({
  select: Task_historySelectSchema.optional(),
  where: Task_historyWhereUniqueInputSchema,
}).strict() 

export const Task_historyUpdateArgsSchema: z.ZodType<Prisma.Task_historyUpdateArgs> = z.object({
  select: Task_historySelectSchema.optional(),
  data: z.union([ Task_historyUpdateInputSchema,Task_historyUncheckedUpdateInputSchema ]),
  where: Task_historyWhereUniqueInputSchema,
}).strict() 

export const Task_historyUpdateManyArgsSchema: z.ZodType<Prisma.Task_historyUpdateManyArgs> = z.object({
  data: z.union([ Task_historyUpdateManyMutationInputSchema,Task_historyUncheckedUpdateManyInputSchema ]),
  where: Task_historyWhereInputSchema.optional(),
}).strict() 

export const Task_historyDeleteManyArgsSchema: z.ZodType<Prisma.Task_historyDeleteManyArgs> = z.object({
  where: Task_historyWhereInputSchema.optional(),
}).strict() 

interface Task_historyGetPayload extends HKT {
  readonly _A?: boolean | null | undefined | Prisma.Task_historyArgs
  readonly type: Omit<Prisma.Task_historyGetPayload<this['_A']>, "Please either choose `select` or `include`">
}

export const tableSchemas = {
  task_history: {
    fields: new Map([
      [
        "project_id",
        "INT4"
      ],
      [
        "task_id",
        "INT4"
      ],
      [
        "action",
        "TEXT"
      ],
      [
        "action_text",
        "VARCHAR"
      ],
      [
        "action_date",
        "TIMESTAMP"
      ],
      [
        "user_id",
        "INT8"
      ],
      [
        "event_id",
        "UUID"
      ]
    ]),
    relations: [
    ],
    modelSchema: (Task_historyCreateInputSchema as any)
      .partial()
      .or((Task_historyUncheckedCreateInputSchema as any).partial()),
    createSchema: Task_historyCreateArgsSchema,
    createManySchema: Task_historyCreateManyArgsSchema,
    findUniqueSchema: Task_historyFindUniqueArgsSchema,
    findSchema: Task_historyFindFirstArgsSchema,
    updateSchema: Task_historyUpdateArgsSchema,
    updateManySchema: Task_historyUpdateManyArgsSchema,
    upsertSchema: Task_historyUpsertArgsSchema,
    deleteSchema: Task_historyDeleteArgsSchema,
    deleteManySchema: Task_historyDeleteManyArgsSchema
  } as TableSchema<
    z.infer<typeof Task_historyUncheckedCreateInputSchema>,
    Prisma.Task_historyCreateArgs['data'],
    Prisma.Task_historyUpdateArgs['data'],
    Prisma.Task_historyFindFirstArgs['select'],
    Prisma.Task_historyFindFirstArgs['where'],
    Prisma.Task_historyFindUniqueArgs['where'],
    never,
    Prisma.Task_historyFindFirstArgs['orderBy'],
    Prisma.Task_historyScalarFieldEnum,
    Task_historyGetPayload
  >,
}

export const schema = new DbSchema(tableSchemas, migrations, pgMigrations)
export type Electric = ElectricClient<typeof schema>
