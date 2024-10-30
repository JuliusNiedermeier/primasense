// Display properties for deeply nested objects
export type Prettify<T> = { [K in keyof T]: T[K] } & {};
