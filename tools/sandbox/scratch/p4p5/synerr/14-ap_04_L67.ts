// validates but the compiler learns nothing the caller can use
function isOrderDto(x: unknown): boolean { … }

// parses: either a value of the precise type, or a typed failure
function parseOrderDto(x: unknown): Result<OrderDto, ParseError> { … }
export {};
