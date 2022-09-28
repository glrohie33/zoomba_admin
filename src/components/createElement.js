import {createElement} from 'react';
import ProductBox from "./productBox";
import ImageBox from "./imageBox";

const elements ={
    'productBox':ProductBox,
    'imageBox':ImageBox,
}

export const CreateElement=(element,props)=>{
    if(element in elements){
        return createElement(elements[element],{...props})
    }
}