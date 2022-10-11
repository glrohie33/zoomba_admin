import React, {Fragment, useCallback,  useMemo, useState} from 'react';
import {Button, FormControlLabel, Grid, Modal, Switch, TextField} from "@mui/material";
import ImageSelector from "../imageSelector";
import {buildCustomEvent} from "../../utils/utils";
import {PRODUCTURL} from "../../utils/texthelper";
import {get} from "../../actions/auth";



function AddLinks({formSchema,setData}) {
    const [openModal,setModalStatus] = useState(false);
    const [currentView,setCurrentView] = useState('');
    const handleChecked = (event)=>{
        event.target.value = Boolean(event.target.checked);
        setData(buildCustomEvent(event.target.name,event.target.checked));
    }

    const modalStatus = useMemo(()=>openModal,[openModal])

    const setSelectedItems = (items)=>{
        setData(buildCustomEvent('items',items.map(item=>item.id)));
        setData(buildCustomEvent('itemsPreview',items));
    }

    const views = {
        'files':<ImageSelector inFileType={'image'} currentFiles={('hideImageName' in formSchema)?formSchema.itemsPreview:[]} closeModal={()=>{handleModalChange(false)}} setSelection={(data)=>{setSelectedItems(data)}} multiple={true} />,
        'products':""
    }

    const setModalContent = (view)=>{
        setCurrentView(view);
        handleModalChange(true);
    }

    const addProduct=()=>{
        get(`${PRODUCTURL}?filterBy=sku&filters=${formSchema.sku.join(',')}`)
            .then(resp=>{
               const {status,products} = resp.data;
               if(status){
                   setData(buildCustomEvent('items',products.map(v=>v.id)))
                   setData(buildCustomEvent('itemsPreview',products));
               }
            })
    }

    const setProductItems = ({target})=>{
        const {value,name} = target;
        setData(buildCustomEvent(name,value.split(',')));
    }


    const handleModalChange = useCallback((status)=>{
        setModalStatus(status);
    },[])
    return (
        <Fragment>
            <Grid item sm={12} >
                <TextField name={'title'} onChange={setData} value={formSchema.title} size={'md'} label={'Title'}/>
            </Grid>
            <Grid item sm={12} >
                <TextField name={'subtitle'} onChange={setData} value={formSchema.subtitle} size={'md'} label={'subtitle'}/>
            </Grid>
            <Grid item sm={12} >
                <TextField name={'cols'} onChange={setData} value={formSchema.cols} size={'md'} label={'number of cols'}/>
            </Grid>
            <Grid item sm={12} >
                <TextField name={'colsMobile'} onChange={setData} value={formSchema.colsMobile || 2 } size={'md'} label={'number of cols'}/>
            </Grid>
            <Grid item sm={12} >
                {
                    ('hideImageName' in formSchema) &&
                    <FormControlLabel control={<Switch checked={Boolean(formSchema.hideImageName)} name={'hideImageName'} onChange={handleChecked} />} label="Hide Image Name" />
                }
                <FormControlLabel control={<Switch checked={Boolean(formSchema.isCentered)} name={'isCentered'} onChange={handleChecked} />} label="header Centered" />
            </Grid>
            {
                ('endDate'in formSchema)
                        &&
                    (<Grid item sm={12} >
                        <TextField type={'date'} name={'endDate'} size={'md'} label={'sales end date'}/>
                    </Grid>)
            }

            {
                ('hideImageName' in formSchema) &&

                (
                    <Fragment>
                        <Grid item sm={12}>
                            <Grid container spacing={2}>
                                {
                                    formSchema.itemsPreview
                                        .map((item,index)=>(
                                            <Fragment>
                                                <Grid item sm={4} style={{textAlign:'center'}} key={item.id}>
                                                    <img src={item.url} alt={item.title} style={{width:'100%',height:'100px',objectFit:"contain"}}/>
                                                </Grid>
                                            </Fragment>
                                        ))
                                }
                            </Grid>

                        </Grid>
                        <Grid item sm={12} >
                            <Button variant={'contained'} onClick={()=>{setModalContent('files')}}> Add Images </Button>
                        </Grid>
                    </Fragment>
                )
            }

            {
                (!('hideImageName' in formSchema)) &&
                ((<Fragment>
                        <Grid item sm={12}>
                            <TextField multiline value={formSchema.sku.join(',')} rows={4} onChange={setProductItems} name={'sku'} label={'paste poroduct id'} placeholder={'product unique identifier seperated by comma'} />
                        </Grid>
                    <Grid item sm={12} >
                        <Button variant={'contained'} onClick={addProduct}> Add Products</Button>
                    </Grid>
                </Fragment>
                    ))
            }

            <Modal open={modalStatus} >
               <div className={'modal-body'}>
                   {views[currentView]||''}
               </div>
            </Modal>
        </Fragment>
    );
}

export default AddLinks;