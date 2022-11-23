import React, {useCallback, useEffect, useState, Fragment, memo} from 'react';
import {get} from "../actions/auth";
import {CATEGORYLISTURL} from "../utils/texthelper";
import {Card, Grid, Paper} from "@mui/material";
import {buildCustomEvent} from "../utils/utils";
import {useParams} from "react-router-dom";



function SelectCategory({ formFields,setFormData}) {

    const [data,setData] = useState([ ]);
    const [currentCategory,setCurrentCategory] = useState("");
    const [selectedCategories,setSelectedCategories] = useState(formFields.categories);
    const {id} = useParams();
    const loadIncomingCategories = useCallback(()=>{
        if (!currentCategory) {
            selectedCategories.forEach(category => {
                setCurrentCategory(category);
            });
        }
    },[currentCategory,setCurrentCategory,selectedCategories])


    const getCategories =useCallback(()=>{

        get(`${CATEGORYLISTURL}?parent=${currentCategory}&children=true`,{
            headers: {platform:formFields.platform}
        }).then((resp)=>{
            const {status,categories}= resp.data;
            if(status){


                const newData = [...data];
                if(categories.length > 0){
                    newData.push(categories);
                    sessionStorage.setItem('loadedCategories',JSON.stringify(newData));
                }

                setData(newData);
            }

                //if we are editing and current category is emtpy;
                if(id && !currentCategory){
                    loadIncomingCategories();
                }

        }).catch(e=>{

        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[currentCategory,id,formFields,loadIncomingCategories]);

    const categorySelected = (event,index)=>{
        const value = event.target.value;
        if(!isSelected(value)){
            const newArray = [...selectedCategories];
            const newData = [...data];
            console.log(newData);
            if(selectedCategories.length > 0 ){
                newArray.splice(index);
                newData.splice(index+1);
            }
            console.log(newData);
            newArray.push(value);
            setSelectedCategories(newArray);
            setData(newData);
            setCurrentCategory(value);
            getCategories(value);
            setFormData(buildCustomEvent('categories',newArray));
        }

    }


    useEffect(()=>{
        const previousPlatform = sessionStorage.getItem('productPlatform');
        const initialData = JSON.parse(sessionStorage.getItem('loadedCategories')) || [];
        if (previousPlatform !== formFields.platform || !initialData.length ){
            sessionStorage.setItem('productPlatform',formFields.platform)

            getCategories();
        }else{
            if(currentCategory){
                getCategories();
            }else{
                setData(initialData);
            }

        }
    },[currentCategory,formFields.platform,getCategories,setData])

    useEffect(()=>{
        const element = document.querySelector(`.category-list-container`);
        const currentElement = document.querySelector(`.category-list-cover${data.length-1}`);
        if(element&&currentElement){
            element.scrollLeft = (currentElement.offsetLeft + currentElement.clientWidth);
        }

    },[data])

    const isSelected = (id)=>(formFields.categories.includes(id));
    return (
        <Fragment>
            <Grid container>
                <Grid item sm={12}>
                    <div className={'category-list-container'}>
                        {
                            data.map((v,index)=>(
                                <Card key={index} className={`category-list-cover category-list-cover${index}`}>
                                    {
                                        v.map(v=>(
                                            <Paper key={v.id} elevation={isSelected(v.id)?4:1} className={`category-list-item`}>
                                                <label for={`categoryIndex${v.id}`}>
                                                    {v.name}
                                                </label>
                                                <input hidden type={'radio'} name={`category${index}`} id={`categoryIndex${v.id}`} value={v.id} onClick ={(event)=>{categorySelected(event,index)}} />
                                            </Paper>
                                        ))
                                    }
                                </Card>
                            ))
                        }
                    </div>

                </Grid>
            </Grid>
        </Fragment>
    );
}

export default memo(SelectCategory);
