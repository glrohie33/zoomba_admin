import React from 'react';
import {Link} from "react-router-dom";

function ImageBox(props) {

    return (
        <Link to={props.data.link||''} className={'image-box'}>
            <img src={props.data.url} alt={props.data.title}/>
            <h4>{props.data.title}</h4>
        </Link>
    );
}

export default ImageBox;