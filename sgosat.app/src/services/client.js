import axios from 'axios';

export const HTTPClient = axios.create({
    baseURL: "https://localhost:7260",
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Authorization",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATHC, DELETE",
        "Content-Type": "application/json;charset=UTF-8",
    }
})