import {createSlice} from "@reduxjs/toolkit";
import {GETUSERURL, STORAGEUSERKEY} from "../../utils/texthelper";
import {get} from "../../actions/auth";

const storageUser = window.localStorage.getItem(STORAGEUSERKEY);
let isLogin = Boolean(storageUser);
let userData = (isLogin)?JSON.parse(storageUser):[];
if(isLogin){
    (async ()=>{
        try{
            // eslint-disable-next-line no-unused-vars
            const verifyUser = await get(GETUSERURL+userData.id);

        }catch (e) {
            if(e.response?.status === 401){
                isLogin = false;
                userData={};
                // window.localStorage.removeItem(STORAGEUSERKEY);
            }
        }
    })();

}
export const authSlice= createSlice({
    name:'auth',
    initialState:{
        loginState: isLogin,
        user: userData
    },
    reducers:{
        loginUser: (state,action) => {
            const {user} = action.payload;
            window.localStorage.setItem(STORAGEUSERKEY,JSON.stringify(user));
            state.user = user;
            state.loginState = true;
        },
        logoutUser:(state)=>{
            window.localStorage.removeItem(STORAGEUSERKEY);
            state.user = [];
            state.loginState = false;
        }
    }

})

export const {loginUser,logoutUser}= authSlice.actions;
export default authSlice.reducer;