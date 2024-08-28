export type GetIndexedField<T, K> = K extends keyof T
  ? T[K]
  : K extends `${number}`
    ? '0' extends keyof T
      ? undefined
      : number extends keyof T
        ? T[number]
        : undefined
    : undefined

export type FieldWithPossiblyUndefined<T, Key> =
  | GetFieldType<Exclude<T, undefined>, Key>
  | Extract<T, undefined>

export type IndexedFieldWithPossiblyUndefined<T, Key> =
  | GetIndexedField<Exclude<T, undefined>, Key>
  | Extract<T, undefined>

export type FlattenObjectKeys<
  T extends Record<string, unknown>,
  Key = keyof T,
> = Key extends string
  ? T[Key] extends Record<string, unknown>
    ? `${Key}.${FlattenObjectKeys<T[Key]>}` | Key
    : `${Key}`
  : never

export type GetFieldType<T, P> = P extends `${infer Left}.${infer Right}`
  ? Left extends keyof T
    ? FieldWithPossiblyUndefined<T[Left], Right>
    : Left extends `${infer FieldKey}[${infer IndexKey}]`
      ? FieldKey extends keyof T
        ? FieldWithPossiblyUndefined<
            IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>,
            Right
          >
        : undefined
      : undefined
  : P extends keyof T
    ? T[P]
    : P extends `${infer FieldKey}[${infer IndexKey}]`
      ? FieldKey extends keyof T
        ? IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>
        : undefined
      : undefined
