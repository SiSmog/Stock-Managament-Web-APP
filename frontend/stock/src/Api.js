import axios from "axios";
import { API } from "./env.js";
const api = axios.create({baseURL:API})
export default api