type Equals<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Assert<T extends true> = T;
type _Check = Assert<Equals<OrderDto, GeneratedOrder>>;   // fails to compile on divergence
export {};
