import axios from "axios";

const API_URL = import.meta.env.VITE_SUPABASE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_KEY;

export const api = axios.create({
  baseURL: `${API_URL}/rest/v1/rpc`,
  headers: {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  }
});