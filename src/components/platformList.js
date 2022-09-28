import React, {memo, useEffect, useState} from 'react';
import {get} from "../actions/auth";
import {PLATFORMlISTURL} from "../utils/texthelper";
import {Grid, Paper} from "@mui/material";

function PlatformList({ formFields,setFormData}) {
    const [data,setData] = useState([])


    const getPlatforms = ()=>{
        get(PLATFORMlISTURL).then((resp)=>{
            const {status,platforms}= resp.data;
            if(status){
                setData(platforms);
            }
        }).catch(e=>{

        });
    }

    useEffect(()=>{
       getPlatforms();
    },[])


    const isSelected = (key)=>(formFields.platform === key);

    return (
        <Grid container spacing={1}>
            {
                data.map(item=>{
                    const selected = isSelected(item.key);
                    return (
                    <Grid item sm={3} key={item.key} className={`${selected?'active':''} product-platform-list`}>
                       <label for={item.key}>
                           <Paper elevation={selected?4:1}  className={'platform-options flex flex-center'} >
                               <h3 >
                                   {item.name}
                               </h3>
                           </Paper>
                       </label>
                        <input hidden value={item.key} name={'platform'} id={item.key} type={'radio'} defaultChecked={setFormData} onClick={setFormData} />
                    </Grid>
                )
                })
            }
        </Grid>
    );
}

export default memo(PlatformList);
