import React, {useState,Fragment} from 'react';
import {post} from "../../actions/auth";
import {
    AUTHALERTNAME,
    ERRORALERT,
    PAYMENTOPTIONSURL,
    SUCCESSALERT
} from "../../utils/texthelper";
import {addAlert} from "../../store/reducers/alertSlice";
import {Button, Card,  Grid, TextField} from "@mui/material";
import Displayalerts from "../../components/displayalerts";
import {useDispatch} from "react-redux";

function AddPayment(props) {
    const dispatch = useDispatch();
    const initialState = {
        name:'',
        key:'',
        downPercent:'',
        interestRate:'',
        email:'',
        firstname:'',
        lastname:'',
        password:'',
        confirmPassword: ''
    };
    const [formFields,setFormField] = useState(initialState);

    function setFieldData(event){
        setFormField(v=>({...v,[event.target.name]:event.target.value}))
    }

    function handleSubmit(){
        post(PAYMENTOPTIONSURL,formFields)
            .then(e=>{
                const data = e.data;
                if(data.status){
                    dispatch(addAlert({
                        name: AUTHALERTNAME,
                        message:'payment option created',
                        status:SUCCESSALERT
                    }));
                    setFormField(initialState)
                }else{
                    console.log();
                }
            })
            .catch(e=>{
                const data = e?.response?.data
                console.log(e);
                dispatch(addAlert({
                    name:AUTHALERTNAME,
                    message:data?.message||'there is an error',
                    status:ERRORALERT
                }));
            });
    }

    return (
            <Fragment>
                <Grid container className={'registration-container'}>
                        <Displayalerts name={AUTHALERTNAME}></Displayalerts>
                    <Grid item className={['flex','flex-center','margin-top-10']} sm={12}>
                        <Card className={['registration-form-card','text-center']}>
                            <Grid container spacing={2} >
                                <Grid item sm={12}>
                                    <TextField  value={formFields.name} name='name' label="name" onChange={setFieldData }/>
                                </Grid>
                                <Grid item sm={12}>
                                    <TextField  value={formFields.key} name='key' label="key" onChange={setFieldData }/>
                                </Grid>
                                <Grid item sm={6}>
                                    <TextField value={formFields.downPercent} name='downPercent' label="Down Percent" onChange={setFieldData }/>
                                </Grid>
                                <Grid item sm={6}>
                                    <TextField value={formFields.interestRate} name='interestRate' label="Interest Rate" onChange={setFieldData }/>
                                </Grid>
                                <Grid item sm={12}>
                                    <TextField value={formFields.email} name='email' label="Admin Email" onChange={setFieldData }/>
                                </Grid>
                                <Grid item sm={6}>
                                    <TextField value={formFields.firstname} name='firstname' label="Admin First Name" onChange={setFieldData }/>
                                </Grid>
                                <Grid item sm={6}>
                                    <TextField value={formFields.lastname} name='lastname' label="Admin Last Name" onChange={setFieldData }/>
                                </Grid>
                                <Grid item sm={6}>
                                    <TextField value={formFields.password} name='password' label="Admin Password" onChange={setFieldData }/>
                                </Grid>
                                <Grid item sm={6}>
                                    <TextField value={formFields.confirmPassword} name='confirmPassword' label="Confirm Password" onChange={setFieldData }/>
                                </Grid>
                            </Grid>
                            <Button onClick={handleSubmit} style={{display:'block',width:'100%',margin: '10px 0px'}} variant="contained" size="large">Add Option</Button>
                        </Card>
                    </Grid>
                </Grid>
            </Fragment>
    );
}

export default AddPayment;
