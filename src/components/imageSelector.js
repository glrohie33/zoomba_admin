import React, {Fragment, memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Button, Card, Grid, Paper, Tab, Tabs, TextField} from "@mui/material";
import {get, post} from '../actions/auth';
import {MEDIAURL} from "../utils/texthelper";
import {convertToForm, getInputFiles} from "../utils/utils";
import axios from "axios";
function ImageSelector({inFileType='image',currentFiles=[],closeModal,setSelection, multiple=false}) {
    const [files,setLoadedFiles] = useState(currentFiles);
    const [currentTab,setCurrentTab] = useState(1);
    const [uploadedFiles,setUploadedFiles] = useState([]);
    const [selectedFiles,setSelectedFiles] = useState(currentFiles);
    const [currentPage,setCurrentPage] = useState(1);
    const currentImagesId = useMemo(()=>currentFiles.map(file=>(file?.id)),[currentFiles]) ;
    let loadingStatus = useRef(false);
    let loaded = useRef(false);
    let loadEnd = useRef(true);
    const loadFiles = useCallback(
        ()=>{

                get(`${MEDIAURL}?fileType=${inFileType}&currentPage=${currentPage}`)
                    .then(({status,data})=>{
                        if(data.status){
                            const filteredFiles = data.files.filter(file=>(!currentImagesId.includes(file.id)));
                            loadEnd.current = (filteredFiles.length === 0);
                            setLoadedFiles((v)=>{
                                const uniqueFiles = new Set([...v,...filteredFiles]);
                                return [...uniqueFiles];
                            });
                        }
                    })
                    .catch(
                    ).finally(()=>{
                        loadingStatus.current = false;
                    }
                )
            }

    ,[currentImagesId,currentPage,setLoadedFiles,inFileType]);

    function uploadFiles(){
        const requests = uploadedFiles.map(uploadedFile=>{
            const formData = convertToForm(uploadedFile,{file:'','title':'','link':''})
           return  post(MEDIAURL,formData,{
                   'Content-Type': 'multipart/form-data'
               });
        });

        axios.all(requests).then(axios.spread((...allData)=>{
            const successFullUploads = [];

                allData.forEach(({data},index)=>{
                    if(data.uploadStatus){
                        successFullUploads.push(data.file)
                    }
                });
            if(successFullUploads.length){
                const newData = [...successFullUploads,...files,];
                const set = new Set(newData);
                const filteredData = [...set];
                setLoadedFiles(filteredData);
            }
            setCurrentTab(1)
            setUploadedFiles([]);
        }));
    }
    useEffect(()=>{

            loadingStatus.current = true;
            loadFiles()

        return ()=>{
           loaded.current = true;
        }
    },[loadFiles,loaded]);

    const setFilesUpload = async (event) => {
        const files = await getInputFiles(event.target.files);
        const uploaded = files.map(file=>({...file,title:'',link:''}));
        setUploadedFiles(uploaded);
    }

    function setUploadFileData(event, index) {
        const newUpload = [...uploadedFiles];
        newUpload[index][event.target.name] = event.target.value;
        setUploadedFiles(newUpload);
    }

    const  selectFile=(inFile)=>{
        const file = selectedFiles.find(file=>file.id===inFile.id)

        let newFiles = [...selectedFiles];
        if(file){
            newFiles = selectedFiles.filter(file=>file.id!==inFile.id);
        }else{
            if (multiple){
                newFiles.push(inFile);
            }else{
                newFiles = [inFile];
            }
        }

        setSelectedFiles(newFiles)

    }

   const isSelected = (id)=>selectedFiles.find(f=>f.id===id)

    function handleScroll({target}){
            const scrollTop = target.scrollTop;
            const elementHeight = target.clientHeight;
            const element = target.querySelector('.images');
            //if no api call to load is not in progress and
            //and is all data and not yet loaded
            if(!loadingStatus.current && !loadEnd.current){
                if(element){
                    const diff = (element.clientHeight - (scrollTop + elementHeight) );
                    if( diff < 50){
                        setCurrentPage(value=>value+1);
                        loadingStatus.current = true;
                        loaded.current = false;
                    }
                }
            }

    }

    return (
       <Fragment>
           <Card className={'image-selector'}>
               <Grid container className={'image-selector-container'}>
                   <Grid item sm={12} className={'file-selector-tab'}>
                       <Tabs value={currentTab} onChange={(event,newValue)=>{setCurrentTab(newValue)}} >
                           <Tab label="Upload Files"  />
                           <Tab label={`file ${files.length}`}  />
                       </Tabs>
                   </Grid>
                   <Grid onScroll={handleScroll}  item sm={12} className={'item-container'}>
                       <Grid style={{display:(currentTab === 0)?'flex':'none'}} className={'image-container'} container>
                                <Grid item sm={12} className={'file-upload-cover'} >
                                    <label className={'upload-label-cover'}>
                                        <Paper className={'upload-label'}>
                                            Select Image
                                        </Paper>
                                        <input hidden type={'file'} multiple onChange={setFilesUpload}/>
                                    </label>
                                    {
                                        (uploadedFiles.length > 0)
                                        &&
                                        <div className={'upload-button-cover'}>
                                            {`${uploadedFiles.length} selected to upload`}

                                            <Grid container className={'uploads-preview'} spacing={2}>
                                                {
                                                    uploadedFiles.map((file,index)=>(
                                                        <Grid item sm={4} key={index} className={'image-preview-item'}>
                                                            <Paper elevation={2} className={'paper'}>
                                                                <img src={file.preview} alt={file.title} />
                                                                <TextField size={'small'} label={'image title'} name={'title'} value={file.title} onChange={(event)=>{setUploadFileData(event,index)}}/>
                                                                <TextField size={'small'} label={'image link'} name={'link'} value={file.link} onChange={(event)=>{setUploadFileData(event,index)}}/>
                                                            </Paper>
                                                        </Grid>
                                                    ))
                                                }
                                            </Grid>

                                        </div>
                                    }

                                </Grid>
                       </Grid>
                       <Grid  style={{display:(currentTab === 1)?'flex':'none'}} className={'image-container images'} spacing={1} container>

                           {
                               files.map((file,index)=>(
                                   (file) &&
                                   <Grid item sm={3} key={file.id}>
                                       <label>
                                           <Paper elevation={isSelected(file.id)?5:1} onClick={()=>{selectFile(file)}} >
                                               <img  src={file.url} alt={file.name}/>
                                           </Paper>
                                       </label>

                                   </Grid>
                               ))
                           }

                       </Grid>
                   </Grid>
                   <Grid item sm={12} className={'image-selector-action-container'}>
                       <Button variant={'contained'} onClick={closeModal} >Cancel</Button>
                       {(
                           (currentTab === 0) &&<Button variant={'contained'} onClick={uploadFiles} className={'upload-button'}>upload</Button>
                       )
                       }

                       {
                           (currentTab === 1) &&
                           <Fragment>
                               <Button variant={'outlined'} onClick={()=>{setSelection(selectedFiles);closeModal();}}>Select Items</Button>)
                           </Fragment>
                       }

                   </Grid>
               </Grid>
           </Card>
       </Fragment>
    );
}

export default memo(ImageSelector);
