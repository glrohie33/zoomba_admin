import React, {useEffect, useState, Fragment, useCallback} from 'react';
import {get, post} from "../../actions/auth";
import {
    ATTRIBUTElISTURL,
    AUTHALERTNAME,
    CATEGORYLISTURL, DEFAULTIMAGE,
    ERRORALERT,
    PLATFORMlISTURL,
    SUCCESSALERT
} from "../../utils/texthelper";
import {Autocomplete, Button, Card, Checkbox, Grid, TextField} from "@mui/material";
import Displayalerts from "../../components/displayalerts";
import {addAlert} from "../../store/reducers/alertSlice";
import {useDispatch} from "react-redux";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {buildCustomEvent} from "../../utils/utils";
import modal from "../../components/HOC/modal";
import ImageSelector from "../../components/imageSelector";
import {useParams} from "react-router-dom";

const ImageModal = modal(ImageSelector);
function AddCategory(props) {
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    const [categories,setCategories] = useState([]);
    const [platforms,setPlatforms] = useState([]);
    const [attributes,setAttributes] = useState([]);
    const [modalStatus,setModalStatus] = useState(false);
    const [modalOptions,setModalOptions] = useState({
        currentFiles:[],
        setSelection:setImage
    })
    const {id} = useParams();
    const dispatch = useDispatch();
    const initialState ={
        name:"",
            parent:"",
            image:"",
            imagePreview:"",
            title:"",
            tags:[],
            attributes:[],
            platforms:[],
    }
    const[formFields,setFormField] = useState(initialState)

    const getCategories = useCallback(()=>{
        get(CATEGORYLISTURL).then(({data})=>{
            const {status,categories} = data;
            if(status){
                setCategories(categories);
            }
        })
            .catch(e=>{
                console.log(e.message);
            })
    },[setCategories])


    const getPlatforms = useCallback(()=>{
        get(PLATFORMlISTURL ).then(({data})=>{
            const {status,platforms} = data;
            if(status){
                setPlatforms(platforms);
            }
        })
            .catch(e=>{
                console.log(e.message);
            })
    },[setPlatforms])

    const getAttributes = useCallback(()=>{
        get(ATTRIBUTElISTURL).then(({data})=>{
            const {status,attributes} = data;
            if(status){
                setAttributes(attributes);
            }
        })
            .catch(e=>{
                console.log(e.message);
            })
    },[setAttributes])

    const getCategory = useCallback(()=>{
        get(`${CATEGORYLISTURL}/${id}`)
            .then(({data})=>{
                const {status,category} = data;
                if (status){
                  const newCategory  = Object.assign(initialState,category);
                  setFormField(newCategory);
                }
            }).catch(e=>{console.log(e)})
    },[id])

    useEffect(()=>{
        getCategories();
        getPlatforms();
        getAttributes();
        if (id){
            getCategory();
        }

        // return()=>{
        //     abortController.abort();
        // }
    },[getAttributes,getCategories,getPlatforms]);

    function setFieldData(event){
        setFormField(v=>({...v,[event.target.name]:event.target.value}))
    }

    function setSelectedPlatforms(event,values){
        const selectedPlatforms = values.map(value=>value.key);
        setFieldData(buildCustomEvent('platforms',selectedPlatforms));
    }

    function setSelectedAttributes(event,values){
        const selectedAttributes = values.map(value=>value['_id']);
        setFieldData(buildCustomEvent('attributes',selectedAttributes));
    }

    function setSelectedCategory(event,value){
    setFieldData(buildCustomEvent('parent',value.id));
    }

    function setTags({target}){
        var tags = target.value.split(",");
        setFormField(v=>({...v,tags}))
    }

    function handleSubmit(){
        const data = {...formFields};
         data.image = formFields.image.id;
        post(CATEGORYLISTURL,data,)
            .then(e=>{
                const data = e.data;
                if(data.status){
                    dispatch(addAlert({
                        name: AUTHALERTNAME,
                        message:'Registration Successfull',
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

    async function setImage(files) {
        const file = files[0] || "";
        setFormField(v=>({...v,image:file}));
        setModalStatus(false);
    }

    function selectImage(name,currentFiles){
            setModalOptions((v)=>({ ...v, name,currentFiles}));
            setModalStatus(true);
    }

    return (
        <Fragment>
            <Grid container className={'registration-container'}>
                <Grid item className={['flex','flex-center','margin-top-bottom']} sm={12}>
                    <Displayalerts name={AUTHALERTNAME}></Displayalerts>
                </Grid>
                <Grid item className={['flex','flex-center','margin-top-10']} sm={12}>
                    <Card className={['registration-form-card','text-center']}>

                        <TextField name='name' value={formFields.name} label="name" onChange={setFieldData }/>
                        <TextField name='title' value={formFields.title} label="title" onChange={setFieldData }/>
                        <Autocomplete
                            options={categories}
                            value={categories.find( v => v.id === formFields.parent)}
                            getOptionLabel={options=>options.name}
                            onChange={setSelectedCategory}
                            renderInput={(params) => <TextField {...params} label="Parent Category" />}
                        />
                        <Autocomplete
                        multiple
                        options={platforms}
                        defaultValue={[]}
                        value={platforms.filter(v=>formFields.platforms.includes(v.key))}
                        getOptionLabel={options=>options.name}

                        onChange={setSelectedPlatforms}
                            renderOption={
                            (props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}

                                    />
                                    {option.name}
                                </li>
                            )
                        }
                        renderInput={(params) => <TextField {...params} label="Platforms" />}
                        />
                        <Autocomplete
                            multiple
                            options={attributes}
                            getOptionLabel={options=>options.name}
                            onChange={setSelectedAttributes}
                            value={attributes.filter(v=>formFields.attributes.includes(v.id))}
                            filterSelectedOptions
                            renderInput={(params) => <TextField {...params} label="Select Attributes" />}
                        />
                        <TextField value={formFields.tags.join(',')}  name='tags' label="tags" onChange={setTags}/>
                      <Button  variant={'contained'} onClick={()=>{selectImage('image',[formFields.image])}} >Select Image</Button>
                        <Card>
                            <img
                                style={{height:143,objectFit:'contain'}}
                                src={formFields.image?.url || DEFAULTIMAGE}
                                alt="category"
                            />
                        </Card>
                        <Button onClick={handleSubmit} style={{display:'block',width:'100%',margin: '10px 0px'}} variant="contained" size="large">Create Category</Button>
                    </Card>
                </Grid>
            </Grid>
            <ImageModal open={modalStatus}  closeModal={()=>{setModalStatus(false)}} {...modalOptions}/>
        </Fragment>
    );
}

export default AddCategory;