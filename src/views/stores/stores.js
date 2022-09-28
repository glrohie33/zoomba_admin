import React, {Fragment, useCallback, useEffect, useMemo, useState} from 'react';
import {Box, Button, Card, CardHeader, Grid, Modal, Switch} from "@mui/material";
import {Close, Delete, Visibility} from "@mui/icons-material";
import {get, post} from "../../actions/auth";
import {STORELISTURL, VERIFYSTOREURL} from "../../utils/texthelper";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import {Link} from "react-router-dom";

function Stores(props) {
    const initialState = {
        "name": "",
        "address": "",
        "phone": "",
        "verified": true,
        "user": "",
        "entity": "",
        "accountManager": "",
        "additionalPhone": "",
        "email": "",
        "createdAt": "",
    };
    const [viewStoreData,setViewStoreData] = useState(initialState);
    const [openModal,setModalStatus] = useState(false);
    const [data,setData] = useState([]);

    const changeStatus = useCallback(({target},id)=>{
        const selectedData = data.find(d=>d.id === id);
        const index = data.findIndex(d=>d.id === id);
        const verifyStatus = target.checked;
        if(selectedData){
            post(VERIFYSTOREURL,{id,verifyStatus}).then(({data})=>{
                    const {status} = data;
                    if(status){
                        selectedData.verified= verifyStatus;
                        const newData = [...data];
                        newData[index] = selectedData;
                        setData(v=>(newData));
                    }
                }
            ).catch(e=>{

            })

        }

    },[data]);
    const setViewData= useCallback( (id)=>()=>{
        const viewData = data.find(d=>d.id === id);
        if(viewData){
            setViewStoreData(v=>viewData);
            setModalStatus(true);
        }
    },[data]);

    const columns = useMemo(()=>[
        {
            field:'name',
            flex:1
        },
        {
            field:'phone',
            headerName:'Phone',
            flex: 1
        },
        {
            field:'email',
            headerName: 'Email',
            flex:1,
        },
        {
            field:"verified",
            headerName: "Verified",
            flex: 1,
            renderCell:(prop)=>{
                const {value,id} = prop;
                return <Switch
                checked={value}
                onChange={(event)=>{
                    changeStatus(event,id);
                }

                }
                inputProps={{'arial-label':'controlled'}}
                />
            }
        },
        {
            field: 'actions',
            type: 'actions',
            getActions:({id})=>[
                <GridActionsCellItem
                    icon={<Visibility/>}
                    label="view"
                    onClick={setViewData(id)}
                />,
                <GridActionsCellItem
                    icon={<Delete/>}
                    label="Delete"
            />
            ]
        }
    ],[setViewData,changeStatus]);


    useEffect(()=>{
        get(STORELISTURL).then((resp)=>{
            const {status,stores}= resp.data;
            if(status){
                setData(stores);
            }
        }).catch(e=>{

        });
    },[]);

    return (
        <Fragment >
            <Grid container>
                <Grid sm={12}>
                    <h3>Stores</h3>
                </Grid>
                <Grid item sm={12}>
                    <div>
                        <Link to={'/stores/add'}>
                            <Button variant={'contained'}>Add New</Button>
                        </Link>
                    </div>
                </Grid>
                <Grid sm={12}>
                    <DataGrid columns={columns} rows={data} style={{ height: 300, width: '100%' }}></DataGrid>

                </Grid>
            </Grid>
            <Modal
                open={openModal}
                onClose={()=>{setModalStatus(false)}}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sm={{width:'100%'}} className={['flex','flex-center']}>
                    <Card sx={{ width: 600,margin:'0px auto'}}   className={['viewModalCard']} >
                        <CardHeader
                        action={
                            <Button>
                                <Close onClick={()=>{
                                    setModalStatus(false)
                                }
                                }></Close>
                            </Button>

                        }
                        title="Store Details"
                        />
                        <Grid container>
                            <Grid item sm={12}>
                                <p className={['capitalize']}>
                                    <b>Store Name :</b>
                                    {viewStoreData.name}
                                </p>
                            </Grid>
                            <Grid item sm={6}>
                                <p><b>Email: </b>{viewStoreData.email}</p>

                            </Grid>
                            <Grid item sm={6}>
                                <p><b>Phone: </b>{viewStoreData.phone}</p>

                            </Grid>
                            <Grid item sm={6}>
                                <p className={['capitalize']}><b>Entity: </b>{viewStoreData.entity}</p>

                            </Grid>
                            <Grid item sm={6}>
                                <p><b>Additional phone: </b>{viewStoreData.additionalPhone}</p>

                            </Grid>
                            <Grid >
                                <p className={['capitalize']}><b>Account Manager: </b>{viewStoreData.accountManager}</p>
                            </Grid>

                            <Grid item sm={12}>
                                <p className={['capitalize']}><b>Verified: </b>{String(viewStoreData.verified)}</p>
                            </Grid>
                            <Grid item sm={12}>
                                <p>
                                    <b>Address :</b>
                                    {viewStoreData.address}
                                </p>
                            </Grid>

                        </Grid>
                    </Card>
                </Box>

            </Modal>
        </Fragment>
    );
}

export default Stores;