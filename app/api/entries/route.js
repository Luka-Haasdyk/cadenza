import { Pool } from "pg";

const pool = new Pool({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_NAME,
  password: process.env.PSQL_PASSWORD,
  port: process.env.PSQL_PORT,
});

export async function POST(req) {
  try {
    const body = await req.json();

    const { title, text, id, track } = body;
    const date = new Date();

    const result = await pool.query(
      "INSERT INTO entries (id, title, text, track, date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, title , text, track, date]
    );

    // Return the inserted data with a 201 status
    return Response.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error saving entry:", error);
    return Response.json({ message: "Error saving entry" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM entries ORDER BY date DESC");
    return Response.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching entries:", error);
    return Response.json(
      { message: "Error fetching entries" },
      { status: 500 }
    );
  }
}
