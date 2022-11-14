import React, {useState, Fragment} from 'react';
import {Button, Checkbox, FormControlLabel, Grid, Paper, TextField} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {buildCustomEvent} from "../utils/utils";

function AddPrice({formFields,setFormData}) {
    const [attributes,setAttributes] = useState([]);
    const [variations,addVariations] = useState([]);
    const setSelectedAttributes = ({target})=>{
        const {name,value,checked} = target;
        let newAttributes = [];
        if(checked){
            newAttributes = [...attributes];
           newAttributes.push({name,value:value.split(",")});
        }else{
           newAttributes = attributes.filter(attr=>attr.name !== name);
        }

        setAttributes(newAttributes);
    }

    const buildVariations = (object,index,data,result)=>{

        let i = 0;
        const {name,value} = data[index];
        while(i < value.length){
            const newObject = {...object};
            newObject[name] = value[i];
            var nextIndex = index+1;
            if(nextIndex === data.length){
                result.push(newObject);
            }else{
              result = buildVariations(newObject,nextIndex,data,result);
            }
            i++;
        }

        return result;
    }

    const setVariations = ()=>{
       const result = buildVariations({purchasePrice:0,salesPrice:0,quantity:0,vat:0},0,attributes,[]);
        addVariations(result);
        addVariationToProduct(result);
    }

    const removeVariant=(index)=>{
        const newVariations = variations.filter((v,i)=>i!==index);
        addVariations(newVariations);
        addVariationToProduct(newVariations);
    }

    const setVariationData=({target:{name,value}},index)=>{
        const newVariations = [...variations];
        newVariations[index][name] = value;
        addVariations(newVariations);
        addVariationToProduct(newVariations);
    }

    const addVariationToProduct = (newVariations)=>{
        setFormData(buildCustomEvent('variations',newVariations));
    }


    return (
        <Fragment>
            <Grid container spacing={1}>
                <Grid item sm={12}>
                    <Grid container>
                        <Grid item sm={12}>
                            {
                                Object.keys(formFields.attributes)
                                    .map((key,index)=>{
                                        const value = formFields.attributes[key];
                                        return <FormControlLabel control={
                                            <Checkbox value={value} name={key} onChange={setSelectedAttributes} />
                                        } label={key} key={index}/>

                                    })
                            }
                        </Grid>
                        <Grid item sm={12}>
                            <Button onClick={setVariations} variant={'contained'} >Set Attributes Options</Button>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid item sm={12}>

                        {
                            (variations.length < 1 )?(
                                <Fragment>
                                    <Paper elevation={2} className={'price-container'}>
                                        <Grid container spacing={2}>
                                            <Grid className={'flex flex-center'} item={3}>
                                                <TextField value={formFields.purchasePrice} onChange={setFormData} className={'price-items'} name={'purchasePrice'} label={'price'}/>
                                            </Grid>
                                            <Grid className={'flex flex-center'} item={3}>
                                                <TextField value={formFields.salePrice} onChange={setFormData} className={'price-items'} name={'salesPrice'} label={'Sale Price'}/>
                                            </Grid>
                                            <Grid className={'flex flex-center'} item={3}>
                                                <TextField value={formFields.quantity}  className={'price-items'} onChange={setFormData} name={'quantity'} label={'Quantity'}/>
                                            </Grid>
                                            <Grid className={'flex flex-center'} item={3}>
                                                <TextField value={formFields.vat}  className={'price-items'} onChange={setFormData} name={'vat'} label={'VAT'}/>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Fragment>
                                )
                               :(
                                   <Fragment>
                                       {
                                           variations.map((variation,index)=>(
                                               <Paper elevation={2} className={'price-container'} key={index}>
                                                   <Grid container >
                                                       <Grid item sm={4}>
                                                           <ul>
                                                               {
                                                                   Object.keys(variation)
                                                                       .map((key,index)=>(
                                                                           <li key={key}>{key} : {variation[key]} </li>
                                                                       ))
                                                               }
                                                           </ul>

                                                       </Grid>
                                                       <Grid item className={'flex flex-center'} sm={2}>
                                                           <TextField className={'price-items'} onChange={(event)=>{setVariationData(event,index)}} value={variations[index]['purchasePrice']} name={'purchasePrice'} label={'price'}/>
                                                       </Grid>
                                                       <Grid item className={'flex flex-center'} sm={2}>
                                                           <TextField className={'price-items'} onChange={(event)=>{setVariationData(event,index)}} value={variations[index]['salesPrice']} name={'salesPrice'} label={'Sale Price'}/>
                                                       </Grid>
                                                       <Grid item className={'flex flex-center'} sm={2}>
                                                           <TextField className={'price-items'} onChange={(event)=>{setVariationData(event,index)}} value={variations[index]['quantity']} name={'quantity'} label={'Quantity'}/>
                                                       </Grid>
                                                       <Grid className={'flex flex-center'} item={3}>
                                                           <TextField className={'price-items'} onChange={(event)=>{setVariationData(event,index)}} value={variations[index]['vat']} name={'vat'} label={'VAT'}/>
                                                       </Grid>
                                                       <Grid className={'flex flex-center'} item sm={2}>
                                                           <Button className={'price-items'} variant={'contained'}><Delete onClick={()=>removeVariant(index)}></Delete></Button>
                                                       </Grid>
                                                   </Grid>
                                               </Paper>
                                           ))
                                       }
                                   </Fragment>
                                )


                        }


                </Grid>
            </Grid>
        </Fragment>
    );
}

export default AddPrice;