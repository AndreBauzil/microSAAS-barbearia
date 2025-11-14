// frontend/src/lib/api.ts
import axios from 'axios';

const VITE_URL = import.meta.env.VITE_API_URL;

// Env. Var. or localhost as fallback to 'npm run dev'
const API_URL = VITE_URL || 'http://localhost:3333';

export const api = axios.create({
  baseURL: API_URL,
});