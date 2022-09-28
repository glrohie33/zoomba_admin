import React, {Fragment, useEffect, useState} from 'react';
import {get} from "../../actions/auth";
import {POSTURL} from "../../utils/texthelper";
import {Button, Grid} from "@mui/material";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import {Delete, Edit} from "@mui/icons-material";
import {Link, useNavigate} from "react-router-dom";

function Pages(props) {
    const navigate = useNavigate();
    const columns = [
        {
            field:'name',
            flex:1
        },
        {
            field:'postType',
            headerName:'Page Type',
            flex: 1
        },
        {
            field:'slug',
            headerName: 'Slug',
            flex:1
        },
        {
            field: 'actions',
            type:'actions',
            headerName: 'Actions',
            getActions:({row:{slug}})=>[
                <GridActionsCellItem icon={<Delete/>} label={'delete'}/>,
                <GridActionsCellItem icon={<Edit/>} label={'edit'} onClick={()=>{editItem(slug)}}/>
            ]
        }
    ]

    const editItem = (slug)=>{
        // console.log(params);
        navigate(`/pages/edit/${slug}`)
    }
    const[data,setData] = useState([]);
    const getPages = ()=>{
        get(POSTURL)
            .then(resp=>{
                const {status,posts} = resp.data;
                if(status){
                    setData(posts);
                }
            })
    }

    useEffect(()=>{
getPages();
    },[])

    return (
        <Fragment >
            <Grid container>
                <Grid sm={12}>
                    <h3>Pages</h3>
                </Grid>
                <Grid item sm={12}>
                    <div>
                        <Link to={'/pages/add'}>
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

export default Pages;