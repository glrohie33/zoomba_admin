import React, {Fragment, useEffect, useState} from 'react';
import {DataGrid} from "@mui/x-data-grid";
import {get} from "../../actions/auth";
import {BRANDLISTURL} from "../../utils/texthelper";
import {Button, Grid} from "@mui/material";
import {Link} from "react-router-dom";

function Brands(props) {
    const columns = [
        {
            field:'name',
            flex:1
        },
        {
            field:'officialStore',
            headerName:'official store',
            flex: 1,
            valueFormatter:({value})=>{
                return value?.title||"";
            }
        },
        {
            field: 'slug',
            headerName: 'Actions',
            renderCell:({value})=>{
                return <Button
                    variant="contained"
                    size="small"
                    style={{marginLeft:16}}
                >
                    Edit
                </Button>
            }
        }
    ];

    const [data,setData] = useState([])

    useEffect(()=>{
        get(BRANDLISTURL).then((resp)=>{
            const {status,brands}= resp.data;
            if(status){
                setData(brands);
            }
        }).catch(e=>{

        });
    },[]);

    return (
        <Fragment >
            <Grid container>
                <Grid sm={12}>
                    <h3>Brands</h3>
                </Grid>
                <Grid item sm={12}>
                    <div>
                        <Link to={'/brands/add'}>
                            <Button variant={'contained'}>Add New</Button>
                        </Link>
                    </div>
                </Grid>
                <Grid sm={12}>
                    <DataGrid columns={columns} rows={data} style={{ height: 300, width: '100%' }}></DataGrid>
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default Brands;