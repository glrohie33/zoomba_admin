import React from 'react';
import {Modal} from "@mui/material";
import ImageSelector from "./imageSelector";
function MyModal(Component){
    return function  Modal({open,...others})
    {
        return (<Modal open={open} >
            <div className={'modal-body'}>
                <Component {...others}></Component>
            </div>
        </Modal>);
    }

}

export default ImageModal;