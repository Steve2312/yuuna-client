import React from 'react';

import logo from "../assets/images/logo.png"

function Watermark() {
    return (
        <div className="watermark">
            <img src={logo} alt="Yuuna logo"/>
            <p>Yuuna</p>
        </div>
    );
}

export default Watermark;