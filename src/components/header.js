import React, {Fragment, useState} from 'react';
import {AppBar, Drawer, IconButton, Toolbar} from "@mui/material";
import {Menu} from "@mui/icons-material";
import Menus from "./menus";

function Header(props) {

    const [openDrawer,setDrawer] = useState(false);

    return (
        <Fragment>
            <AppBar position={"fixed"} >
                <Toolbar>
                    <IconButton onClick={()=>{setDrawer(true)}}>
                        <Menu/>
                    </IconButton>
                    <Drawer
                    anchor={'left'}
                    open={openDrawer}
                    onClose={()=>{setDrawer(false)}}
                    >
                        <Menus ></Menus>
                    </Drawer>
                    <h3>Zoomba</h3>
                </Toolbar>
            </AppBar>
        </Fragment>
    );
}

export default Header;