// import dotenv from "dotenv";
import axios from "axios";
import {stateLocalStorage} from "../machines/withLocalStorage";

// dotenv.config();

const httpClient = axios.create({
  withCredentials: true,
});

httpClient.interceptors.request.use((config) => {

  const accessToken = stateLocalStorage.get()?.context?.token?.access_token;
  if(accessToken){
    // @ts-ignore
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }


  return config;
});

export { httpClient };
