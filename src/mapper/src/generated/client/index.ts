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

export const Tasks_electricScalarFieldEnumSchema = z.enum(['id','project_id','project_task_index','project_task_name','geometry_geojson','feature_count','task_status','locked_by','mapped_by','validated_by']);

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const taskstatusSchema = z.enum(['READY','LOCKED_FOR_MAPPING','MAPPED','LOCKED_FOR_VALIDATION','VALIDATED','INVALIDATED','BAD','SPLIT','ARCHIVED']);

export type taskstatusType = `${z.infer<typeof taskstatusSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// TASKS ELECTRIC SCHEMA
/////////////////////////////////////////

export const Tasks_electricSchema = z.object({
  task_status: taskstatusSchema.nullable(),
  id: z.number().int().gte(-2147483648).lte(2147483647),
  project_id: z.number().int().gte(-2147483648).lte(2147483647),
  project_task_index: z.number().int().gte(-2147483648).lte(2147483647).nullable(),
  project_task_name: z.string().nullable(),
  geometry_geojson: z.string().nullable(),
  feature_count: z.number().int().gte(-2147483648).lte(2147483647).nullable(),
  locked_by: z.bigint().nullable(),
  mapped_by: z.bigint().nullable(),
  validated_by: z.bigint().nullable(),
})

export type Tasks_electric = z.infer<typeof Tasks_electricSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// TASKS ELECTRIC
//------------------------------------------------------

export const Tasks_electricSelectSchema: z.ZodType<Prisma.Tasks_electricSelect> = z.object({
  id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  project_task_index: z.boolean().optional(),
  project_task_name: z.boolean().optional(),
  geometry_geojson: z.boolean().optional(),
  feature_count: z.boolean().optional(),
  task_status: z.boolean().optional(),
  locked_by: z.boolean().optional(),
  mapped_by: z.boolean().optional(),
  validated_by: z.boolean().optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const Tasks_electricWhereInputSchema: z.ZodType<Prisma.Tasks_electricWhereInput> = z.object({
  AND: z.union([ z.lazy(() => Tasks_electricWhereInputSchema),z.lazy(() => Tasks_electricWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => Tasks_electricWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => Tasks_electricWhereInputSchema),z.lazy(() => Tasks_electricWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  project_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  project_task_index: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  project_task_name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  geometry_geojson: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  feature_count: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  task_status: z.union([ z.lazy(() => EnumtaskstatusNullableFilterSchema),z.lazy(() => taskstatusSchema) ]).optional().nullable(),
  locked_by: z.union([ z.lazy(() => BigIntNullableFilterSchema),z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]) ]).optional().nullable(),
  mapped_by: z.union([ z.lazy(() => BigIntNullableFilterSchema),z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]) ]).optional().nullable(),
  validated_by: z.union([ z.lazy(() => BigIntNullableFilterSchema),z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]) ]).optional().nullable(),
}).strict();

export const Tasks_electricOrderByWithRelationInputSchema: z.ZodType<Prisma.Tasks_electricOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  project_id: z.lazy(() => SortOrderSchema).optional(),
  project_task_index: z.lazy(() => SortOrderSchema).optional(),
  project_task_name: z.lazy(() => SortOrderSchema).optional(),
  geometry_geojson: z.lazy(() => SortOrderSchema).optional(),
  feature_count: z.lazy(() => SortOrderSchema).optional(),
  task_status: z.lazy(() => SortOrderSchema).optional(),
  locked_by: z.lazy(() => SortOrderSchema).optional(),
  mapped_by: z.lazy(() => SortOrderSchema).optional(),
  validated_by: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const Tasks_electricWhereUniqueInputSchema: z.ZodType<Prisma.Tasks_electricWhereUniqueInput> = z.object({
  id_project_id: z.lazy(() => Tasks_electricIdProject_idCompoundUniqueInputSchema).optional()
}).strict();

export const Tasks_electricOrderByWithAggregationInputSchema: z.ZodType<Prisma.Tasks_electricOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  project_id: z.lazy(() => SortOrderSchema).optional(),
  project_task_index: z.lazy(() => SortOrderSchema).optional(),
  project_task_name: z.lazy(() => SortOrderSchema).optional(),
  geometry_geojson: z.lazy(() => SortOrderSchema).optional(),
  feature_count: z.lazy(() => SortOrderSchema).optional(),
  task_status: z.lazy(() => SortOrderSchema).optional(),
  locked_by: z.lazy(() => SortOrderSchema).optional(),
  mapped_by: z.lazy(() => SortOrderSchema).optional(),
  validated_by: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => Tasks_electricCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => Tasks_electricAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => Tasks_electricMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => Tasks_electricMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => Tasks_electricSumOrderByAggregateInputSchema).optional()
}).strict();

export const Tasks_electricScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.Tasks_electricScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => Tasks_electricScalarWhereWithAggregatesInputSchema),z.lazy(() => Tasks_electricScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => Tasks_electricScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => Tasks_electricScalarWhereWithAggregatesInputSchema),z.lazy(() => Tasks_electricScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  project_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  project_task_index: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  project_task_name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  geometry_geojson: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  feature_count: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  task_status: z.union([ z.lazy(() => EnumtaskstatusNullableWithAggregatesFilterSchema),z.lazy(() => taskstatusSchema) ]).optional().nullable(),
  locked_by: z.union([ z.lazy(() => BigIntNullableWithAggregatesFilterSchema),z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]) ]).optional().nullable(),
  mapped_by: z.union([ z.lazy(() => BigIntNullableWithAggregatesFilterSchema),z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]) ]).optional().nullable(),
  validated_by: z.union([ z.lazy(() => BigIntNullableWithAggregatesFilterSchema),z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]) ]).optional().nullable(),
}).strict();

export const Tasks_electricCreateInputSchema: z.ZodType<Prisma.Tasks_electricCreateInput> = z.object({
  id: z.number().int().gte(-2147483648).lte(2147483647),
  project_id: z.number().int().gte(-2147483648).lte(2147483647),
  project_task_index: z.number().int().gte(-2147483648).lte(2147483647).optional().nullable(),
  project_task_name: z.string().optional().nullable(),
  geometry_geojson: z.string().optional().nullable(),
  feature_count: z.number().int().gte(-2147483648).lte(2147483647).optional().nullable(),
  task_status: z.lazy(() => taskstatusSchema).optional().nullable(),
  locked_by: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional().nullable(),
  mapped_by: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional().nullable(),
  validated_by: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional().nullable()
}).strict();

export const Tasks_electricUncheckedCreateInputSchema: z.ZodType<Prisma.Tasks_electricUncheckedCreateInput> = z.object({
  id: z.number().int().gte(-2147483648).lte(2147483647),
  project_id: z.number().int().gte(-2147483648).lte(2147483647),
  project_task_index: z.number().int().gte(-2147483648).lte(2147483647).optional().nullable(),
  project_task_name: z.string().optional().nullable(),
  geometry_geojson: z.string().optional().nullable(),
  feature_count: z.number().int().gte(-2147483648).lte(2147483647).optional().nullable(),
  task_status: z.lazy(() => taskstatusSchema).optional().nullable(),
  locked_by: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional().nullable(),
  mapped_by: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional().nullable(),
  validated_by: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional().nullable()
}).strict();

export const Tasks_electricUpdateInputSchema: z.ZodType<Prisma.Tasks_electricUpdateInput> = z.object({
  id: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  project_id: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  project_task_index: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  project_task_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  geometry_geojson: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  feature_count: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  task_status: z.union([ z.lazy(() => taskstatusSchema),z.lazy(() => NullableEnumtaskstatusFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locked_by: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => NullableBigIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mapped_by: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => NullableBigIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  validated_by: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => NullableBigIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const Tasks_electricUncheckedUpdateInputSchema: z.ZodType<Prisma.Tasks_electricUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  project_id: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  project_task_index: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  project_task_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  geometry_geojson: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  feature_count: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  task_status: z.union([ z.lazy(() => taskstatusSchema),z.lazy(() => NullableEnumtaskstatusFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locked_by: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => NullableBigIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mapped_by: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => NullableBigIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  validated_by: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => NullableBigIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const Tasks_electricCreateManyInputSchema: z.ZodType<Prisma.Tasks_electricCreateManyInput> = z.object({
  id: z.number().int().gte(-2147483648).lte(2147483647),
  project_id: z.number().int().gte(-2147483648).lte(2147483647),
  project_task_index: z.number().int().gte(-2147483648).lte(2147483647).optional().nullable(),
  project_task_name: z.string().optional().nullable(),
  geometry_geojson: z.string().optional().nullable(),
  feature_count: z.number().int().gte(-2147483648).lte(2147483647).optional().nullable(),
  task_status: z.lazy(() => taskstatusSchema).optional().nullable(),
  locked_by: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional().nullable(),
  mapped_by: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional().nullable(),
  validated_by: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional().nullable()
}).strict();

export const Tasks_electricUpdateManyMutationInputSchema: z.ZodType<Prisma.Tasks_electricUpdateManyMutationInput> = z.object({
  id: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  project_id: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  project_task_index: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  project_task_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  geometry_geojson: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  feature_count: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  task_status: z.union([ z.lazy(() => taskstatusSchema),z.lazy(() => NullableEnumtaskstatusFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locked_by: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => NullableBigIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mapped_by: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => NullableBigIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  validated_by: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => NullableBigIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const Tasks_electricUncheckedUpdateManyInputSchema: z.ZodType<Prisma.Tasks_electricUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  project_id: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  project_task_index: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  project_task_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  geometry_geojson: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  feature_count: z.union([ z.number().int().gte(-2147483648).lte(2147483647),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  task_status: z.union([ z.lazy(() => taskstatusSchema),z.lazy(() => NullableEnumtaskstatusFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  locked_by: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => NullableBigIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mapped_by: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => NullableBigIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  validated_by: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => NullableBigIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
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

export const EnumtaskstatusNullableFilterSchema: z.ZodType<Prisma.EnumtaskstatusNullableFilter> = z.object({
  equals: z.lazy(() => taskstatusSchema).optional().nullable(),
  in: z.lazy(() => taskstatusSchema).array().optional().nullable(),
  notIn: z.lazy(() => taskstatusSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => taskstatusSchema),z.lazy(() => NestedEnumtaskstatusNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const BigIntNullableFilterSchema: z.ZodType<Prisma.BigIntNullableFilter> = z.object({
  equals: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional().nullable(),
  in: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n).array(), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt).array() ]).optional().nullable(),
  notIn: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n).array(), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt).array() ]).optional().nullable(),
  lt: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  lte: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  gt: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  gte: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  not: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => NestedBigIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const Tasks_electricIdProject_idCompoundUniqueInputSchema: z.ZodType<Prisma.Tasks_electricIdProject_idCompoundUniqueInput> = z.object({
  id: z.number(),
  project_id: z.number()
}).strict();

export const Tasks_electricCountOrderByAggregateInputSchema: z.ZodType<Prisma.Tasks_electricCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  project_id: z.lazy(() => SortOrderSchema).optional(),
  project_task_index: z.lazy(() => SortOrderSchema).optional(),
  project_task_name: z.lazy(() => SortOrderSchema).optional(),
  geometry_geojson: z.lazy(() => SortOrderSchema).optional(),
  feature_count: z.lazy(() => SortOrderSchema).optional(),
  task_status: z.lazy(() => SortOrderSchema).optional(),
  locked_by: z.lazy(() => SortOrderSchema).optional(),
  mapped_by: z.lazy(() => SortOrderSchema).optional(),
  validated_by: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const Tasks_electricAvgOrderByAggregateInputSchema: z.ZodType<Prisma.Tasks_electricAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  project_id: z.lazy(() => SortOrderSchema).optional(),
  project_task_index: z.lazy(() => SortOrderSchema).optional(),
  feature_count: z.lazy(() => SortOrderSchema).optional(),
  locked_by: z.lazy(() => SortOrderSchema).optional(),
  mapped_by: z.lazy(() => SortOrderSchema).optional(),
  validated_by: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const Tasks_electricMaxOrderByAggregateInputSchema: z.ZodType<Prisma.Tasks_electricMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  project_id: z.lazy(() => SortOrderSchema).optional(),
  project_task_index: z.lazy(() => SortOrderSchema).optional(),
  project_task_name: z.lazy(() => SortOrderSchema).optional(),
  geometry_geojson: z.lazy(() => SortOrderSchema).optional(),
  feature_count: z.lazy(() => SortOrderSchema).optional(),
  task_status: z.lazy(() => SortOrderSchema).optional(),
  locked_by: z.lazy(() => SortOrderSchema).optional(),
  mapped_by: z.lazy(() => SortOrderSchema).optional(),
  validated_by: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const Tasks_electricMinOrderByAggregateInputSchema: z.ZodType<Prisma.Tasks_electricMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  project_id: z.lazy(() => SortOrderSchema).optional(),
  project_task_index: z.lazy(() => SortOrderSchema).optional(),
  project_task_name: z.lazy(() => SortOrderSchema).optional(),
  geometry_geojson: z.lazy(() => SortOrderSchema).optional(),
  feature_count: z.lazy(() => SortOrderSchema).optional(),
  task_status: z.lazy(() => SortOrderSchema).optional(),
  locked_by: z.lazy(() => SortOrderSchema).optional(),
  mapped_by: z.lazy(() => SortOrderSchema).optional(),
  validated_by: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const Tasks_electricSumOrderByAggregateInputSchema: z.ZodType<Prisma.Tasks_electricSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  project_id: z.lazy(() => SortOrderSchema).optional(),
  project_task_index: z.lazy(() => SortOrderSchema).optional(),
  feature_count: z.lazy(() => SortOrderSchema).optional(),
  locked_by: z.lazy(() => SortOrderSchema).optional(),
  mapped_by: z.lazy(() => SortOrderSchema).optional(),
  validated_by: z.lazy(() => SortOrderSchema).optional()
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

export const EnumtaskstatusNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumtaskstatusNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => taskstatusSchema).optional().nullable(),
  in: z.lazy(() => taskstatusSchema).array().optional().nullable(),
  notIn: z.lazy(() => taskstatusSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => taskstatusSchema),z.lazy(() => NestedEnumtaskstatusNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumtaskstatusNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumtaskstatusNullableFilterSchema).optional()
}).strict();

export const BigIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.BigIntNullableWithAggregatesFilter> = z.object({
  equals: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional().nullable(),
  in: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n).array(), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt).array() ]).optional().nullable(),
  notIn: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n).array(), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt).array() ]).optional().nullable(),
  lt: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  lte: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  gt: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  gte: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  not: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => NestedBigIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedBigIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBigIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBigIntNullableFilterSchema).optional()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const NullableEnumtaskstatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumtaskstatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => taskstatusSchema).optional().nullable()
}).strict();

export const NullableBigIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableBigIntFieldUpdateOperationsInput> = z.object({
  set: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional().nullable(),
  increment: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  decrement: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  multiply: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  divide: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional()
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

export const NestedEnumtaskstatusNullableFilterSchema: z.ZodType<Prisma.NestedEnumtaskstatusNullableFilter> = z.object({
  equals: z.lazy(() => taskstatusSchema).optional().nullable(),
  in: z.lazy(() => taskstatusSchema).array().optional().nullable(),
  notIn: z.lazy(() => taskstatusSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => taskstatusSchema),z.lazy(() => NestedEnumtaskstatusNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBigIntNullableFilterSchema: z.ZodType<Prisma.NestedBigIntNullableFilter> = z.object({
  equals: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional().nullable(),
  in: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n).array(), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt).array() ]).optional().nullable(),
  notIn: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n).array(), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt).array() ]).optional().nullable(),
  lt: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  lte: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  gt: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  gte: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  not: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => NestedBigIntNullableFilterSchema) ]).optional().nullable(),
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

export const NestedEnumtaskstatusNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumtaskstatusNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => taskstatusSchema).optional().nullable(),
  in: z.lazy(() => taskstatusSchema).array().optional().nullable(),
  notIn: z.lazy(() => taskstatusSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => taskstatusSchema),z.lazy(() => NestedEnumtaskstatusNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumtaskstatusNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumtaskstatusNullableFilterSchema).optional()
}).strict();

export const NestedBigIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBigIntNullableWithAggregatesFilter> = z.object({
  equals: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional().nullable(),
  in: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n).array(), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt).array() ]).optional().nullable(),
  notIn: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n).array(), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt).array() ]).optional().nullable(),
  lt: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  lte: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  gt: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  gte: z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]).optional(),
  not: z.union([ z.union([ z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n), z.number().int().gte(Number.MIN_SAFE_INTEGER).lte(Number.MAX_SAFE_INTEGER).transform(BigInt) ]),z.lazy(() => NestedBigIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedBigIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBigIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBigIntNullableFilterSchema).optional()
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const Tasks_electricFindFirstArgsSchema: z.ZodType<Prisma.Tasks_electricFindFirstArgs> = z.object({
  select: Tasks_electricSelectSchema.optional(),
  where: Tasks_electricWhereInputSchema.optional(),
  orderBy: z.union([ Tasks_electricOrderByWithRelationInputSchema.array(),Tasks_electricOrderByWithRelationInputSchema ]).optional(),
  cursor: Tasks_electricWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: Tasks_electricScalarFieldEnumSchema.array().optional(),
}).strict() 

export const Tasks_electricFindFirstOrThrowArgsSchema: z.ZodType<Prisma.Tasks_electricFindFirstOrThrowArgs> = z.object({
  select: Tasks_electricSelectSchema.optional(),
  where: Tasks_electricWhereInputSchema.optional(),
  orderBy: z.union([ Tasks_electricOrderByWithRelationInputSchema.array(),Tasks_electricOrderByWithRelationInputSchema ]).optional(),
  cursor: Tasks_electricWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: Tasks_electricScalarFieldEnumSchema.array().optional(),
}).strict() 

export const Tasks_electricFindManyArgsSchema: z.ZodType<Prisma.Tasks_electricFindManyArgs> = z.object({
  select: Tasks_electricSelectSchema.optional(),
  where: Tasks_electricWhereInputSchema.optional(),
  orderBy: z.union([ Tasks_electricOrderByWithRelationInputSchema.array(),Tasks_electricOrderByWithRelationInputSchema ]).optional(),
  cursor: Tasks_electricWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: Tasks_electricScalarFieldEnumSchema.array().optional(),
}).strict() 

export const Tasks_electricAggregateArgsSchema: z.ZodType<Prisma.Tasks_electricAggregateArgs> = z.object({
  where: Tasks_electricWhereInputSchema.optional(),
  orderBy: z.union([ Tasks_electricOrderByWithRelationInputSchema.array(),Tasks_electricOrderByWithRelationInputSchema ]).optional(),
  cursor: Tasks_electricWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() 

export const Tasks_electricGroupByArgsSchema: z.ZodType<Prisma.Tasks_electricGroupByArgs> = z.object({
  where: Tasks_electricWhereInputSchema.optional(),
  orderBy: z.union([ Tasks_electricOrderByWithAggregationInputSchema.array(),Tasks_electricOrderByWithAggregationInputSchema ]).optional(),
  by: Tasks_electricScalarFieldEnumSchema.array(),
  having: Tasks_electricScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() 

export const Tasks_electricFindUniqueArgsSchema: z.ZodType<Prisma.Tasks_electricFindUniqueArgs> = z.object({
  select: Tasks_electricSelectSchema.optional(),
  where: Tasks_electricWhereUniqueInputSchema,
}).strict() 

export const Tasks_electricFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.Tasks_electricFindUniqueOrThrowArgs> = z.object({
  select: Tasks_electricSelectSchema.optional(),
  where: Tasks_electricWhereUniqueInputSchema,
}).strict() 

export const Tasks_electricCreateArgsSchema: z.ZodType<Prisma.Tasks_electricCreateArgs> = z.object({
  select: Tasks_electricSelectSchema.optional(),
  data: z.union([ Tasks_electricCreateInputSchema,Tasks_electricUncheckedCreateInputSchema ]),
}).strict() 

export const Tasks_electricUpsertArgsSchema: z.ZodType<Prisma.Tasks_electricUpsertArgs> = z.object({
  select: Tasks_electricSelectSchema.optional(),
  where: Tasks_electricWhereUniqueInputSchema,
  create: z.union([ Tasks_electricCreateInputSchema,Tasks_electricUncheckedCreateInputSchema ]),
  update: z.union([ Tasks_electricUpdateInputSchema,Tasks_electricUncheckedUpdateInputSchema ]),
}).strict() 

export const Tasks_electricCreateManyArgsSchema: z.ZodType<Prisma.Tasks_electricCreateManyArgs> = z.object({
  data: Tasks_electricCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict() 

export const Tasks_electricDeleteArgsSchema: z.ZodType<Prisma.Tasks_electricDeleteArgs> = z.object({
  select: Tasks_electricSelectSchema.optional(),
  where: Tasks_electricWhereUniqueInputSchema,
}).strict() 

export const Tasks_electricUpdateArgsSchema: z.ZodType<Prisma.Tasks_electricUpdateArgs> = z.object({
  select: Tasks_electricSelectSchema.optional(),
  data: z.union([ Tasks_electricUpdateInputSchema,Tasks_electricUncheckedUpdateInputSchema ]),
  where: Tasks_electricWhereUniqueInputSchema,
}).strict() 

export const Tasks_electricUpdateManyArgsSchema: z.ZodType<Prisma.Tasks_electricUpdateManyArgs> = z.object({
  data: z.union([ Tasks_electricUpdateManyMutationInputSchema,Tasks_electricUncheckedUpdateManyInputSchema ]),
  where: Tasks_electricWhereInputSchema.optional(),
}).strict() 

export const Tasks_electricDeleteManyArgsSchema: z.ZodType<Prisma.Tasks_electricDeleteManyArgs> = z.object({
  where: Tasks_electricWhereInputSchema.optional(),
}).strict() 

interface Tasks_electricGetPayload extends HKT {
  readonly _A?: boolean | null | undefined | Prisma.Tasks_electricArgs
  readonly type: Omit<Prisma.Tasks_electricGetPayload<this['_A']>, "Please either choose `select` or `include`">
}

export const tableSchemas = {
  tasks_electric: {
    fields: new Map([
      [
        "id",
        "INT4"
      ],
      [
        "project_id",
        "INT4"
      ],
      [
        "project_task_index",
        "INT4"
      ],
      [
        "project_task_name",
        "VARCHAR"
      ],
      [
        "geometry_geojson",
        "VARCHAR"
      ],
      [
        "feature_count",
        "INT4"
      ],
      [
        "task_status",
        "TEXT"
      ],
      [
        "locked_by",
        "INT8"
      ],
      [
        "mapped_by",
        "INT8"
      ],
      [
        "validated_by",
        "INT8"
      ]
    ]),
    relations: [
    ],
    modelSchema: (Tasks_electricCreateInputSchema as any)
      .partial()
      .or((Tasks_electricUncheckedCreateInputSchema as any).partial()),
    createSchema: Tasks_electricCreateArgsSchema,
    createManySchema: Tasks_electricCreateManyArgsSchema,
    findUniqueSchema: Tasks_electricFindUniqueArgsSchema,
    findSchema: Tasks_electricFindFirstArgsSchema,
    updateSchema: Tasks_electricUpdateArgsSchema,
    updateManySchema: Tasks_electricUpdateManyArgsSchema,
    upsertSchema: Tasks_electricUpsertArgsSchema,
    deleteSchema: Tasks_electricDeleteArgsSchema,
    deleteManySchema: Tasks_electricDeleteManyArgsSchema
  } as TableSchema<
    z.infer<typeof Tasks_electricUncheckedCreateInputSchema>,
    Prisma.Tasks_electricCreateArgs['data'],
    Prisma.Tasks_electricUpdateArgs['data'],
    Prisma.Tasks_electricFindFirstArgs['select'],
    Prisma.Tasks_electricFindFirstArgs['where'],
    Prisma.Tasks_electricFindUniqueArgs['where'],
    never,
    Prisma.Tasks_electricFindFirstArgs['orderBy'],
    Prisma.Tasks_electricScalarFieldEnum,
    Tasks_electricGetPayload
  >,
}

export const schema = new DbSchema(tableSchemas, migrations, pgMigrations)
export type Electric = ElectricClient<typeof schema>
