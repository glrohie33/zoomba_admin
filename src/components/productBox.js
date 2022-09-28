import React,{Fragment}from 'react';
import {Link} from "@mui/material";

function ProductBox({data}) {
    return (
        <Link  to={`products/${data.slug||''}`} className={'product-box'}>
           <img src={data.mainImage} alt={data.name}/>
               <div>
                   <h1>{data.name}</h1>
                   <p>{data.price}</p>
               </div>
        </Link>
    );
}

export default ProductBox;