import React,{Fragment, useState} from 'react';
import {useDispatch} from "react-redux";
import {post} from "../../actions/auth";
import {
    AUTHALERTNAME,
    ERRORALERT,
    STORELISTURL,
    SUCCESSALERT
} from "../../utils/texthelper";
import {addAlert} from "../../store/reducers/alertSlice";
import {Button, Card, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import Displayalerts from "../../components/displayalerts";

function AddStore(props) {

    const dispatch = useDispatch();

    const initialState ={
        name:"",
        phone:"",
        address:"",
        entity:"",
        accountManager:"",
        email:[],
        password:[],
        confirmPassword:[],
    }
    const[formFields,setFormField] = useState(initialState)

    function setFieldData(event){
        setFormField(v=>({...v,[event.target.name]:event.target.value}))
    }

    function handleSubmit(){
        post(STORELISTURL,formFields,{
            'Content-Type': 'multipart/form-data'
        })
            .then(e=>{
                const data = e.data;
                if(data.status){
                    dispatch(addAlert({
                        name: AUTHALERTNAME,
                        message:'store created',
                        status:SUCCESSALERT
                    }));
                    setFormField(initialState)
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
                <Grid item className={['flex','flex-center','margin-top-bottom']} sm={12}>
                    <Displayalerts name={AUTHALERTNAME}></Displayalerts>
                </Grid>
                <Grid item className={['flex','flex-center','margin-top-10']} sm={12}>
                    <Card className={['registration-form-card','text-center']}>
                        <Grid container spacing={2} >
                            <Grid item sm={12}>
                                <TextField  value={formFields.name} name='name' label="store name" onChange={setFieldData }/>
                            </Grid>
                            <Grid item sm={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="entity-label">Entity</InputLabel>
                                    <Select
                                        labelId={"entity-label"}
                                        label="Entity"
                                        value={formFields.entity}
                                        onChange={setFieldData }
                                        name="entity"
                                    >
                                        <MenuItem value={"individual"}>
                                            Individual
                                        </MenuItem>
                                        <MenuItem value={"registered"}>
                                            Registered Company
                                        </MenuItem>
                                    </Select>
                                </FormControl>

                            </Grid>
                            <Grid item sm={12}>
                                <TextField value={formFields.email} name='email' label="email" onChange={setFieldData }/>
                            </Grid>
                            <Grid item sm={6}>
                                <TextField value={formFields.phone} name='phone' label="phone" onChange={setFieldData }/>
                            </Grid>
                            <Grid item sm={6}>
                                <TextField value={formFields.additionalPhone} name='additionalPhone' label="additional phone number" onChange={setFieldData }/>
                            </Grid>
                            <Grid item sm={12}>
                                <TextField value={formFields.address} multiline rows={4} name='address' label="address" onChange={setFieldData }/>
                            </Grid>
                            <Grid item sm={12}>
                                <TextField value={formFields.accountManager} name='accountManager' label="Account Manager" onChange={setFieldData }/>
                            </Grid>
                            <Grid item sm={6}>
                                <TextField value={formFields.password} type={'password'} name='password' label="password" onChange={setFieldData }/>
                            </Grid>
                            <Grid item sm={6}>
                                <TextField type={'password'} value={formFields.confirmPassword} name='confirmPassword' label="confirm password" onChange={setFieldData }/>
                            </Grid>
                        </Grid>
                        <Button onClick={handleSubmit} style={{display:'block',width:'100%',margin: '10px 0px'}} variant="contained" size="large">Create Store</Button>
                    </Card>
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default AddStore;