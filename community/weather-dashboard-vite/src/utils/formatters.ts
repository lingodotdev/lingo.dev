export const formatTemp = (c: number, unit: "C" | "F") => {
  const value = unit === "C" ? c : (c * 9) / 5 + 32;
  return `${Number(value.toFixed(2))}°${unit}`;
};


export function timeAgo(timestamp: number) {
  const diff = Math.floor((Date.now() - timestamp) / 1000);

  if (diff < 10) return "just now";
  if (diff < 60) return `${diff}s ago`;

  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m ago`;

  const hours = Math.floor(mins / 60);
  return `${hours}h ago`;
}