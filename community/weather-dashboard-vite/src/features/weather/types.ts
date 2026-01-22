export interface Condition {
  text: string;
  icon: string;
}

export interface HourForecast {
  time: string;
  temp_c: number;
  temp_f: number;
  condition: Condition;
}

export interface DayForecast {
  date: string;
  day: {
    avgtemp_c: number;
    avgtemp_f: number;
    condition: Condition;
  };
  hour: HourForecast[];
}

export interface CurrentWeather {
  pressure_mb: number;
  uv: number;
  dewpoint_c: number;
  wind_kph: number;
}

export interface ForecastResponse {
  current: CurrentWeather;
  forecast: {
    forecastday: DayForecast[];
  };
}
