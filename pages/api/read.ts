import { read, write } from "../../lib/sqlite";

export default async (req, res) => {
  const rows = await read(req.body.sql, req.body.params);

  res.send(rows);
};
