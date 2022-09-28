import React from 'react';
import {Fragment} from "@types/react";
import {Button} from "@mui/material";

function ActionsButton(props) {
    return (
        <Fragment>
            <Button
                variant="contained"
                size="small"
                style={{marginLeft:16}}
            >
                Edit
            </Button>

        </Fragment>
    );
}

export default ActionsButton;