import React,{Fragment,useState,useEffect} from 'react';
import {Button, Grid} from "@mui/material";
import {get} from "../../actions/auth";
import {PLATFORMlISTURL} from "../../utils/texthelper";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import {Link} from "react-router-dom";
import {Delete, Edit, Home} from "@mui/icons-material";

function Platforms(props) {
    const columns = [
        {
            field:'name',
            flex:1
        },
        {
            field: 'key',
            headerName: 'Key',
            flex: 1
        },
        {
            field: 'actions',
            type:'actions',
            headerName: 'Actions',
            getActions:({row:{slug,homepage}})=>[
                <GridActionsCellItem icon={<Delete/>} label={'delete'}/>,
                <GridActionsCellItem icon={<Edit/>} label={'edit'} />,
                <GridActionsCellItem icon={<Link to={(homepage.length>0)?`/pages/edit/${homepage[0].slug}`:''}><Home/></Link>} />
            ]
        }
    ];

    const [data,setData] = useState([])

    useEffect(()=>{
        get(PLATFORMlISTURL).then((resp)=>{
            const {status,platforms}= resp.data;
            if(status){
                setData(platforms);
            }
        }).catch(e=>{

        });
    },[]);

    return (
        <Fragment >
            <Grid container>
                <Grid sm={12}>
                    <h3>Platforms</h3>
                </Grid>
                <Grid item sm={12}>
                    <div>
                        <Link to={'/platforms/add'}>
                            <Button variant={'contained'} >Add New</Button>
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

export default Platforms;