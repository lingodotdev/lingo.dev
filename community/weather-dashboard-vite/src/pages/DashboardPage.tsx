import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardGrid from "../components/Dashboard/DashboardGrid";
import { useRealtimeWeather } from "../hooks/useRealtimeWeather";

export default function DashboardPage() {
  const [baseCities, setBaseCities] = useState(["Mumbai", "Pune", "Delhi"]);
  const [params, setParams] = useSearchParams();

  const searchedCity = params.get("city");

  useEffect(() => {
    if (searchedCity && !baseCities.includes(searchedCity)) {
      setBaseCities((prev) => [...prev, searchedCity]);
      setParams({});
    }
  }, [searchedCity, baseCities, setParams]);

  const cities = baseCities;

  useRealtimeWeather(cities);

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <DashboardGrid cities={cities} />
    </div>
  );
}
