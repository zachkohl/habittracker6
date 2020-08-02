import { parallel } from "../../lib/sqlite";

export default async (req, res) => {
  const rows = await parallel(req.body.params);

  res.send(rows);
};
