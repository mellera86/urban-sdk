import {
  DefinedInitialDataOptions,
  QueryClient,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

export type ObjectValues<T> = T[keyof T];

export type BaseQuery<TData, TSetQUeryDataVariables = void> = (
  query?: Query<TData>,
) => QueryReturnType<TData, TSetQUeryDataVariables>;

export type BaseQueryWithVariables<
  TData,
  TVariables,
  TSetQUeryDataVariables = void,
> = (
  query: Query<TData> & {
    variables: TVariables;
  },
) => QueryReturnType<TData, TSetQUeryDataVariables>;

export type Query<TData> = UseQueryParams<
  TData | undefined,
  Error,
  TData | undefined
> & { dataCallback?: (data?: TData | undefined) => TData | undefined };

type UseQueryParams<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey = QueryKey,
> = {
  options?: QueryOptions<TQueryFnData, TError, TData, TQueryKey>;
  queryClient?: QueryClient;
};

type QueryOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey = QueryKey,
> =
  | Partial<DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>>
  | Partial<UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>>
  | Partial<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>>;

export type QueryReturnType<
  TData,
  TSetQUeryDataVariables = void,
> = UseQueryResult<TData | undefined, Error> & {
  setQueryData?: ({
    variables,
  }: SetQueryDataVariables<TSetQUeryDataVariables>) => void;
};

type SetQueryDataVariables<TSetQueryDataVariables> = {
  variables: TSetQueryDataVariables;
};
