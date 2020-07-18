import axios from "axios";
export default async function (sql, params) {
  const response = await axios.post("/api/write", { sql: sql, params: params });
  return response.data;
}
