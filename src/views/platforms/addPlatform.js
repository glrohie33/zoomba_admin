import React, {Fragment,useState} from 'react';
import {useDispatch} from "react-redux";
import {post} from "../../actions/auth";
import {
    AUTHALERTNAME,
    DEFAULTIMAGE,
    ERRORALERT,
    PLATFORMlISTURL,
    SUCCESSALERT
} from "../../utils/texthelper";
import {addAlert} from "../../store/reducers/alertSlice";
import {Button, Card, Grid, TextField} from "@mui/material";
import Displayalerts from "../../components/displayalerts";
import {convertToForm, getInputFiles} from "../../utils/utils";

function AddPlatform(props) {
    const dispatch = useDispatch();
    const formSchema = {
        name:"",
        image:"",
        key:""
    }
    const initialState ={
        name:"",
        image:"",
        key:"",
        imagePreview: ""
    }
    const[formFields,setFormField] = useState(initialState)

    function setFieldData(event){
        setFormField(v=>({...v,[event.target.name]:event.target.value}))
    }

    function handleSubmit(){
        const formData = convertToForm(formFields,formSchema);
        post(PLATFORMlISTURL,formData,{
            'Content-Type': 'multipart/form-data'
        })
            .then(e=>{
                const data = e.data;
                if(data.status){
                    dispatch(addAlert({
                        name: AUTHALERTNAME,
                        message:'Platform added',
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
    async function setImage({target}) {

        const files = await getInputFiles(target.files);
        const file = files[0]?.file || "";
        const filePreviews = files[0]?.preview || DEFAULTIMAGE;
        setFormField(v=>({...v,image:file,imagePreview:filePreviews}));
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
                                <TextField  value={formFields.name} name='name' label="platform name" onChange={setFieldData }/>
                            </Grid>
                            <Grid item sm={12}>
                                <TextField  value={formFields.key} name='key' label="platform key" onChange={setFieldData }/>
                            </Grid>
                            <Grid item sm={12}>
                                <TextField type='file' label="image" onChange={setImage} multiple accept="image/jpeg" ></TextField>
                                <Card>
                                    <img
                                        style={{height:143,objectFit:'contain'}}
                                        src={formFields.imagePreview||DEFAULTIMAGE}
                                        alt="category"
                                    />
                                </Card>
                            </Grid>
                        </Grid>
                        <Button onClick={handleSubmit} style={{display:'block',width:'100%',margin: '10px 0px'}} variant="contained" size="large">Create Platform</Button>
                    </Card>
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default AddPlatform;