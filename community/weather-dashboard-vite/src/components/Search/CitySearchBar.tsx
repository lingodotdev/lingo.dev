import { useEffect, useState } from "react";
import axios from "axios";
import { useDebounce } from "../../hooks/useDebounce";

interface Props {
  onSelect: (city: string) => void;
}

interface CityResult {
  name: string;
  region: string;
  country: string;
}

export default function CitySearchBar({ onSelect }: Props) {
  const [value, setValue] = useState("");
  const [results, setResults] = useState<CityResult[]>([]);
  const debounced = useDebounce(value, 500);

  useEffect(() => {
    if (!debounced) return;

    const fetchCities = async () => {
      const res = await axios.get("https://api.weatherapi.com/v1/search.json", {
        params: {
          key: import.meta.env.VITE_WEATHER_API_KEY,
          q: debounced,
        },
      });
      setResults(res.data);
    };

    fetchCities();
  }, [debounced]);

  const handleSearch = () => {
    if (!value) return;
    onSelect(value);
    setValue("");
    setResults([]);
  };

  return (
    <div className="relative w-full flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search city..."
        className="border border-slate-300 p-2 w-full rounded bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      <button
        onClick={handleSearch}
        className="px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Search
      </button>

      {results.length > 0 && (
        <div className="absolute top-12 z-10 bg-white border border-slate-200 w-full rounded shadow-md">
          {results.map((city) => (
            <div
              key={`${city.name}-${city.country}`}
              onClick={() => {
                onSelect(city.name);
                setValue("");
                setResults([]);
              }}
              className="p-2 hover:bg-blue-50 cursor-pointer text-slate-800"
            >
              {city.name}, {city.country}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
