import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {Grid} from "@mui/material";
import {buildCustomEvent, getInputFiles} from "../utils/utils";
import {DEFAULTIMAGE} from "../utils/texthelper";

function ProductImages({ formFields,setFormData}) {
    const initialValues=[{
      image:"",
      imagePreview:""
    },{
        image:"",
        imagePreview:""
    },{
        image:"",
        imagePreview:""
    },{
        image:"",
        imagePreview:""
    },{
        image:"",
        imagePreview:""
    },{
        image:"",
        imagePreview:""
    }]
    const [images,setImages] = useState(initialValues);

    const loadIncomingFile = useCallback(async ()=>{
        const files = await getInputFiles(formFields.images.filter(image=>image!==''));
        const newFiles = [...images];
        files.forEach((file,index)=>{
            newFiles[index] = {image:file.file,imagePreview: file.preview};
        })
        setImages(newFiles);
    },[setImages,formFields.images,images])

    const setUploadedFile = async ({target}, index) => {
        const files = await getInputFiles(target.files);
        const image = files[0]?.file || "";
        const imagePreview = files[0]?.preview || DEFAULTIMAGE;
        const newImages = [...images];
        newImages[index] = {image,imagePreview};
        setImages(newImages);
        const newSelectedImages = newImages.map(image=>image.image);
        setFormData(buildCustomEvent('images',newSelectedImages));
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
                                <img src={image.imagePreview||DEFAULTIMAGE} alt={ `product ${index}`} style={{height:'300px',objectFit:'contain'}}/>
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