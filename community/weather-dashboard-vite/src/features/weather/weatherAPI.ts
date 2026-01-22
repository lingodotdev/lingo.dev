import axios from "axios";

const api = axios.create({
  baseURL: "https://api.weatherapi.com/v1",
  timeout: 10000,
});

export const getCurrentWeather = (city: string, apiKey: string) => {
  return api.get("/current.json", {
    params: {
      key: apiKey,
      q: city,
    },
  });
};

export const getForecastWeather = (city: string, days: number, apiKey: string) => {
  return api.get("/forecast.json", {
    params: {
      key: apiKey,
      q: city,
      days,
    },
  });
};

export const getForecast = (city: string) =>
  axios.get("https://api.weatherapi.com/v1/forecast.json", {
    params: {
      key: import.meta.env.VITE_WEATHER_API_KEY,
      q: city,
      days: 7,
    },
  });

