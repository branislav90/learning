export {};
async function load() { return { id: 1, tags: ["a"] }; }
type R = Awaited<ReturnType<typeof load>>;
