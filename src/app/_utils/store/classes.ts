import { cloneDeep } from 'lodash'
import { create } from 'zustand'

import { getValue, setValue } from './functions'
import type { FlattenObjectKeys, GetFieldType } from './types'

export class ZustandWrapper<T extends Record<string, unknown>> {
  private initialValues: T
  private useStore: ReturnType<typeof create<T>>

  constructor(store: T) {
    this.initialValues = cloneDeep(store)

    this.useStore = create<T>((set) => ({
      ...store,
      set: (key: string, value: unknown) => {
        const pathArray = key.split('.') as Array<keyof T>
        const updatedState = { ...this.useStore.getState() }
        setValue(updatedState, pathArray.join('.'), value)
        set(updatedState)
      },
      reset: () => set(cloneDeep(store)),
    }))
  }

  set = <U extends FlattenObjectKeys<T>, V extends GetFieldType<T, U>>(
    key: U,
    newValue: V,
  ) => {
    this.useStore.getState().set(key as string, newValue)
  }

  update = (state: Partial<T>) => {
    this.useStore.setState((s) => ({ ...s, ...state }))
  }

  get = <U extends FlattenObjectKeys<T>>(key: U) => {
    const state = this.useStore.getState()
    return getValue(state, key)
  }

  useSnapshot = () => this.useStore()

  clear = () => {
    this.useStore.setState(cloneDeep(this.initialValues))
  }
}
