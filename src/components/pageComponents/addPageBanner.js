import React, {useCallback, useMemo, useState,useRef} from 'react';
import {Button, Grid, Modal} from "@mui/material";
import ImageSelector from "../imageSelector";
import {buildCustomEvent} from "../../utils/utils";

function AddPageBanner({images,setData}) {
    console.log(images);
    const [openModal,setModalStatus] = useState(false);
    const modalStatus = useMemo(()=>openModal,[openModal])
    const [currentView,setCurrentView] = useState('');
    const [selectedImages,setSelectedImages] = useState([]);
    const bannerType = useRef('');
    const handleModalChange = useCallback((status)=>{
        setModalStatus(status);
    },[])
    const views = {
        'files':<ImageSelector inFileType={'image'} currentFiles={selectedImages} closeModal={()=>{handleModalChange(false)}} setSelection={(data)=>{setSelectedItems(data)}}/>,
        'products':""
    }
    const setModalContent = (view)=>{
        setCurrentView(view);
        handleModalChange(true);
    }

    const addNewItems = (content)=>{
        const selectedImages = (images)?images[content]:[];
        bannerType.current = content;
        setSelectedImages(selectedImages||[]);
        setModalContent('files');
    }

    const setSelectedItems = (items)=>{
        const banners = {...images,[bannerType.current]:items};
        setData(buildCustomEvent('pageBanners',banners));
    }


    return (
        <Grid  item={12} className={'addPageBanners'}>
            <Grid container>
               <Grid item sm={12}>
                   <h2>Sliders</h2>
                   <Grid container>
                       {
                           images?.sliders?.map(item=>(
                               <Grid item sm={4} style={{textAlign:'center'}}>
                                   <img src={item.url} alt={item?.title} style={{width:'100%',height:'100px',objectFit:"contain"}}/>
                               </Grid>
                           ))
                       }
                   </Grid>
                   <Button variant={'contained'} onClick={()=>{addNewItems('sliders')}}>Add Sliders</Button>
               </Grid>

                <Grid item sm={12}>
                    <h2>Side Banners</h2>
                    <Grid container>
                        {
                            images?.sideBanners?.map(item=>(
                                <Grid item sm={4} style={{textAlign:'center'}}>
                                    <img src={item.url} alt={item.title} style={{width:'100%',height:'100px',objectFit:"contain"}}/>
                                </Grid>
                            ))
                        }
                    </Grid>
                    <Button variant={'contained'} onClick={()=>{addNewItems('sideBanners')}}>Add Banners</Button>
                </Grid>
            </Grid>

            <Modal open={modalStatus} >
                <div className={'modal-body'}>
                    {views[currentView]||''}
                </div>
            </Modal>
        </Grid>
    );
}

export default AddPageBanner;