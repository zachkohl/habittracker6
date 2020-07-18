import { read, write } from "../../lib/sqlite";

export default async (req, res) => {
  const rows = await write(req.body.sql, req.body.params);

  res.send(rows);
};
