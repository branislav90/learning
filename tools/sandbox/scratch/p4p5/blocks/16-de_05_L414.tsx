function useGeoWeather() {
  const [state, setState] = useState<{ temp: number; updatedAt: number } | null>(null);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const res = await fetch(`/api/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
      const json = await res.json();
      setState({ temp: json.temp, updatedAt: Date.now() });
    });
  }, []);
  return state;
}
export {};
