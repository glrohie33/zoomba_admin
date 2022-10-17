import React, {useCallback, useEffect, useState, Fragment, memo, useRef} from 'react';
import {get} from "../actions/auth";
import {CATEGORYLISTURL} from "../utils/texthelper";
import {Card, Grid, Paper} from "@mui/material";
import {buildCustomEvent} from "../utils/utils";



function SelectCategory({ formFields,setFormData}) {

    const [data,setData] = useState([ ]);
    const [currentCategory,setCurrentCategory] = useState("");
    const selectedCategories = useRef(formFields.categories);
    const platform = useRef("");
    const loadIncomingCategories = useCallback(()=>{
        if (!currentCategory) {
            selectedCategories.current.forEach(category => {
                setCurrentCategory(category);
            });
        }
    },[currentCategory,setCurrentCategory])

    const getCategories =useCallback(()=>{
        get(`${CATEGORYLISTURL}?parent=${currentCategory}&children=true`,{
            headers: {platform:formFields.platform}
        }).then((resp)=>{
            const {status,categories}= resp.data;
            if(status){
                if(categories.length > 0){
                    // const newData = [...data,categories];
                    setData(data =>{
                        const newData = [...data,categories];
                        sessionStorage.setItem('loadedCategories',JSON.stringify(newData))
                      return newData;
                    } );

                }
            }
                loadIncomingCategories();
        }).catch(e=>{

        });
    },[currentCategory,formFields,loadIncomingCategories]);

    const categorySelected = (event,index)=>{
        const value = event.target.value;
        if(!isSelected(value)){
            const newArray = [...selectedCategories.current];
            const newData = [...data];
            if(selectedCategories.current.length > 0 ){
                newArray.splice(index);
                newData.splice(index+1);
            }
            newArray.push(value);
            selectedCategories.current = newArray;
            setData(newData);
            setCurrentCategory(value);
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
            setData(initialData);
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
                        {platform.current}
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