export {};
type Nullable<T> = { [K in keyof T]: T[K] | null };
type Draft<T> = { -readonly [K in keyof T]?: T[K] };   // writable and optional

interface User { readonly id: number; name: string }
type N = Nullable<User>;     // { readonly id: number | null; name: string | null }
type D = Draft<User>;        // { id?: number; name?: string }
