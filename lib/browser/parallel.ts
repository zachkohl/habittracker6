import axios from "axios";
export default async function (array) {
  const response = await axios.post("/api/parallel", {
    params: array,
  });
  return response.data;
}
