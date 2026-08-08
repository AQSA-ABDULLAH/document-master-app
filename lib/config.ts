// lib/config.ts

import axios from "axios";

const API_URL = axios.create({
  baseURL: "https://document-master-server.vercel.app/api",
});

export default API_URL;
