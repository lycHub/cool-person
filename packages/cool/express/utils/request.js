import axios from "axios";

const request = axios.create({
  baseURL: "https://dogapi.dog/api/v2",
});

export default request;
