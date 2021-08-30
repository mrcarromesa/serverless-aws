declare module 'yup' {
  export interface BaseSchema {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cast(value: any, options?: CastOptions<TContext>): any;
  }
}

export const string: StringSchemaConstructor;
