merged[key] = (event: { defaultPrevented?: boolean }, ...rest: unknown[]) => {
  c(event, ...rest);
  if (!event?.defaultPrevented) s(event, ...rest);
};
export {};
