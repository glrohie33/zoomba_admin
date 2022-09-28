import React, {Fragment, memo} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Alert,Snackbar} from "@mui/material";
import {clearAlert, removeAlert} from "../store/reducers/alertSlice";

function Displayalerts({name}) {
    const alerts = useSelector(store=>store.alert[name]);
    const dispatch = useDispatch();
    function closeAlert(event,reason,id){
        if(reason === 'clickaway'){
            return
        }
        if(id){
            dispatch(removeAlert({name,id}))
        }else{
            dispatch(clearAlert(name));
        }

    }



    return (
    <Fragment>
        <Snackbar
            open={(alerts.length > 0)}
            autoHideDuration={5000}
            onClose={(event,reason)=>{
                closeAlert(event,reason,"")
                  }}
            >
            <div>
                {alerts.map(alert=>
                    <Alert
                        severity={alert.status}
                        key={alert.id}
                        onClose={(event,reason)=>{
                            closeAlert(event,reason,alert.id)
                        }}
                    >
                        {alert.message}
                    </Alert>
                )}
            </div>
        </Snackbar>
    </Fragment>

    );
}

export default memo(Displayalerts);