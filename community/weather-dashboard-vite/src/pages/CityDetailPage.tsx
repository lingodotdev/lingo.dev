import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import axios from "axios";

import Loader from "../components/Common/Loader";
import type { ForecastResponse } from "../features/weather/types";
import TemperatureChart from "../components/Charts/TemperatureChart";
import DailyTempChart from "../components/Charts/DailyTempChart";
import { formatTemp } from "../utils/formatters";

export default function CityDetailPage() {
  const navigate = useNavigate();
  const { city } = useParams<{ city: string }>();

  const unit = useSelector((s: RootState) => s.settings.unit);

  const [data, setData] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city) return;

    setLoading(true);
    axios
      .get<ForecastResponse>("https://api.weatherapi.com/v1/forecast.json", {
        params: {
          key: import.meta.env.VITE_WEATHER_API_KEY,
          q: city,
          days: 7,
        },
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [city]);

  if (loading || !data) return <Loader />;

  const { current, forecast } = data;

  const hourlyData = forecast.forecastday[0].hour.map((h) => ({
    time: h.time.split(" ")[1],
    temp: unit === "C" ? h.temp_c : h.temp_f,
  }));

  const dailyData = forecast.forecastday.map((d) => ({
    date: d.date,
    temp: unit === "C" ? d.day.avgtemp_c : d.day.avgtemp_f,
  }));

  return (
    <div className="p-6 space-y-6 bg-slate-200 text-slate-800">
      <button
        onClick={() => navigate(-1)}
        className="px-3 py-1 border border-slate-300 rounded text-slate-700 hover:bg-blue-50 hover:text-blue-600"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-blue-700">{city}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Pressure" value={`${current.pressure_mb} mb`} />
        <Stat label="UV Index" value={current.uv} />
        <Stat label="Dew Point" value={`${current.dewpoint_c} °C`} />
        <Stat label="Wind" value={`${current.wind_kph} km/h`} />
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-2 text-slate-700">
          Hourly Forecast
        </h2>
        <div className="flex overflow-x-auto gap-4">
          {forecast.forecastday[0].hour.map((h) => (
            <div
              key={h.time}
              className="min-w-[100px] border border-slate-200 bg-white p-2 rounded text-center"
            >
              <p className="text-sm text-slate-500">{h.time.split(" ")[1]}</p>
              <img src={h.condition.icon} alt={h.condition.text} />
              <p className="font-semibold text-blue-600">
                {formatTemp(h.temp_c, unit)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2 text-slate-700">
          Hourly Temperature Trend
        </h2>
        <TemperatureChart data={hourlyData} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2 text-slate-700">
          7-Day Forecast
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
          {forecast.forecastday.map((d) => (
            <div
              key={d.date}
              className="border border-slate-200 bg-white p-3 rounded text-center"
            >
              <p className="text-sm text-slate-500">{d.date}</p>
              <img src={d.day.condition.icon} alt={d.day.condition.text} />
              <p className="font-semibold text-blue-600">
                {formatTemp(d.day.avgtemp_c, unit)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2 text-slate-700">
          7-Day Average Temperature
        </h2>
        <DailyTempChart data={dailyData} />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-slate-200 bg-white p-3 rounded text-center">
      <p className="text-slate-500 text-sm">{label}</p>
      <p className="text-lg font-bold text-blue-600">{value}</p>
    </div>
  );
}
