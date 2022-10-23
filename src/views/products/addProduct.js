import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {Button, Grid, Step, StepLabel, Stepper} from "@mui/material";
import PlatformList from "../../components/platformList";
import Displayalerts from "../../components/displayalerts";
import {AUTHALERTNAME, ERRORALERT, PRODUCTURL, SUCCESSALERT} from "../../utils/texthelper";
import {useDispatch} from "react-redux";
import {addAlert} from "../../store/reducers/alertSlice";
import SelectCategory from "../../components/selectCategory";
import ProductDetails from "../../components/productDetails";
import ProductImages from "../../components/productImages";
import AddPrice from "../../components/addPrice";
import {get, post} from "../../actions/auth";
import {convertToForm} from "../../utils/utils";
import {useParams} from "react-router-dom";
const imagesInit = Array(6).fill('');
function AddProduct(props) {
    const {id} = useParams();
    const initialState = {
        platform:"",
        name:"",
        images:imagesInit,
        categories:[],
        brand:"",
        description:"",
        productAttributes:{
        },
        productWeight:0,
        store:"",
        productPurchasePrice:"",
        discount:"",
        vat:"",
        sku:"",
        modelNumber:"",
        price:"",
        unit:"",
        salePrice:"",
        productQuantity:"",
        features:"",
        productVariations:[],
        tags:""
    }
    const [formFields,setFormFields] = useState(initialState);
    const [activeStep,setActiveStep] = useState(0);
    const [activeView,setActiveView] = useState(0);
    const dispatch = useDispatch();
    const setFormData = useCallback(({target})=>{
        const {name,value} = target;
        setFormFields(v=>({...v,[name]:value}));
    },[]);
    const steps = [
        {
            label: 'Select Platform',
            component: <PlatformList formFields={formFields} setFormData={setFormData}/>,
            validations:{
                platform:['required']
            }
        },
        {
            label:'Select Category',
            component: <SelectCategory formFields={formFields} setFormData={setFormData} />,
            validations: {
                'categories':['required']
    }
        },
        {
            label:'Add Product Details',
            component:<ProductDetails formFields={formFields} setFormData={setFormData}/>,
            validations: {
                sku:['required'],
                modelNumber:['required'],
                brand:['required'],
                productWeight:['required','isNumber','min:1'],
                descriptions:['required'],
                features:['required'],
                store:['required'],
                unit:['required'],
                tags:['required'],
            },
        },
        {
            label:'Add Product Images',
            component:<ProductImages formFields={formFields} setFormData={setFormData}/>,
            validations:{
                images:(field,resp)=>{
                    if(field.length === 0){
                    resp.status = false;
                   resp.errors.push('product images are required');
                    }

                    if(!Boolean(field[0])){
                        resp.status = false;
                        resp.errors.push('First image is required as featured image');
                    }
                }
            },
        },
        {
            label:'Add Prices',
            component:<AddPrice formFields={formFields} setFormData={setFormData}/>,
            validations: (formFields,resp)=>{
                const {productPurchasePrice,productVariations} = formFields;
                if(productVariations.length > 0){
                        productVariations.forEach((variation, index)=>{
                            if(variation.productPurchasePrice === 0){
                             resp.status = false;
                             resp.errors.push(`please enter purchase price for variation number ${index+1}  for all variations or delete them`);
                            }
                        })
                }else{
                    if(productPurchasePrice === 0){
                        resp.status = false;
                        resp.errors.push('Please enter purchase price');
                    }
                }
        }

        },
    ];

    const next = ()=>{
        const currentStep = steps[activeStep];
        let resp = {
            status:true,
            errors:[]
        }
        if('validations' in currentStep){
            console.log('in here');
            resp = validate(formFields,currentStep.validations)
        }


        if(resp.status && activeStep < steps.length){
            setActiveStep(v=> (v+1));
            if(steps[activeStep+1]){
                setActiveView(v=>v+1);
            }
        }else{
            dispatch(addAlert({name:AUTHALERTNAME,message:resp.errors}));
        }

    }

   const back = ()=>{
        if(activeStep >0){

            if(steps[activeStep]){
                setActiveView(v=>(v-1));
            }
            setActiveStep(v=> (v-1));
        }
    }

    const validate = (object,validatorSchema)=>{
        const resp = {
            status:true,
            errors:[],
        };
        if(typeof validatorSchema == 'function'){
            validatorSchema(object,resp);
        }else{
            const keys = Object.keys(validatorSchema);
            keys.forEach((key)=>{
                const rules = validatorSchema[key];
                if(typeof rules === 'function'){
                    rules(object[key],resp);
                }else{
                    if(rules.includes('required')){
                        if( (key in object) && object[key].length === 0){
                            resp.errors.push(`${key} is required`);
                            resp.status = false;
                        }
                    }
                }

            })
        }


        return resp;
    }

    const uploadProduct = ()=>{
        const form = {...formFields};
        form.productAttributes = JSON.stringify(formFields.productAttributes);
        form.productVariations = JSON.stringify(formFields.productVariations);
        form.deletedImages = [];
        const productImages = formFields.productImages || [];
        productImages.forEach(img=>{
                if (!formFields.images.includes(img.url)){
                    form.deletedImages.push(img.url);
                }
        });
        form.images =formFields.images.filter(img=> (img) && typeof img != 'string' );
        const formData = convertToForm(form);
        let params = "";
        if(id){
            params = `/${id}`;
        }
        post(PRODUCTURL+params,formData,{
            'Content-Type': 'multipart/form-data'
        }).then(resp=>{
            dispatch(addAlert({
                name: AUTHALERTNAME,
                message: (id)?'Product Updated Successfully':'Product Upload Successful',
                status:SUCCESSALERT
            }));
            if (!id){
                setFormFields(initialState);
            }
            setActiveStep(0);
            setActiveView(0);
        }).catch(e=>{
            const data = e.response.data
            dispatch(addAlert({
                name:AUTHALERTNAME,
                message:data.message,
                status:ERRORALERT
            }));
        });
    }

    const getProduct = useCallback((id)=>{
            get(`${PRODUCTURL}/${id}`).then(resp=>{
                const {status,product} = resp.data;
                if (status){
                    const {productImages,categories,brand,purchasePrice,quantity,variations,tags,mainImage} = product;

                    product.images = imagesInit;
                    productImages.forEach((img,index)=>{
                             if (img.url  === mainImage){
                                 product.images.unshift(img.url);
                                 product.images.pop();
                             }else{
                                product.images[index] = img.url;
                             }
                    });

                    product.categories = categories.map(cat=>cat.id);
                    product.brand = brand.id;
                    product.productPurchasePrice = purchasePrice;
                    product.productQuantity = quantity;
                    product.productVariations = variations;
                    product.categories = categories.map(category=>category.id);
                    product.tags = tags.join('');
                    setFormFields(v=>{
                        const newForms = Object.assign(v,product);
                        return newForms;
                    });
                }

            }).catch(e=>{
                console.log(e);
            });
    },[]);

useEffect(()=>{
    if (id){
        getProduct(id);
    }
},[id,getProduct])

    useEffect(()=>{
        sessionStorage.removeItem('loadedCategories');
        sessionStorage.setItem('platform','');
    },[])
    return (
        <Fragment>
            <Displayalerts name={AUTHALERTNAME}>
            </Displayalerts>
            <Grid container className="add-product-container " >
                <Grid item sm={12} className={"add-product-stepper"}>
                    <Stepper activeStep={activeStep}>
                        {
                            steps.map((step,index)=>{
                                return (
                                    <Step key={index}>
                                        <StepLabel>
                                            {step.label}
                                        </StepLabel>
                                    </Step>
                                )
                            })
                        }
                    </Stepper>
                </Grid>
                <Grid item sm={12} className={"product-form-view"}>
                    {steps[activeView]['component']}
                </Grid>
                <Grid item sm={12} className={"product-form-navigator"}>
                    <Button  onClick={()=>{back()}} variant={"contained"} size={"large"}>
                       Back
                    </Button>
                    {
                        (activeStep<steps.length)&&
                        <Button  onClick={()=>{next()}} variant={"contained"} size={"large"}>
                            Next
                        </Button>
                    }
                    {
                        (activeStep===steps.length)&&
                        <Button  onClick={()=>{uploadProduct()}} variant={"contained"} size={"large"}>
                          upload Product
                        </Button>
                    }

                </Grid>
            </Grid>
        </Fragment>
    );
}

export default AddProduct;