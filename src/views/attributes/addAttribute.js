import React,{Fragment, useState} from 'react';
import {Button, Card, Grid, TextField} from "@mui/material";
import Displayalerts from "../../components/displayalerts";
import {
    ATTRIBUTElISTURL,
    AUTHALERTNAME,
    ERRORALERT,
    SUCCESSALERT
} from "../../utils/texthelper";
import {convertToForm} from "../../utils/utils";
import {post} from "../../actions/auth";
import {addAlert} from "../../store/reducers/alertSlice";
import {useDispatch} from "react-redux";

function AddAttribute(props) {
    const dispatch = useDispatch();
    const formSchema = {
        name:"",
        options:"",
        unit:"",
    }

    const initialState ={
        name:"",
        options:[],
        unit:[],
        set Options(value){
            this.options = value.split(',')
        },
        get Options(){
            return this.options.join(",")
        },
        set Unit(value){
            this.unit = value.split(',')
        },
        get Unit(){
            return this.unit.join(",")
        }

    }

    const[formFields,setFormField] = useState(initialState)

    function setFieldData(event){
        setFormField(v=>({...v,[event.target.name]:event.target.value}))
    }

    function handleSubmit(){
        const formData = convertToForm(formFields,formSchema);
        const {name,unit,options} = formFields;
        post(ATTRIBUTElISTURL,{name,unit,options},formData)
            .then(e=>{
                const data = e.data;
                if(data.status){
                    dispatch(addAlert({
                        name: AUTHALERTNAME,
                        message:'Brand added',
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
                <Grid item className='flex flex-center  margin-top-bottom' sm={12}>
                    <Displayalerts name={AUTHALERTNAME}></Displayalerts>
                </Grid>
                <Grid item className='flex flex-center margin-top-10' sm={12}>
                    <Card className='registration-form-card text-center'>
                        <Grid container spacing={2} >
                            <Grid item sm={12}>
                                <TextField  value={formFields.name} name='name' label="attribute name" onChange={setFieldData }/>
                            </Grid>
                            <Grid item sm={12}>
                                <TextField multiline  value={formFields.Options} name='Options' label="Options" onChange={setFieldData }/>
                            </Grid>
                            <Grid item sm={12}>
                                <TextField multiline  value={formFields.Unit} name='Unit' label="Units" onChange={setFieldData }/>
                            </Grid>

                        </Grid>
                        <Button onClick={handleSubmit} style={{display:'block',width:'100%',margin: '10px 0px'}} variant="contained" size="large">Add Attribute</Button>
                    </Card>
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default AddAttribute;