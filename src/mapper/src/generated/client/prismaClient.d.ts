
/**
 * Client
**/

import * as runtime from './runtime/index';
declare const prisma: unique symbol
export type PrismaPromise<A> = Promise<A> & {[prisma]: true}
type UnwrapPromise<P extends any> = P extends Promise<infer R> ? R : P
type UnwrapTuple<Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: K extends `${number}` ? Tuple[K] extends PrismaPromise<infer X> ? X : UnwrapPromise<Tuple[K]> : UnwrapPromise<Tuple[K]>
};


/**
 * Model Tasks_electric
 * 
 */
export type Tasks_electric = {
  /**
   * @zod.number.int().gte(-2147483648).lte(2147483647)
   */
  id: number
  /**
   * @zod.number.int().gte(-2147483648).lte(2147483647)
   */
  project_id: number
  /**
   * @zod.number.int().gte(-2147483648).lte(2147483647)
   */
  project_task_index: number | null
  project_task_name: string | null
  geometry_geojson: string | null
  /**
   * @zod.number.int().gte(-2147483648).lte(2147483647)
   */
  feature_count: number | null
  task_status: taskstatus | null
  locked_by: bigint | null
  mapped_by: bigint | null
  validated_by: bigint | null
}


/**
 * Enums
 */

// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

export const taskstatus: {
  READY: 'READY',
  LOCKED_FOR_MAPPING: 'LOCKED_FOR_MAPPING',
  MAPPED: 'MAPPED',
  LOCKED_FOR_VALIDATION: 'LOCKED_FOR_VALIDATION',
  VALIDATED: 'VALIDATED',
  INVALIDATED: 'INVALIDATED',
  BAD: 'BAD',
  SPLIT: 'SPLIT',
  ARCHIVED: 'ARCHIVED'
};

