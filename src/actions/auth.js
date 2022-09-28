import axios from "axios";
import {REGISTRATIONENDPOINT, STORAGEUSERKEY} from "../utils/texthelper";
import store from "../store/store";
import { logoutUser } from "../store/reducers/loginSlice";

export const registerUser=async (data) => {
    return axios.post(REGISTRATIONENDPOINT, data);
}

let api = axios.create({
    baseURL: "",
    withCredentials:true
});

const handleGlobalError =(response,error)=>{
    // window.location = '/login';
  if(response.response.status == 401){
      window.localStorage.removeItem(STORAGEUSERKEY);
      store.dispatch(logoutUser());
  }
  return Promise.reject(response);
}

api.interceptors.response.use(resp=>{
    return resp;
},handleGlobalError);

export const post= (url,data,headers={})=>{
    return api.post(url,data,headers);
}

export const get= (url,config={})=>{

    return api.get(url,config);
}

export const patch= (url,data={},headers={})=>{
    let header = {
    }
    const finalHeader = Object.assign(header,headers);
    return api.patch(url,data,headers);
}
