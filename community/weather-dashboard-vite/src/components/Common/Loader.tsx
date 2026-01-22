export default function Loader() {
  return (
    <div className="p-4 flex items-center justify-center gap-3 bg-slate-100 text-slate-600">
      <div className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-blue-600 animate-spin" />
      <span>Loading weather data…</span>
    </div>
  );
}
