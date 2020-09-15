import { read, write } from "../../lib/sqlite";

export default async (req, res) => {
  const rows = await write("INSERT INTO Habits (name) VALUES(?)", [
    req.body.habit,
  ]);

  res.send(JSON.stringify(rows));
};
