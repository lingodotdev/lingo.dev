import CityCard from "./CityCard";

interface Props {
  cities: string[];
}

export default function DashboardGrid({ cities }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-100 p-4 rounded">
      {cities.map((city) => (
        <CityCard key={city} city={city} />
      ))}
    </div>
  );
}
