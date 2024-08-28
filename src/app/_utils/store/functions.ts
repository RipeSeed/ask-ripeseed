import { get, set } from 'lodash'

import type { GetFieldType } from './types'

export function getValue<
  TData,
  TPath extends string,
  TDefault = GetFieldType<TData, TPath>,
>(
  data: TData,
  path: TPath,
  defaultValue?: TDefault,
): GetFieldType<TData, TPath> | TDefault {
  const value = get(data, path) as unknown as GetFieldType<TData, TPath>

  return value ?? (defaultValue as TDefault)
}

export function setValue<TData extends object, TPath extends string>(
  data: TData,
  path: TPath,
  value: GetFieldType<TData, TPath>,
) {
  set(data, path, value)
}
