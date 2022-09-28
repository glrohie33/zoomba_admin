import React,{Fragment} from 'react';
import {Grid} from "@mui/material";
import {CreateElement} from "../createElement";

function Items({items,viewType,...props}) {
    const viewList ={
        productList:'productBox',
        links:'imageBox',
        slides:'imageBox',
    }


    return (
        <Fragment>
            {
              items.map((item,index)=>{
                  props.data = item;
                  return (<Grid item sm={(12/props.cols)} key={index}>
                      {

                          CreateElement(viewList[viewType], props)
                      }
                  </Grid>)
              }

              )
            }
        </Fragment>
    );
}

export default Items;