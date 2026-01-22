import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
interface WindData {
  time: string;
  wind: number;
}
interface Props {
  data: WindData[];
}

export default function WindChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="time" />
        <Tooltip />
        <Line dataKey="wind" />
      </LineChart>
    </ResponsiveContainer>
  );
}
