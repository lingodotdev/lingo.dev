import postgres from "postgres";

const connectionString = Bun.env.NEON_PG_URL;

if (!connectionString) {
  throw new Error("NEON_PG_URL is missing in .env");
}

const sql = postgres(connectionString, { ssl: "require" });

// Initialize table if not exists
await sql`
  CREATE TABLE IF NOT EXISTS stats (
    id SERIAL PRIMARY KEY,
    count INTEGER DEFAULT 0
  )
`;

// Ensure initial row exists
await sql`
  INSERT INTO stats (id, count)
  VALUES (1, 0)
  ON CONFLICT (id) DO NOTHING
`;

export const incrementCounter = async () => {
  const [result] = await sql`
    UPDATE stats
    SET count = count + 1
    WHERE id = 1
    RETURNING count
  `;
  return result?.count || 0;
};

export const getCounter = async () => {
  const [result] = await sql`
    SELECT count FROM stats WHERE id = 1
  `;
  return result?.count || 0;
};
