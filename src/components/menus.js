import React, {Fragment} from 'react';
import {Box,  List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {Home} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

function Menus(props) {
    const navigate = useNavigate();
    return (
      <Fragment>
          <Box
              sx={{width:250}}
              role="presentation"
          >
            <List>
                <ListItem onClick={()=>navigate('/')}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Home></Home >
                        </ListItemIcon>
                        <ListItemText primary="Dashboard"/>
                    </ListItemButton>
                </ListItem>
                <ListItem onClick={()=>navigate('/categories')}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Home></Home>
                            </ListItemIcon>
                            <ListItemText primary="Category"/>
                        </ListItemButton>
                </ListItem>
                <ListItem onClick={()=>navigate('/products')}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Home></Home>
                        </ListItemIcon>
                        <ListItemText primary="Products"/>
                    </ListItemButton>
                </ListItem>
                <ListItem onClick={()=>navigate('/brands')}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Home></Home>
                        </ListItemIcon>
                        <ListItemText primary="Brand"/>
                    </ListItemButton>
                </ListItem>
                <ListItem onClick={()=>navigate('/stores')}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Home></Home>
                        </ListItemIcon>
                        <ListItemText primary="Stores"/>
                    </ListItemButton>
                </ListItem>
                <ListItem onClick={()=>navigate('/pages')}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Home></Home>
                        </ListItemIcon>
                        <ListItemText primary="Pages"/>
                    </ListItemButton>
                </ListItem>
                <ListItem onClick={()=>navigate('/platforms')}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Home></Home>
                        </ListItemIcon>
                        <ListItemText primary="Platforms"/>
                    </ListItemButton>
                </ListItem>
                <ListItem onClick={()=>navigate('/paymentOptions')}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Home></Home>
                        </ListItemIcon>
                        <ListItemText primary="PaymentOptions"/>
                    </ListItemButton>
                </ListItem>

            </List>
          </Box>
      </Fragment>
    );
}

export default Menus;