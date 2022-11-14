import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {Grid} from "@mui/material";
import {buildCustomEvent, readFile} from "../utils/utils";
import {DEFAULTIMAGE} from "../utils/texthelper";
function ProductImages({ formFields,setFormData}) {

    const [images,setImages] = useState([]);

    const loadIncomingFile = useCallback(async ()=>{
        const allFiles =  formFields.images.map((image)=>{
            if (image && typeof image !== 'string'){
                return readFile(image);
            }else{
                return new Promise((resolve)=>{
                    resolve({image,preview:image});
                })
            }
        })
        const newFiles = await Promise.all(allFiles);
        setImages(newFiles);

    },[setImages,formFields.images])

    const setUploadedFile = async ({target}, index) => {
        const newImages = [...formFields.images]
        newImages[index] = target.files[0] || "";
        setFormData(buildCustomEvent('images', newImages));
    }

    useEffect(()=>{
        loadIncomingFile();
    },[loadIncomingFile])
    return (
        <Fragment>
            <Grid container spacing={3}>
                {
                    images.map((image,index)=>(
                        <Grid item sm={4} key={index} >
                            <label className={'product-images-label'}>
                                <img src={image.preview||DEFAULTIMAGE} alt={ `product ${index}`} style={{height:'300px',width:'100%',objectFit:'contain'}}/>
                                <input type='file' name={`file${index}`}  onChange={(event)=>{setUploadedFile(event,index)}} />
                            </label>
                        </Grid>
                    ))
                }
            </Grid>
        </Fragment>
    );
}

export default ProductImages;