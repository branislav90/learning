type Thunk<T> = () => T | Thunk<T>;

function trampoline<T>(f: Thunk<T>): T {
  let result: T | Thunk<T> = f;
  while (typeof result === "function") result = (result as Thunk<T>)();
  return result;
}

const isEven = (n: number): boolean | (() => unknown) =>
  n === 0 ? true : () => isOdd(n - 1);
const isOdd = (n: number): boolean | (() => unknown) =>
  n === 0 ? false : () => isEven(n - 1);

trampoline(() => isEven(1_000_000)); // true, constant stack
