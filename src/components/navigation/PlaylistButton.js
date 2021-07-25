import React from 'react';

function PlaylistButton(props) {
    return (
        <li onClick={props.onClick}><span>{props.name}</span></li>
    )
}

export default PlaylistButton;