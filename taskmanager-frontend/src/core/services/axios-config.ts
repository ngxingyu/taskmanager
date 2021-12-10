import { store, RootState } from "../../app/store";
import axios from "axios";
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

instance.interceptors.request.use(
    function (config) {
        const state: RootState = store.getState();
        const auth_token = state?.users?.user?.auth_token || "";
        (config.headers || { Authorization: "" }).Authorization = auth_token ? `Bearer ${auth_token}` : '';
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default instance;