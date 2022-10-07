import React, {Fragment} from 'react';
import { Grid, Paper} from "@mui/material";

function ComponentList({selectedComponent,selectComponent}) {
    const components = [
        {
            type: 'links',
            title: "Type in header",
            subtitle: "",
            cols: '6',
            isCentered: false,
            hideImageName:false,
            items: [],
            itemsType:'medias',
            itemsPreview:[]
        },
        {
            type: 'slider',
            title: "Type in header",
            subtitle: "",
            cols: '6',
            isCentered: false,
            hideImageName:true,
            items: [],
            itemsType:'medias',
            itemsPreview:[]

        },
        {
            type: 'productList',
            title: "Type in header",
            subtitle: "",
            cols: '6',
            isCentered: false,
            items: [],
            sku:[],
            itemsType:'products',
            itemsPreview:[]

        },
        {
            type: 'sales',
            title: "Type in header",
            subtitle: "",
            cols: '6',
            isCentered: false,
            endDate:'',
            items: [],
            sku:[],
            itemsType:'products',
            itemsPreview:[]
        },
    ];

    const isSelected = (component)=>selectedComponent.type === component.type;
   return (
        <Fragment>
                    {
                        components
                            .map((component,index)=>(
                                <Grid item sm={6} key={index}>
                                    <Paper  elevation={isSelected(component)?3:1} className={'clickable'} onClick={()=>{selectComponent(component)}} style={{padding:'30px',textAlign:'center' }}>
                                        {component.type}
                                    </Paper>
                                </Grid>
                            ))
                    }
        </Fragment>
    );
}

export default ComponentList;