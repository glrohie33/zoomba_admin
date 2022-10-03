import {Modal} from "@mui/material";
import React from "react";

function modal(Component){
    return function modalContent({open,...others}){
        console.log(open);
        return <Modal open={open} >
            <div className={'modal-body'}>
                <Component {...others}></Component>
            </div>
        </Modal>
    }
}

export default modal;