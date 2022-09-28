import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {get, post} from "../../actions/auth";
import {
    AUTHALERTNAME, BRANDLISTURL,
    DEFAULTIMAGE,
    ERRORALERT, STORELISTURL,
    SUCCESSALERT
} from "../../utils/texthelper";
import {addAlert} from "../../store/reducers/alertSlice";
import {Autocomplete, Button, Card, Grid, TextField} from "@mui/material";
import Displayalerts from "../../components/displayalerts";
import {buildCustomEvent, convertToForm, getInputFiles} from "../../utils/utils";

function AddBrand(props) {
    const dispatch = useDispatch();

    const [open,setOpen] = useState(false);
    const formSchema = {
        name:"",
        image:"",
        officialStore: "",
    }
    const initialState ={
        name:"",
        image:"",
        officialStore: "",
        imagePreview: ""
    }

    const [stores,setStores] = useState([]);
    const[formFields,setFormField] = useState(initialState)

    function setFieldData(event){
        setFormField(v=>({...v,[event.target.name]:event.target.value}))
    }

    function setSelectedStore(event,value){
        setFieldData(buildCustomEvent('officialStore',value.id));
    }

    function handleSubmit(){
        const formData = convertToForm(formFields,formSchema);
        post(BRANDLISTURL,formData,{
            'Content-Type': 'multipart/form-data'
        })
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
    async function setImage({target}) {

        const files = await getInputFiles(target.files);
        const file = files[0]?.file || "";
        const filePreviews = files[0]?.preview || DEFAULTIMAGE;
        setFormField(v=>({...v,image:file,imagePreview:filePreviews}));
    }

    const findStore = async (value) => {

        const resp = await get(`${STORELISTURL}/?search=${value}`).catch(e => {

        });
        const {status, stores} = resp.data;
        if (status) {
            return setStores(stores);
        }else{
            return [];
        }
    }

    useEffect(()=>{
        if(open){
            findStore("");
        }else {
            setStores([]);
        }
    },[open])
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
                                <Autocomplete
                                    filterOptions={(x) => { console.log(x); return x}}
                                    onOpen={()=>{setOpen(true)}}
                                    onClose={()=>{setOpen(false)}}
                                    options={stores}
                                    getOptionLabel={options=>options.name}
                                    onChange={setSelectedStore}
                                    renderInput={(params) => <TextField {...params} onChange={(event)=>findStore
                                    (event.target.value)} label="Official Stores" />}
                                />
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

export default AddBrand;