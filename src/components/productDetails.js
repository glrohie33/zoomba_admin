import React, {useEffect, useState, Fragment} from 'react';
import {get} from "../actions/auth";
import {ATTRIBUTElISTURL, BRANDLISTURL, STORELISTURL} from "../utils/texthelper";
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {buildCustomEvent} from "../utils/utils";

function ProductDetails({ formFields,setFormData}) {

    const [brands,setBrands] = useState([]);
    const [attributes,setAttributes] = useState([]);
    const [stores,setStores] = useState([]);
    const [selectedAttributes,setSelectedAttributes] = useState({})

    const getBrands = ()=>{
        get(BRANDLISTURL).then((resp)=>{
            const {status,brands}= resp.data;
            if(status){
                setBrands(brands);
            }
        }).catch(e=>{

        });
    }

    const getStores = ()=>{
        get(STORELISTURL).then((resp)=>{
            const {status,stores}= resp.data;
            if(status){
                setStores(stores);
            }
        }).catch(e=>{

        });
    }

    const setAttributesFields=({target})=>{
        const {name,value} = target;
        const newSelectedAttributes = {...selectedAttributes,[name]:value.split(',')}
        setSelectedAttributes(newSelectedAttributes);
        setFormData(buildCustomEvent('attributes',newSelectedAttributes));
    }


    const getAttributes = ()=>{
        get(ATTRIBUTElISTURL).then((resp)=>{
            const {status,attributes}= resp.data;
            if(status){
                setAttributes(attributes);
            }
        }).catch(e=>{

        });
    }


    useEffect(()=>{
        getBrands();
        getStores();
        getAttributes();
    },[])

    return (
        <Fragment>
            <Grid container >
                <Grid item sm={12}>
                    <TextField value={formFields.name} name={'name'} label={'product name'} onChange={setFormData}/>
                    <FormControl fullWidth >
                        <InputLabel id="store-label">Select Store</InputLabel>
                        <Select
                            labelId={"store-label"}
                            label="Entity"
                            value={formFields.store}
                            onChange={setFormData}
                            name="store"
                        >
                            <MenuItem value={""}> Select Store</MenuItem>
                            {
                                stores.map(store=>
                                    (
                                        <MenuItem value={store.id} key={store.id}>
                                            {store.name}
                                        </MenuItem>
                                    )
                                )
                            }
                        </Select>
                    </FormControl>
                    <FormControl fullWidth >
                        <InputLabel id="brand-label">Select Brand</InputLabel>

                        <Select
                            labelId={"brand-label"}
                            label="Entity"
                            value={formFields.brand}
                            onChange={setFormData}
                            name="brand"
                        >
                            <MenuItem value={""}> Select Store</MenuItem>
                            {
                                brands.map(brand=>
                                    (
                                        <MenuItem value={brand.id} key={brand.id}>
                                            {brand.name}
                                        </MenuItem>
                                    )
                                )
                            }
                        </Select>
                    </FormControl>
                    <TextField value={formFields.weight} name={'weight'} label={'weight'} onChange={setFormData}/>
                    <TextField value={formFields.modelNumber} name={'modelNumber'} label={'model number'} onChange={setFormData}/>
                    <TextField value={formFields.sku} name={'sku'} label={'sku'} onChange={setFormData}/>
                    <TextField value={formFields.unit} name={'unit'} label={'unit'} onChange={setFormData}/>
                    <TextField multiline  rows={4} name="description" label={'description'} value={formFields.description} onChange={setFormData} />
                    <TextField multiline  rows={4} name="features" label={'features'} value={formFields.features} onChange={setFormData} />
                    <TextField multiline  rows={4} name="tags" label={'tags'} value={formFields.tags} onChange={setFormData} />
                    {
                        attributes.map(attribute=>(
                            <TextField key={attribute.id} value={formFields.attributes[attribute.name]?.join(",")||""} name={attribute.name} label={ attribute.name} onChange={setAttributesFields} />
                        ))
                    }
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default ProductDetails;