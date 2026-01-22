import { createSlice, createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../app/store";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export interface WeatherData {
  temp_c: number;
  temp_f: number;
  condition: {
    text: string;
    icon: string;
  };
  humidity: number;
  wind_kph: number;
  pressure_mb: number;
  uv: number;
  last_updated: string;
}

interface CachedWeather {
  data: WeatherData;
  timestamp: number;
}

interface WeatherState {
  cache: Record<string, CachedWeather>;
  status: "idle" | "loading" | "failed";
}

const initialState: WeatherState = {
  cache: {},
  status: "idle",
};


export const fetchWeather = createAsyncThunk<
  { city: string; data: WeatherData; fromCache: boolean },
  string,
  { state: RootState }
>("weather/fetchWeather", async (city, { getState }) => {
  const cached = getState().weather.cache[city];

  if (cached && Date.now() - cached.timestamp < 60000) {
    return { city, data: cached.data, fromCache: true };
  }

  const res = await axios.get("https://api.weatherapi.com/v1/current.json", {
    params: {
      key: API_KEY,
      q: city,
    },
  });

  return {
    city,
    data: res.data.current,
    fromCache: false,
  };
});

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchWeather.fulfilled,
        (
          state,
          action: PayloadAction<{
            city: string;
            data: WeatherData;
            fromCache: boolean;
          }>
        ) => {
          state.cache[action.payload.city] = {
            data: action.payload.data,
            timestamp: Date.now(),
          };
          state.status = "idle";
        }
      )
      .addCase(fetchWeather.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default weatherSlice.reducer;
