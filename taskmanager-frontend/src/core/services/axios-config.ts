import { store, ApplicationState } from "store";
import axios from "axios";
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

instance.interceptors.request.use(
    (config) => {
        const state: ApplicationState = store.getState();
        const auth_token = state.user_state.user?.auth_token || "";
        (config.headers || { Authorization: "" }).Authorization = auth_token ? `Bearer ${auth_token}` : '';
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;