export type taskstatus = (typeof taskstatus)[keyof typeof taskstatus]


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Tasks_electrics
 * const tasks_electrics = await prisma.tasks_electric.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false
      > {
    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Tasks_electrics
   * const tasks_electrics = await prisma.tasks_electric.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<UnwrapTuple<P>>;

  $transaction<R>(fn: (prisma: Prisma.TransactionClient) => Promise<R>, options?: {maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel}): Promise<R>;

      /**
   * `prisma.tasks_electric`: Exposes CRUD operations for the **Tasks_electric** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tasks_electrics
    * const tasks_electrics = await prisma.tasks_electric.findMany()
    * ```
    */
  get tasks_electric(): Prisma.Tasks_electricDelegate<GlobalReject>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket


  /**
   * Prisma Client JS version: 4.8.1
   * Query Engine version: d6e67a83f971b175a593ccc12e15c4a757f93ffe
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
export type InputJsonValue = null | string | number | boolean | InputJsonObject | InputJsonArray

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type at least<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Exact<A, W = unknown> = 
  W extends unknown ? A extends Narrowable ? Cast<A, W> : Cast<
  {[K in keyof A]: K extends keyof W ? Exact<A[K], W[K]> : never},
  {[K in keyof W]: K extends keyof A ? Exact<A[K], W[K]> : W[K]}>
  : never;

  type Narrowable = string | number | boolean | bigint;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  export function validator<V>(): <S>(select: Exact<S, V>) => S;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>

  class PrismaClientFetcher {
    private readonly prisma;
    private readonly debug;
    private readonly hooks?;
    constructor(prisma: PrismaClient<any, any>, debug?: boolean, hooks?: Hooks | undefined);
    request<T>(document: any, dataPath?: string[], rootField?: string, typeName?: string, isList?: boolean, callsite?: string): Promise<T>;
    sanitizeMessage(message: string): string;
    protected unpack(document: any, data: any, path: string[], rootField?: string, isList?: boolean): any;
  }

  export const ModelName: {
    Tasks_electric: 'Tasks_electric'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  export type DefaultPrismaClient = PrismaClient
  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends RejectOnNotFound
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     * @deprecated since 4.0.0. Use `findUniqueOrThrow`/`findFirstOrThrow` methods instead.
     * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  export type Hooks = {
    beforeRequest?: (options: { query: string, path: string[], rootField?: string, typeName?: string, document: any }) => any
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model Tasks_electric
   */


  export type AggregateTasks_electric = {
    _count: Tasks_electricCountAggregateOutputType | null
    _avg: Tasks_electricAvgAggregateOutputType | null
    _sum: Tasks_electricSumAggregateOutputType | null
    _min: Tasks_electricMinAggregateOutputType | null
    _max: Tasks_electricMaxAggregateOutputType | null
  }

  export type Tasks_electricAvgAggregateOutputType = {
    id: number | null
    project_id: number | null
    project_task_index: number | null
    feature_count: number | null
    locked_by: number | null
    mapped_by: number | null
    validated_by: number | null
  }

  export type Tasks_electricSumAggregateOutputType = {
    id: number | null
    project_id: number | null
    project_task_index: number | null
    feature_count: number | null
    locked_by: bigint | null
    mapped_by: bigint | null
    validated_by: bigint | null
  }

  export type Tasks_electricMinAggregateOutputType = {
    id: number | null
    project_id: number | null
    project_task_index: number | null
    project_task_name: string | null
    geometry_geojson: string | null
    feature_count: number | null
    task_status: taskstatus | null
    locked_by: bigint | null
    mapped_by: bigint | null
    validated_by: bigint | null
  }

  export type Tasks_electricMaxAggregateOutputType = {
    id: number | null
    project_id: number | null
    project_task_index: number | null
    project_task_name: string | null
    geometry_geojson: string | null
    feature_count: number | null
    task_status: taskstatus | null
    locked_by: bigint | null
    mapped_by: bigint | null
    validated_by: bigint | null
  }

  export type Tasks_electricCountAggregateOutputType = {
    id: number
    project_id: number
    project_task_index: number
    project_task_name: number
    geometry_geojson: number
    feature_count: number
    task_status: number
    locked_by: number
    mapped_by: number
    validated_by: number
    _all: number
  }


  export type Tasks_electricAvgAggregateInputType = {
    id?: true
    project_id?: true
    project_task_index?: true
    feature_count?: true
    locked_by?: true
    mapped_by?: true
    validated_by?: true
  }

  export type Tasks_electricSumAggregateInputType = {
    id?: true
    project_id?: true
    project_task_index?: true
    feature_count?: true
    locked_by?: true
    mapped_by?: true
    validated_by?: true
  }

  export type Tasks_electricMinAggregateInputType = {
    id?: true
    project_id?: true
    project_task_index?: true
    project_task_name?: true
    geometry_geojson?: true
    feature_count?: true
    task_status?: true
    locked_by?: true
    mapped_by?: true
    validated_by?: true
  }

  export type Tasks_electricMaxAggregateInputType = {
    id?: true
    project_id?: true
    project_task_index?: true
    project_task_name?: true
    geometry_geojson?: true
    feature_count?: true
    task_status?: true
    locked_by?: true
    mapped_by?: true
    validated_by?: true
  }

  export type Tasks_electricCountAggregateInputType = {
    id?: true
    project_id?: true
    project_task_index?: true
    project_task_name?: true
    geometry_geojson?: true
    feature_count?: true
    task_status?: true
    locked_by?: true
    mapped_by?: true
    validated_by?: true
    _all?: true
  }

  export type Tasks_electricAggregateArgs = {
    /**
     * Filter which Tasks_electric to aggregate.
     * 
    **/
    where?: Tasks_electricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks_electrics to fetch.
     * 
    **/
    orderBy?: Enumerable<Tasks_electricOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: Tasks_electricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks_electrics from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks_electrics.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tasks_electrics
    **/
    _count?: true | Tasks_electricCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Tasks_electricAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Tasks_electricSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Tasks_electricMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Tasks_electricMaxAggregateInputType
  }

  export type GetTasks_electricAggregateType<T extends Tasks_electricAggregateArgs> = {
        [P in keyof T & keyof AggregateTasks_electric]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTasks_electric[P]>
      : GetScalarType<T[P], AggregateTasks_electric[P]>
  }




  export type Tasks_electricGroupByArgs = {
    where?: Tasks_electricWhereInput
    orderBy?: Enumerable<Tasks_electricOrderByWithAggregationInput>
    by: Array<Tasks_electricScalarFieldEnum>
    having?: Tasks_electricScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Tasks_electricCountAggregateInputType | true
    _avg?: Tasks_electricAvgAggregateInputType
    _sum?: Tasks_electricSumAggregateInputType
    _min?: Tasks_electricMinAggregateInputType
    _max?: Tasks_electricMaxAggregateInputType
  }


  export type Tasks_electricGroupByOutputType = {
    id: number
    project_id: number
    project_task_index: number | null
    project_task_name: string | null
    geometry_geojson: string | null
    feature_count: number | null
    task_status: taskstatus | null
    locked_by: bigint | null
    mapped_by: bigint | null
    validated_by: bigint | null
    _count: Tasks_electricCountAggregateOutputType | null
    _avg: Tasks_electricAvgAggregateOutputType | null
    _sum: Tasks_electricSumAggregateOutputType | null
    _min: Tasks_electricMinAggregateOutputType | null
    _max: Tasks_electricMaxAggregateOutputType | null
  }

  type GetTasks_electricGroupByPayload<T extends Tasks_electricGroupByArgs> = PrismaPromise<
    Array<
      PickArray<Tasks_electricGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Tasks_electricGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Tasks_electricGroupByOutputType[P]>
            : GetScalarType<T[P], Tasks_electricGroupByOutputType[P]>
        }
      >
    >


  export type Tasks_electricSelect = {
    id?: boolean
    project_id?: boolean
    project_task_index?: boolean
    project_task_name?: boolean
    geometry_geojson?: boolean
    feature_count?: boolean
    task_status?: boolean
    locked_by?: boolean
    mapped_by?: boolean
    validated_by?: boolean
  }


  export type Tasks_electricGetPayload<S extends boolean | null | undefined | Tasks_electricArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? Tasks_electric :
    S extends undefined ? never :
    S extends { include: any } & (Tasks_electricArgs | Tasks_electricFindManyArgs)
    ? Tasks_electric 
    : S extends { select: any } & (Tasks_electricArgs | Tasks_electricFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof Tasks_electric ? Tasks_electric[P] : never
  } 
      : Tasks_electric


  type Tasks_electricCountArgs = Merge<
    Omit<Tasks_electricFindManyArgs, 'select' | 'include'> & {
      select?: Tasks_electricCountAggregateInputType | true
    }
  >

  export interface Tasks_electricDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Tasks_electric that matches the filter.
     * @param {Tasks_electricFindUniqueArgs} args - Arguments to find a Tasks_electric
     * @example
     * // Get one Tasks_electric
     * const tasks_electric = await prisma.tasks_electric.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends Tasks_electricFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, Tasks_electricFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Tasks_electric'> extends True ? Prisma__Tasks_electricClient<Tasks_electricGetPayload<T>> : Prisma__Tasks_electricClient<Tasks_electricGetPayload<T> | null, null>

    /**
     * Find one Tasks_electric that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {Tasks_electricFindUniqueOrThrowArgs} args - Arguments to find a Tasks_electric
     * @example
     * // Get one Tasks_electric
     * const tasks_electric = await prisma.tasks_electric.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends Tasks_electricFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, Tasks_electricFindUniqueOrThrowArgs>
    ): Prisma__Tasks_electricClient<Tasks_electricGetPayload<T>>

    /**
     * Find the first Tasks_electric that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Tasks_electricFindFirstArgs} args - Arguments to find a Tasks_electric
     * @example
     * // Get one Tasks_electric
     * const tasks_electric = await prisma.tasks_electric.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends Tasks_electricFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, Tasks_electricFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Tasks_electric'> extends True ? Prisma__Tasks_electricClient<Tasks_electricGetPayload<T>> : Prisma__Tasks_electricClient<Tasks_electricGetPayload<T> | null, null>

    /**
     * Find the first Tasks_electric that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Tasks_electricFindFirstOrThrowArgs} args - Arguments to find a Tasks_electric
     * @example
     * // Get one Tasks_electric
     * const tasks_electric = await prisma.tasks_electric.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends Tasks_electricFindFirstOrThrowArgs>(
      args?: SelectSubset<T, Tasks_electricFindFirstOrThrowArgs>
    ): Prisma__Tasks_electricClient<Tasks_electricGetPayload<T>>

    /**
     * Find zero or more Tasks_electrics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Tasks_electricFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tasks_electrics
     * const tasks_electrics = await prisma.tasks_electric.findMany()
     * 
     * // Get first 10 Tasks_electrics
     * const tasks_electrics = await prisma.tasks_electric.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tasks_electricWithIdOnly = await prisma.tasks_electric.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends Tasks_electricFindManyArgs>(
      args?: SelectSubset<T, Tasks_electricFindManyArgs>
    ): PrismaPromise<Array<Tasks_electricGetPayload<T>>>

    /**
     * Create a Tasks_electric.
     * @param {Tasks_electricCreateArgs} args - Arguments to create a Tasks_electric.
     * @example
     * // Create one Tasks_electric
     * const Tasks_electric = await prisma.tasks_electric.create({
     *   data: {
     *     // ... data to create a Tasks_electric
     *   }
     * })
     * 
    **/
    create<T extends Tasks_electricCreateArgs>(
      args: SelectSubset<T, Tasks_electricCreateArgs>
    ): Prisma__Tasks_electricClient<Tasks_electricGetPayload<T>>

    /**
     * Create many Tasks_electrics.
     *     @param {Tasks_electricCreateManyArgs} args - Arguments to create many Tasks_electrics.
     *     @example
     *     // Create many Tasks_electrics
     *     const tasks_electric = await prisma.tasks_electric.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends Tasks_electricCreateManyArgs>(
      args?: SelectSubset<T, Tasks_electricCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Tasks_electric.
     * @param {Tasks_electricDeleteArgs} args - Arguments to delete one Tasks_electric.
     * @example
     * // Delete one Tasks_electric
     * const Tasks_electric = await prisma.tasks_electric.delete({
     *   where: {
     *     // ... filter to delete one Tasks_electric
     *   }
     * })
     * 
    **/
    delete<T extends Tasks_electricDeleteArgs>(
      args: SelectSubset<T, Tasks_electricDeleteArgs>
    ): Prisma__Tasks_electricClient<Tasks_electricGetPayload<T>>

    /**
     * Update one Tasks_electric.
     * @param {Tasks_electricUpdateArgs} args - Arguments to update one Tasks_electric.
     * @example
     * // Update one Tasks_electric
     * const tasks_electric = await prisma.tasks_electric.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends Tasks_electricUpdateArgs>(
      args: SelectSubset<T, Tasks_electricUpdateArgs>
    ): Prisma__Tasks_electricClient<Tasks_electricGetPayload<T>>

    /**
     * Delete zero or more Tasks_electrics.
     * @param {Tasks_electricDeleteManyArgs} args - Arguments to filter Tasks_electrics to delete.
     * @example
     * // Delete a few Tasks_electrics
     * const { count } = await prisma.tasks_electric.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends Tasks_electricDeleteManyArgs>(
      args?: SelectSubset<T, Tasks_electricDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks_electrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Tasks_electricUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tasks_electrics
     * const tasks_electric = await prisma.tasks_electric.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends Tasks_electricUpdateManyArgs>(
      args: SelectSubset<T, Tasks_electricUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Tasks_electric.
     * @param {Tasks_electricUpsertArgs} args - Arguments to update or create a Tasks_electric.
     * @example
     * // Update or create a Tasks_electric
     * const tasks_electric = await prisma.tasks_electric.upsert({
     *   create: {
     *     // ... data to create a Tasks_electric
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tasks_electric we want to update
     *   }
     * })
    **/
    upsert<T extends Tasks_electricUpsertArgs>(
      args: SelectSubset<T, Tasks_electricUpsertArgs>
    ): Prisma__Tasks_electricClient<Tasks_electricGetPayload<T>>

    /**
     * Count the number of Tasks_electrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Tasks_electricCountArgs} args - Arguments to filter Tasks_electrics to count.
     * @example
     * // Count the number of Tasks_electrics
     * const count = await prisma.tasks_electric.count({
     *   where: {
     *     // ... the filter for the Tasks_electrics we want to count
     *   }
     * })
    **/
    count<T extends Tasks_electricCountArgs>(
      args?: Subset<T, Tasks_electricCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Tasks_electricCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tasks_electric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Tasks_electricAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Tasks_electricAggregateArgs>(args: Subset<T, Tasks_electricAggregateArgs>): PrismaPromise<GetTasks_electricAggregateType<T>>

    /**
     * Group by Tasks_electric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Tasks_electricGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends Tasks_electricGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: Tasks_electricGroupByArgs['orderBy'] }
        : { orderBy?: Tasks_electricGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, Tasks_electricGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTasks_electricGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Tasks_electric.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__Tasks_electricClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Tasks_electric base type for findUnique actions
   */
  export type Tasks_electricFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Tasks_electric
     * 
    **/
    select?: Tasks_electricSelect | null
    /**
     * Filter, which Tasks_electric to fetch.
     * 
    **/
    where: Tasks_electricWhereUniqueInput
  }

  /**
   * Tasks_electric findUnique
   */
  export interface Tasks_electricFindUniqueArgs extends Tasks_electricFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Tasks_electric findUniqueOrThrow
   */
  export type Tasks_electricFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Tasks_electric
     * 
    **/
    select?: Tasks_electricSelect | null
    /**
     * Filter, which Tasks_electric to fetch.
     * 
    **/
    where: Tasks_electricWhereUniqueInput
  }


  /**
   * Tasks_electric base type for findFirst actions
   */
  export type Tasks_electricFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Tasks_electric
     * 
    **/
    select?: Tasks_electricSelect | null
    /**
     * Filter, which Tasks_electric to fetch.
     * 
    **/
    where?: Tasks_electricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks_electrics to fetch.
     * 
    **/
    orderBy?: Enumerable<Tasks_electricOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks_electrics.
     * 
    **/
    cursor?: Tasks_electricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks_electrics from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks_electrics.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks_electrics.
     * 
    **/
    distinct?: Enumerable<Tasks_electricScalarFieldEnum>
  }

  /**
   * Tasks_electric findFirst
   */
  export interface Tasks_electricFindFirstArgs extends Tasks_electricFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Tasks_electric findFirstOrThrow
   */
  export type Tasks_electricFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Tasks_electric
     * 
    **/
    select?: Tasks_electricSelect | null
    /**
     * Filter, which Tasks_electric to fetch.
     * 
    **/
    where?: Tasks_electricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks_electrics to fetch.
     * 
    **/
    orderBy?: Enumerable<Tasks_electricOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks_electrics.
     * 
    **/
    cursor?: Tasks_electricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks_electrics from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks_electrics.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks_electrics.
     * 
    **/
    distinct?: Enumerable<Tasks_electricScalarFieldEnum>
  }


  /**
   * Tasks_electric findMany
   */
  export type Tasks_electricFindManyArgs = {
    /**
     * Select specific fields to fetch from the Tasks_electric
     * 
    **/
    select?: Tasks_electricSelect | null
    /**
     * Filter, which Tasks_electrics to fetch.
     * 
    **/
    where?: Tasks_electricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks_electrics to fetch.
     * 
    **/
    orderBy?: Enumerable<Tasks_electricOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tasks_electrics.
     * 
    **/
    cursor?: Tasks_electricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks_electrics from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks_electrics.
     * 
    **/
    skip?: number
    distinct?: Enumerable<Tasks_electricScalarFieldEnum>
  }


  /**
   * Tasks_electric create
   */
  export type Tasks_electricCreateArgs = {
    /**
     * Select specific fields to fetch from the Tasks_electric
     * 
    **/
    select?: Tasks_electricSelect | null
    /**
     * The data needed to create a Tasks_electric.
     * 
    **/
    data: XOR<Tasks_electricCreateInput, Tasks_electricUncheckedCreateInput>
  }


  /**
   * Tasks_electric createMany
   */
  export type Tasks_electricCreateManyArgs = {
    /**
     * The data used to create many Tasks_electrics.
     * 
    **/
    data: Enumerable<Tasks_electricCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Tasks_electric update
   */
  export type Tasks_electricUpdateArgs = {
    /**
     * Select specific fields to fetch from the Tasks_electric
     * 
    **/
    select?: Tasks_electricSelect | null
    /**
     * The data needed to update a Tasks_electric.
     * 
    **/
    data: XOR<Tasks_electricUpdateInput, Tasks_electricUncheckedUpdateInput>
    /**
     * Choose, which Tasks_electric to update.
     * 
    **/
    where: Tasks_electricWhereUniqueInput
  }


  /**
   * Tasks_electric updateMany
   */
  export type Tasks_electricUpdateManyArgs = {
    /**
     * The data used to update Tasks_electrics.
     * 
    **/
    data: XOR<Tasks_electricUpdateManyMutationInput, Tasks_electricUncheckedUpdateManyInput>
    /**
     * Filter which Tasks_electrics to update
     * 
    **/
    where?: Tasks_electricWhereInput
  }


  /**
   * Tasks_electric upsert
   */
  export type Tasks_electricUpsertArgs = {
    /**
     * Select specific fields to fetch from the Tasks_electric
     * 
    **/
    select?: Tasks_electricSelect | null
    /**
     * The filter to search for the Tasks_electric to update in case it exists.
     * 
    **/
    where: Tasks_electricWhereUniqueInput
    /**
     * In case the Tasks_electric found by the `where` argument doesn't exist, create a new Tasks_electric with this data.
     * 
    **/
    create: XOR<Tasks_electricCreateInput, Tasks_electricUncheckedCreateInput>
    /**
     * In case the Tasks_electric was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<Tasks_electricUpdateInput, Tasks_electricUncheckedUpdateInput>
  }


  /**
   * Tasks_electric delete
   */
  export type Tasks_electricDeleteArgs = {
    /**
     * Select specific fields to fetch from the Tasks_electric
     * 
    **/
    select?: Tasks_electricSelect | null
    /**
     * Filter which Tasks_electric to delete.
     * 
    **/
    where: Tasks_electricWhereUniqueInput
  }


  /**
   * Tasks_electric deleteMany
   */
  export type Tasks_electricDeleteManyArgs = {
    /**
     * Filter which Tasks_electrics to delete
     * 
    **/
    where?: Tasks_electricWhereInput
  }


  /**
   * Tasks_electric without action
   */
  export type Tasks_electricArgs = {
    /**
     * Select specific fields to fetch from the Tasks_electric
     * 
    **/
    select?: Tasks_electricSelect | null
  }



  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const Tasks_electricScalarFieldEnum: {
    id: 'id',
    project_id: 'project_id',
    project_task_index: 'project_task_index',
    project_task_name: 'project_task_name',
    geometry_geojson: 'geometry_geojson',
    feature_count: 'feature_count',
    task_status: 'task_status',
    locked_by: 'locked_by',
    mapped_by: 'mapped_by',
    validated_by: 'validated_by'
  };

  export type Tasks_electricScalarFieldEnum = (typeof Tasks_electricScalarFieldEnum)[keyof typeof Tasks_electricScalarFieldEnum]


  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  /**
   * Deep Input Types
   */


  export type Tasks_electricWhereInput = {
    AND?: Enumerable<Tasks_electricWhereInput>
    OR?: Enumerable<Tasks_electricWhereInput>
    NOT?: Enumerable<Tasks_electricWhereInput>
    id?: IntFilter | number
    project_id?: IntFilter | number
    project_task_index?: IntNullableFilter | number | null
    project_task_name?: StringNullableFilter | string | null
    geometry_geojson?: StringNullableFilter | string | null
    feature_count?: IntNullableFilter | number | null
    task_status?: EnumtaskstatusNullableFilter | taskstatus | null
    locked_by?: BigIntNullableFilter | bigint | number | null
    mapped_by?: BigIntNullableFilter | bigint | number | null
    validated_by?: BigIntNullableFilter | bigint | number | null
  }

  export type Tasks_electricOrderByWithRelationInput = {
    id?: SortOrder
    project_id?: SortOrder
    project_task_index?: SortOrder
    project_task_name?: SortOrder
    geometry_geojson?: SortOrder
    feature_count?: SortOrder
    task_status?: SortOrder
    locked_by?: SortOrder
    mapped_by?: SortOrder
    validated_by?: SortOrder
  }

  export type Tasks_electricWhereUniqueInput = {
    id_project_id?: Tasks_electricIdProject_idCompoundUniqueInput
  }

  export type Tasks_electricOrderByWithAggregationInput = {
    id?: SortOrder
    project_id?: SortOrder
    project_task_index?: SortOrder
    project_task_name?: SortOrder
    geometry_geojson?: SortOrder
    feature_count?: SortOrder
    task_status?: SortOrder
    locked_by?: SortOrder
    mapped_by?: SortOrder
    validated_by?: SortOrder
    _count?: Tasks_electricCountOrderByAggregateInput
    _avg?: Tasks_electricAvgOrderByAggregateInput
    _max?: Tasks_electricMaxOrderByAggregateInput
    _min?: Tasks_electricMinOrderByAggregateInput
    _sum?: Tasks_electricSumOrderByAggregateInput
  }

  export type Tasks_electricScalarWhereWithAggregatesInput = {
    AND?: Enumerable<Tasks_electricScalarWhereWithAggregatesInput>
    OR?: Enumerable<Tasks_electricScalarWhereWithAggregatesInput>
    NOT?: Enumerable<Tasks_electricScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    project_id?: IntWithAggregatesFilter | number
    project_task_index?: IntNullableWithAggregatesFilter | number | null
    project_task_name?: StringNullableWithAggregatesFilter | string | null
    geometry_geojson?: StringNullableWithAggregatesFilter | string | null
    feature_count?: IntNullableWithAggregatesFilter | number | null
    task_status?: EnumtaskstatusNullableWithAggregatesFilter | taskstatus | null
    locked_by?: BigIntNullableWithAggregatesFilter | bigint | number | null
    mapped_by?: BigIntNullableWithAggregatesFilter | bigint | number | null
    validated_by?: BigIntNullableWithAggregatesFilter | bigint | number | null
  }

  export type Tasks_electricCreateInput = {
    id: number
    project_id: number
    project_task_index?: number | null
    project_task_name?: string | null
    geometry_geojson?: string | null
    feature_count?: number | null
    task_status?: taskstatus | null
    locked_by?: bigint | number | null
    mapped_by?: bigint | number | null
    validated_by?: bigint | number | null
  }

  export type Tasks_electricUncheckedCreateInput = {
    id: number
    project_id: number
    project_task_index?: number | null
    project_task_name?: string | null
    geometry_geojson?: string | null
    feature_count?: number | null
    task_status?: taskstatus | null
    locked_by?: bigint | number | null
    mapped_by?: bigint | number | null
    validated_by?: bigint | number | null
  }

  export type Tasks_electricUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    project_id?: IntFieldUpdateOperationsInput | number
    project_task_index?: NullableIntFieldUpdateOperationsInput | number | null
    project_task_name?: NullableStringFieldUpdateOperationsInput | string | null
    geometry_geojson?: NullableStringFieldUpdateOperationsInput | string | null
    feature_count?: NullableIntFieldUpdateOperationsInput | number | null
    task_status?: NullableEnumtaskstatusFieldUpdateOperationsInput | taskstatus | null
    locked_by?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    mapped_by?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    validated_by?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type Tasks_electricUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    project_id?: IntFieldUpdateOperationsInput | number
    project_task_index?: NullableIntFieldUpdateOperationsInput | number | null
    project_task_name?: NullableStringFieldUpdateOperationsInput | string | null
    geometry_geojson?: NullableStringFieldUpdateOperationsInput | string | null
    feature_count?: NullableIntFieldUpdateOperationsInput | number | null
    task_status?: NullableEnumtaskstatusFieldUpdateOperationsInput | taskstatus | null
    locked_by?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    mapped_by?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    validated_by?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type Tasks_electricCreateManyInput = {
    id: number
    project_id: number
    project_task_index?: number | null
    project_task_name?: string | null
    geometry_geojson?: string | null
    feature_count?: number | null
    task_status?: taskstatus | null
    locked_by?: bigint | number | null
    mapped_by?: bigint | number | null
    validated_by?: bigint | number | null
  }

  export type Tasks_electricUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    project_id?: IntFieldUpdateOperationsInput | number
    project_task_index?: NullableIntFieldUpdateOperationsInput | number | null
    project_task_name?: NullableStringFieldUpdateOperationsInput | string | null
    geometry_geojson?: NullableStringFieldUpdateOperationsInput | string | null
    feature_count?: NullableIntFieldUpdateOperationsInput | number | null
    task_status?: NullableEnumtaskstatusFieldUpdateOperationsInput | taskstatus | null
    locked_by?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    mapped_by?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    validated_by?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type Tasks_electricUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    project_id?: IntFieldUpdateOperationsInput | number
    project_task_index?: NullableIntFieldUpdateOperationsInput | number | null
    project_task_name?: NullableStringFieldUpdateOperationsInput | string | null
    geometry_geojson?: NullableStringFieldUpdateOperationsInput | string | null
    feature_count?: NullableIntFieldUpdateOperationsInput | number | null
    task_status?: NullableEnumtaskstatusFieldUpdateOperationsInput | taskstatus | null
    locked_by?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    mapped_by?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    validated_by?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type IntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type IntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type StringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableFilter | string | null
  }

  export type EnumtaskstatusNullableFilter = {
    equals?: taskstatus | null
    in?: Enumerable<taskstatus> | null
    notIn?: Enumerable<taskstatus> | null
    not?: NestedEnumtaskstatusNullableFilter | taskstatus | null
  }

  export type BigIntNullableFilter = {
    equals?: bigint | number | null
    in?: Enumerable<bigint> | Enumerable<number> | null
    notIn?: Enumerable<bigint> | Enumerable<number> | null
    lt?: bigint | number
    lte?: bigint | number
    gt?: bigint | number
    gte?: bigint | number
    not?: NestedBigIntNullableFilter | bigint | number | null
  }

  export type Tasks_electricIdProject_idCompoundUniqueInput = {
    id: number
    project_id: number
  }

  export type Tasks_electricCountOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    project_task_index?: SortOrder
    project_task_name?: SortOrder
    geometry_geojson?: SortOrder
    feature_count?: SortOrder
    task_status?: SortOrder
    locked_by?: SortOrder
    mapped_by?: SortOrder
    validated_by?: SortOrder
  }

  export type Tasks_electricAvgOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    project_task_index?: SortOrder
    feature_count?: SortOrder
    locked_by?: SortOrder
    mapped_by?: SortOrder
    validated_by?: SortOrder
  }

  export type Tasks_electricMaxOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    project_task_index?: SortOrder
    project_task_name?: SortOrder
    geometry_geojson?: SortOrder
    feature_count?: SortOrder
    task_status?: SortOrder
    locked_by?: SortOrder
    mapped_by?: SortOrder
    validated_by?: SortOrder
  }

  export type Tasks_electricMinOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    project_task_index?: SortOrder
    project_task_name?: SortOrder
    geometry_geojson?: SortOrder
    feature_count?: SortOrder
    task_status?: SortOrder
    locked_by?: SortOrder
    mapped_by?: SortOrder
    validated_by?: SortOrder
  }

  export type Tasks_electricSumOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    project_task_index?: SortOrder
    feature_count?: SortOrder
    locked_by?: SortOrder
    mapped_by?: SortOrder
    validated_by?: SortOrder
  }

  export type IntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type IntNullableWithAggregatesFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableWithAggregatesFilter | number | null
    _count?: NestedIntNullableFilter
    _avg?: NestedFloatNullableFilter
    _sum?: NestedIntNullableFilter
    _min?: NestedIntNullableFilter
    _max?: NestedIntNullableFilter
  }

  export type StringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type EnumtaskstatusNullableWithAggregatesFilter = {
    equals?: taskstatus | null
    in?: Enumerable<taskstatus> | null
    notIn?: Enumerable<taskstatus> | null
    not?: NestedEnumtaskstatusNullableWithAggregatesFilter | taskstatus | null
    _count?: NestedIntNullableFilter
    _min?: NestedEnumtaskstatusNullableFilter
    _max?: NestedEnumtaskstatusNullableFilter
  }

  export type BigIntNullableWithAggregatesFilter = {
    equals?: bigint | number | null
    in?: Enumerable<bigint> | Enumerable<number> | null
    notIn?: Enumerable<bigint> | Enumerable<number> | null
    lt?: bigint | number
    lte?: bigint | number
    gt?: bigint | number
    gte?: bigint | number
    not?: NestedBigIntNullableWithAggregatesFilter | bigint | number | null
    _count?: NestedIntNullableFilter
    _avg?: NestedFloatNullableFilter
    _sum?: NestedBigIntNullableFilter
    _min?: NestedBigIntNullableFilter
    _max?: NestedBigIntNullableFilter
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableEnumtaskstatusFieldUpdateOperationsInput = {
    set?: taskstatus | null
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedIntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type NestedStringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type NestedEnumtaskstatusNullableFilter = {
    equals?: taskstatus | null
    in?: Enumerable<taskstatus> | null
    notIn?: Enumerable<taskstatus> | null
    not?: NestedEnumtaskstatusNullableFilter | taskstatus | null
  }

  export type NestedBigIntNullableFilter = {
    equals?: bigint | number | null
    in?: Enumerable<bigint> | Enumerable<number> | null
    notIn?: Enumerable<bigint> | Enumerable<number> | null
    lt?: bigint | number
    lte?: bigint | number
    gt?: bigint | number
    gte?: bigint | number
    not?: NestedBigIntNullableFilter | bigint | number | null
  }

  export type NestedIntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type NestedFloatFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }

  export type NestedIntNullableWithAggregatesFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableWithAggregatesFilter | number | null
    _count?: NestedIntNullableFilter
    _avg?: NestedFloatNullableFilter
    _sum?: NestedIntNullableFilter
    _min?: NestedIntNullableFilter
    _max?: NestedIntNullableFilter
  }

  export type NestedFloatNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatNullableFilter | number | null
  }

  export type NestedStringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type NestedEnumtaskstatusNullableWithAggregatesFilter = {
    equals?: taskstatus | null
    in?: Enumerable<taskstatus> | null
    notIn?: Enumerable<taskstatus> | null
    not?: NestedEnumtaskstatusNullableWithAggregatesFilter | taskstatus | null
    _count?: NestedIntNullableFilter
    _min?: NestedEnumtaskstatusNullableFilter
    _max?: NestedEnumtaskstatusNullableFilter
  }

  export type NestedBigIntNullableWithAggregatesFilter = {
    equals?: bigint | number | null
    in?: Enumerable<bigint> | Enumerable<number> | null
    notIn?: Enumerable<bigint> | Enumerable<number> | null
    lt?: bigint | number
    lte?: bigint | number
    gt?: bigint | number
    gte?: bigint | number
    not?: NestedBigIntNullableWithAggregatesFilter | bigint | number | null
    _count?: NestedIntNullableFilter
    _avg?: NestedFloatNullableFilter
    _sum?: NestedBigIntNullableFilter
    _min?: NestedBigIntNullableFilter
    _max?: NestedBigIntNullableFilter
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}

type Buffer = Omit<Uint8Array, 'set'>
