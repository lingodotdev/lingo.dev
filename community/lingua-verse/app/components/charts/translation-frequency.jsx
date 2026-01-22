"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { SUPPORTED_LANGUAGES } from "../../../config/lingo-config/index.js";

export default function TranslationFrequency({ data = [] }) {
  // Transform data and add language names
  const chartData = data.map((item) => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === item.language);
    return {
      ...item,
      name: lang ? `${lang.flag} ${lang.name}` : item.language,
      translations: item.count,
    };
  });

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey="name"
          stroke="rgba(255,255,255,0.5)"
          tick={{ fill: "rgba(255,255,255,0.7)" }}
        />
        <YAxis
          stroke="rgba(255,255,255,0.5)"
          tick={{ fill: "rgba(255,255,255,0.7)" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(0,0,0,0.8)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
          }}
        />
        <Legend />
        <Bar
          dataKey="translations"
          fill="#8b5cf6"
          radius={[8, 8, 0, 0]}
          animationBegin={0}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
