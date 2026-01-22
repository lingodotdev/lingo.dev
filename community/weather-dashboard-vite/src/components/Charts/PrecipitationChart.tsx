import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

interface PrecipitationData {
  time: string;
  rain: number;
}

interface Props {
  data: PrecipitationData[];
}

export default function PrecipitationChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="time" />
        <Tooltip />
        <Bar dataKey="rain" />
      </BarChart>
    </ResponsiveContainer>
  );
}
