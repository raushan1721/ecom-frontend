import axios from "axios";

// const BASE_URL = "http://localhost:5000/api/";
const BASE_URL = "https://ecom-backend1721.herokuapp.com/api/";
const token = window.localStorage.getItem('accessToken');

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { authorization: `Bearer ${token}` },
});