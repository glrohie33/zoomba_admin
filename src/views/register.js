import React, {Fragment, useState} from 'react';
import {Button, Card, Grid, TextField} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {addAlert} from "../store/reducers/alertSlice";
import {registerUser} from "../actions/auth";
import {useDispatch} from "react-redux";
import {AUTHALERTNAME, ERRORALERT, SUCCESSALERT} from "../utils/texthelper";
import Displayalerts from "../components/displayalerts";


function Register(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ registerForm,setRegisterFormField ] = useState({
        firstname:"",
        lastname:"",
        email:"",
        password:"",
        phone:"",
        confirmPassword:"",
        userType:"vendor"
    });

    function setFieldData(event){
        setRegisterFormField(v=>({...v,[event.target.name]:event.target.value}))
    }

    function handleSubmit(){
            registerUser(registerForm)
                .then(e=>{
                    const data = e.data;
                    if(data.status){
                        dispatch(addAlert({
                            name: AUTHALERTNAME,
                            message:'Registration Successfull',
                            status:SUCCESSALERT
                        }));
                        navigate("/login",{replace:true});
                    }else{
                       console.log();
                    }

                })
                .catch(e=>{
                    const data = e.response.data
                dispatch(addAlert({
                    name:AUTHALERTNAME,
                    message:data.message,
                    status:ERRORALERT
                }));
            });
    }
    return (
        <Fragment>
            <Grid container className={'registration-container'}>
                <Grid item className={['flex','flex-center']} sm={12}>
                        <Card className={['registration-form-card','text-center']}>
                            <Displayalerts name={AUTHALERTNAME}></Displayalerts>
                            <TextField name='firstname' label="firstname" onChange={setFieldData }/>
                            <TextField name='lastname' label="lastname" onChange={setFieldData }/>
                            <TextField name='email' label="email" onChange={setFieldData }/>
                            <TextField name='phone' label="phone" onChange={setFieldData }/>
                            <TextField name='username' label="username" onChange={setFieldData }/>
                            <TextField name='password' label="password" type="password" onChange={setFieldData }/>
                            <TextField name='confirmPassword' label="confirm password" type="password" onChange={setFieldData }/>
                            <Button onClick={handleSubmit} style={{display:'block',width:'100%',margin: '10px 0px'}} variant="contained" size="large">Register</Button>
                            <span>Have and account? <Link to="/login">Login</Link></span>
                        </Card>
                </Grid>
            </Grid>
        </Fragment>

    );
}

export default Register;