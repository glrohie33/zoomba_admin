import React, {useState, useEffect, memo, useMemo} from 'react';
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import {Delete, RemoveRedEye} from "@mui/icons-material";
import {Grid} from "@mui/material";
import {get} from "../actions/auth";
import {ORDERLISTURL} from "../utils/texthelper";

function OrdersTable({limit = 20 }) {
    const columns = [
        {
            field:'user',
            headerName:'Buyer',
            flex:1,
            valueFormatter:({value})=>(value?.email||'')
        },
        {
            field:'paymentStatus',
            headerName:'Payment Status',
            flex: 1,
        },
        {
            field:'shippingPrice',
            headerName: 'Shipping Price',
            flex:1
        },
        {
            field:'totalPrice',
            headerName: 'Total Price',
            flex:1
        },
        {
            field:'grandTotal',
            headerName: 'Grand Total',
            flex:1
        },
        {
            field:'createdAt',
            headerName: 'Date',
            valueFormatter:({value})=>(new Date(value).toString()),
            flex:1
        },
        {
            field: 'actions',
            type:'actions',
            headerName: 'Actions',
            getActions:({row:{slug}})=>[
                <GridActionsCellItem icon={<Delete/>} label={'delete'}/>,
                <GridActionsCellItem icon={<RemoveRedEye/>} label={'edit'} />
            ],
        }
    ];
    const [page,setPage] = useState(0);
    const [rowCount,setRowCount] = useState(1);
    const [data,setData] = useState([]);
    const totalRows = useMemo(()=>{
        return rowCount;
    },[rowCount]);
    useEffect(()=>{
            get(`${ORDERLISTURL}?currentPage=${page === 0?1:page+1}&perPage=${limit}`).then((resp)=>{
                const {status,orders,total}= resp.data;
                if(status){
                    setData(orders);
                    setRowCount(total);
                }
            }).catch(e=>{

            });

    },[page,limit]);
    return (
        <Grid container>
            <Grid sm={12}>
                <DataGrid
                    paginationMode={'server'}
                    page={page}
                    rowCount={totalRows}
                    columns={columns}
                    rows={data}
                    pagination
                    pageSize={limit}
                    rowsPerPageOptions={[limit]}
                    style={{ height: 300, width: '100%' }}
                    onPageChange={(newPage)=>setPage(newPage)}
                ></DataGrid>
            </Grid>
        </Grid>
    );
}

export default memo(OrdersTable);