import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./reducers/loginSlice";
import {alertReducer} from "./reducers/alertSlice";
export default configureStore({
    reducer:{
        auth: authReducer,
        alert: alertReducer
    }
});