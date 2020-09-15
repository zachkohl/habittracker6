import { parallel } from "../../lib/sqlite";

export default async function parallelAPI(req, res) {
  const rows = await parallel(req.body.params);

  res.send(rows);
}
