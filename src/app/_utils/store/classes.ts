import { useEffect } from 'react'
import { cloneDeep } from 'lodash'
import { proxy, useSnapshot } from 'valtio'

import { getValue, setValue } from './functions'
import type { FlattenObjectKeys, GetFieldType } from './types'

// A class that wraps valtio and has functions for setting and getting state
// This is used in the admin app

export class ValtioWrapper<T extends Record<string, unknown>> {
  private initialValues: T
  private values: T
  constructor(store: T) {
    this.initialValues = cloneDeep(store)
    this.values = proxy(store)
  }

  set = <U extends FlattenObjectKeys<T>, V extends GetFieldType<T, U>>(
    key: U,
    newValue: V,
  ) => {
    setValue(this.values, key, newValue)
  }

  update = (state: Partial<T>) => Object.assign(this.values, state)

  get = <U extends FlattenObjectKeys<T>>(key: U) => getValue(this.values, key)

  useSnapshot = () => useSnapshot(this.values)

  useWatch = <U extends FlattenObjectKeys<T>, V extends GetFieldType<T, U>>(
    key: U,
    value: V,
  ) => useEffect(() => this.set(key, value), [key, value])

  clear = () => {
    const clonedInitialValues = cloneDeep(this.initialValues)
    Object.keys(clonedInitialValues).forEach((k) => {
      const key = k as FlattenObjectKeys<T>
      this.set(key, getValue(clonedInitialValues, key))
    })
  }
}
