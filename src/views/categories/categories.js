import React, {Fragment, useEffect, useState} from 'react';
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import {get, patch} from "../../actions/auth";
import {AUTHALERTNAME, CATEGORYLISTURL, ERRORALERT, SUCCESSALERT} from "../../utils/texthelper";
import {Button, Grid, Switch} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {Delete, Edit} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {addAlert} from "../../store/reducers/alertSlice";

function Categories(props) {
    const navigate = useNavigate()
    const [page,setPage] = useState(1);
    const [rowCount,setRowCount] = useState(1);
    const dispatch = useDispatch();
    const columns = [
        {
            field:'name',
            flex:1
        },
        {
            field:'parent',
            headerName:'parent category',
            flex: 1,
            valueFormatter:({value})=>(value?.name||'')
        },
        {
            field:'attributes',
            headerName: 'Attributes',
            valueFormatter:({value})=>{
                return value.map(v=>v.name)

        },
            flex:1
        },
        {
            field:"topCategory",
            headerName: "topCategory",
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
            type:'actions',
            headerName: 'Actions',
            getActions:({row:{id}})=>[
                <GridActionsCellItem icon={<Delete/>} label={'delete'}/>,
                <GridActionsCellItem icon={<Edit/>} label={'edit'} onClick={()=>{editItem(id)}}/>
            ],
        }
    ];
    const [data,setData] = useState([])

    const editItem = (slug)=>{
        // console.log(params);
        navigate(`edit/${slug}`)
    }


    function changeStatus(event,id){
       const item = data.find(data=>data.id === id);
       if(Boolean(item)){
           item.topCategory  = event.target.checked;
           const itemIndex = data.findIndex(data=>data.id === id);
           if(itemIndex > -1){
               patch(`${CATEGORYLISTURL}/${id}`,item).then(({data})=>{
                   const {status} = data;
                   if(status){
                       dispatch(addAlert({
                           name: AUTHALERTNAME,
                           message:'Status Changed',
                           status:SUCCESSALERT
                       }));
                       const newData = [...data];
                       newData[itemIndex] = item;
                       setData(newData);
                   }
               }).catch(e=>{
                   const data = e.response.data
                   dispatch(addAlert({
                       name:AUTHALERTNAME,
                       message:data.message,
                       status:ERRORALERT
                   }));
               })
           }

       }
    }
    useEffect(()=>{
        if(page){
            get(`${CATEGORYLISTURL}?currentPage=${page??1}`).then((resp)=>{
                const {status,categories,total}= resp.data;
                if(status){
                    setData(categories);
                    setRowCount(total);
                }
            }).catch(e=>{

            });
        }

    },[page]);

    return (
            <Fragment >
                <Grid container>
                    <Grid sm={12}>
                        <h3>Categories</h3>
                    </Grid>
                    <Grid item sm={12}>
                        <div>
                            <Link to={'/categories/add'}>
                                <Button variant={'contained'}>Add New</Button>
                            </Link>
                        </div>
                    </Grid>
                    <Grid sm={12}>
                        <DataGrid
                            paginationMode={'server'}
                            page={page}
                            rowCount={rowCount}
                            columns={columns}
                            rows={data}
                            style={{ height: 300, width: '100%' }}
                            onPageChange={(newPage)=>setPage(newPage)}
                        ></DataGrid>
                    </Grid>
                </Grid>
            </Fragment>
    );
}

export default Categories;