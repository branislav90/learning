type Position = { lat: number; lon: number };
type GeoPort = { current(signal: AbortSignal): Promise<Position> };
type WeatherApi = { at(p: Position, signal: AbortSignal): Promise<{ temp: number }> };

type Weather =
  | { status: 'loading' }
  | { status: 'ready'; temp: number; updatedAt: number }
  | { status: 'error'; message: string };

function useGeoWeather(deps: { geo: GeoPort; weather: WeatherApi; clock: Clock }): Weather {
  const { geo, weather, clock } = deps;
  const [state, setState] = useState<Weather>({ status: 'loading' });
  useEffect(() => {
    const c = new AbortController();
    (async () => {
      try {
        const pos = await geo.current(c.signal);
        const w = await weather.at(pos, c.signal);
        if (!c.signal.aborted) setState({ status: 'ready', temp: w.temp, updatedAt: clock.now() });
      } catch (e) {
        if (!c.signal.aborted) setState({ status: 'error', message: e instanceof Error ? e.message : 'Unknown' });
      }
    })();
    return () => c.abort();
  }, [geo, weather, clock]);
  return state;
}
export {};
