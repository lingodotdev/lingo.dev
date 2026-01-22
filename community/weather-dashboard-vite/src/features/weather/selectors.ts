import { type RootState } from "../../app/store";

export const selectWeatherByCity = (city: string) => (state: RootState) =>
  state.weather.cache[city];
