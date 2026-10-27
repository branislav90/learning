export {};
async function getConfig(): Promise<Config> {
  const res = await fetch("/config.json");
  return (await res.json()) as Config;
}
