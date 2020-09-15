import { read, write } from "../../lib/sqlite";

export default async (req, res) => {
  const rows = await read("SELECT * from habits", []);

  res.send(rows);
};
