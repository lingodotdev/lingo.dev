import CitySearchBar from "../Search/CitySearchBar";

interface Props {
  onCityAdd: (city: string) => void;
}

export default function DashboardHeader({ onCityAdd }: Props) {
  return (
    <div className="space-y-4 bg-slate-100 p-4 rounded">
      <h1 className="text-2xl font-bold text-blue-700">Weather Dashboard</h1>
      <CitySearchBar onSelect={onCityAdd} />
    </div>
  );
}
