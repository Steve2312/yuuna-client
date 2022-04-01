import React from 'react';

function NavigationButton(props) {
    const className = `fas fa-${props.icon}`;
    const name = props.name;

    return (
        <li onClick={props.onClick}><span><i className={className}></i>{name}</span></li>
    );
}

export default NavigationButton;