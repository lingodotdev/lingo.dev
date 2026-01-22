import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchWeather } from "../features/weather/weatherSlice";
import type { AppDispatch } from "../app/store";

export function useRealtimeWeather(cities: string[]) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    cities.forEach((city) => dispatch(fetchWeather(city)));

    const i = setInterval(() => {
      cities.forEach((city) => dispatch(fetchWeather(city)));
    }, 60000);

    return () => clearInterval(i);
  }, [cities, dispatch]);
}
