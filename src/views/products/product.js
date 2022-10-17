import React, {Fragment, useCallback, useEffect, useMemo, useState} from 'react';
import {Button, Grid} from "@mui/material";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import {PRODUCTURL} from "../../utils/texthelper";
import {get} from "../../actions/auth";
import {Delete, Edit} from "@mui/icons-material";
import {Link} from "react-router-dom"

function Product(props) {

    const columns =useMemo(()=>[
        {
            field:'name',
            flex:1
        },
        {
            field: 'sku',
            flex:1,
        },{
            field:'categories',
            headerName:'category',
            flex: 1,
            valueFormatter:({value})=> {
                return value.map(v => v.name);
            }
        },
        {
            field:'brand',
            headerName:'Brand',
            flex: 1,
            valueFormatter:({value})=> {
                return value.name;
            }
        },
        {
            field:'platform',
            headerName:'Platform',
            flex: 1
        },
        {
            field:'price',
            headerName: 'Price',
            flex:1
        },
        {
            field:'purchasePrice',
            headerName: 'Purchase Price',
            flex:1
        },
        {
            field: 'actions',
            type:'actions',
            headerName: 'Actions',
            getActions:({row:{id}})=>[
                <GridActionsCellItem icon={<Delete/>} label={'delete'}/>,
                <GridActionsCellItem icon={<Link  to={`/products/edit/${id}`}><Edit/></Link>} label={'edit'}/>
            ]
        }

    ],[]);
    const [page,setPage] = useState(0);
    const [rowCount,setRowCount] = useState(1);
    const [data,setData] = useState([]);
    const totalRows = useMemo(()=>{
        return rowCount;
    },[rowCount]);


    const getProducts = useCallback(()=>{
        if(page){
            get(`${PRODUCTURL}?currentPage=${page === 0?1:page+1}`).then(resp=>{
                const {status,products:{products,total}} = resp.data;
                if(status){
                    setData(products);
                    setRowCount(total)
                }
            })
        }
    },[page]);

    useEffect(()=>{
        getProducts()
    },[page,getProducts]);
    return (
            <Fragment >
                <Grid container>
                    <Grid sm={12}>
                        <h3>Products</h3>
                    </Grid>
                    <Grid item sm={12}>
                        <div>
                            <Link to={'/products/add'}>
                                <Button variant={'contained'} > Add Product</Button>
                            </Link>
                        </div>
                    </Grid>
                    <Grid sm={12}>
                        <p>{totalRows} No Of Products</p>
                        <DataGrid
                            paginationMode={'server'}
                            page={page}
                            rowCount={totalRows}
                            columns={columns}
                            rows={data}
                            pagination
                            pageSize={20}
                            rowsPerPageOptions={[20]}
                            style={{ height: 300, width: '100%' }}
                            onPageChange={(newPage)=>setPage(newPage)}
                        ></DataGrid>
                    </Grid>
                </Grid>
            </Fragment>

    );
}

export default Product;