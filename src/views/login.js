
import React, {useEffect, useState} from 'react';
import {loginUser} from "../store/reducers/loginSlice";
import {Button, Card, Grid, IconButton, InputAdornment, TextField} from "@mui/material";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {AUTHALERTNAME, LOGINENDPOINT, SUCCESSALERT, WARNINGALERT} from "../utils/texthelper";
import {post} from "../actions/auth";
import {addAlert} from "../store/reducers/alertSlice";
import {useDispatch, useSelector} from "react-redux";
import Displayalerts from "../components/displayalerts";

function Login(props) {
    const dispatch = useDispatch();
    const {state} = useLocation();
    const navigate = useNavigate();
    const auth = useSelector(store=>store.auth);
    useEffect(()=>{
        if(auth.loginState){
            navigate(state?.path || '/');
        }
    },[auth, navigate, state?.path]);


    const [loginForm,setLoginFormData] = useState({
        email:"",
        password:"",
        showPassword:false
    });
    const [buttonDisabled,setButtonDisabled] = useState(true);
    const setData = (event)=>{
        const {name,value} = event.target;
        setLoginFormData(v=>({...v,[name]:value}));
    }



    function  handleSubmit(){
            post(LOGINENDPOINT,loginForm).then(resp=>{
                const {status,user}= resp.data

                if(status){
                    dispatch(addAlert({
                        name:AUTHALERTNAME,
                        message:'Success! you will be redirected soon',
                        status:SUCCESSALERT
                    }));
                    setTimeout(()=>{
                        dispatch(loginUser({user}));
                    },3000)
                }
            }).catch(e=>{
                const respData = e.response.data;
               dispatch(addAlert({
                   name:AUTHALERTNAME,
                   message: respData.message,
                   status:WARNINGALERT
               }))
            })
    }

    function showPassword(){
        const newValue = !loginForm.showPassword;
        setLoginFormData(v=>({...v,showPassword:newValue}))
    }

    useEffect(()=>{
        if(loginForm.email.length > 0 && loginForm.password.length > 0){
            setButtonDisabled(false);
        }else {
            setButtonDisabled(true);
        }
    },[loginForm])

    return (
        <Grid container spacing={1} className='login-container' >
            <Grid item sm={8}  >
            </Grid>
            <Grid item sm={4}  style={{display:'flex'}} >
               <Card className={'login-card'} >
                  <h3>Login</h3>
                   <Displayalerts name={AUTHALERTNAME}></Displayalerts>
                    <form>
                        <TextField name="email" required label="Email" onKeyUp={setData} />
                        <TextField  name="password" required label="Password" type="password" onKeyUp={setData} endAdornment={
                            <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={showPassword}
                                edge="end"
                            >
                                {loginForm.showPassword ? < VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>} />
                        <Button disabled={buttonDisabled} onClick={handleSubmit} style={{display:'block',width:'100%',margin: '10px 0px'}} variant="contained" size="large">Login</Button>
                    </form>
                   <span>Don't have and account? <Link to="/register">Register</Link></span>
               </Card>
            </Grid>
        </Grid>
    );
}

export default Login;