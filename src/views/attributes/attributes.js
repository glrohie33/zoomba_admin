import React,{Fragment, useEffect, useState} from 'react';
import {Button, Grid, IconButton} from "@mui/material";
import {get} from "../../actions/auth";
import {ATTRIBUTElISTURL} from "../../utils/texthelper";
import {DataGrid} from "@mui/x-data-grid";
import {Delete} from "@mui/icons-material";
import {Link} from "react-router-dom";

function Attributes(props) {
    const columns = [
        {
            field:'name',
            flex:1
        },
        {
            field:'unit',
            headerName:'Units',
            flex: 1,
            valueFormatter:({value})=>{
                return value?.join(",")||"";
            }
        },
        {
          field:'options',
          headerName: 'Options',
          flex:1,
          valueFormatter:({value})=>{
              return value?.join(",")||"";
          }
        },
        {
            field: 'id',
            headerName: 'Actions',
            renderCell:({value})=>{
                return(
                <Fragment>
                    <Button
                        variant="contained"
                        size="small"
                        style={{marginLeft:16}}
                    >
                        Edit
                    </Button>
                    <IconButton>
                      <Delete/>
                    </IconButton>
                </Fragment>)

            }
        }
    ];

    const [data,setData] = useState([])

    useEffect(()=>{
        get(ATTRIBUTElISTURL).then((resp)=>{
            const {status,attributes}= resp.data;
            if(status){
                setData(attributes);
            }
        }).catch(e=>{

        });
    },[]);

    return (
        <Fragment >
            <Grid container>
                <Grid sm={12}>
                    <h3>Categories</h3>
                </Grid>
                <Grid item sm={12}>
                    <div>
                        <Link to={'/attributes/add'}>
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

export default Attributes;