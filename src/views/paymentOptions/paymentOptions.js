import React, {useState,Fragment, useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import {Delete, Edit} from "@mui/icons-material";
import {Button, Grid} from "@mui/material";
import {get} from "../../actions/auth";
import {PAYMENTOPTIONSURL} from "../../utils/texthelper";

function PaymentOptions(props) {

    const navigate = useNavigate();
    const editItem = (slug)=>{
        navigate(`/pages/edit/${slug}`)
    }
    const columns = [
        {
            field:'name',
            flex:1
        },
        {
            field:'key',
            headerName:'Key',
            flex: 1
        },
        {
            field:'downPercent',
            headerName:'Down Percent',
            flex: 1
        },{
            field:'interestRate',
            headerName:'Interest Rate',
            flex: 1
        },
        {
            field:'activeStatus',
            headerName: 'status',
            flex:1
        },
        {
            field: 'actions',
            type:'actions',
            headerName: 'Actions',
            getActions:({row:{key}})=>[
                <GridActionsCellItem icon={<Delete/>} label={'delete'}/>,
                <GridActionsCellItem icon={<Edit/>} label={'edit'} onClick={()=>{editItem(key)}}/>
            ]
        }
    ]

    const [data,setData] = useState({});

    const getPayments = ()=>{
        get(PAYMENTOPTIONSURL)
            .then(resp=>{
                const {status,payments} = resp.data;
                if(status){
                    setData(payments);
                }
            })
    }

    useEffect(()=>{
        getPayments();
    },[])
    return (
        <Fragment >
            <Grid container>
                <Grid sm={12}>
                    <h3>Payments</h3>
                </Grid>
                <Grid item sm={12}>
                    <div>
                        <Link to={'/paymentOptions/add'}>
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

export default PaymentOptions;