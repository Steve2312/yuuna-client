import React from "react";
import logo from "../assets/images/logo.png"
import style from "../styles/navigation.module.scss";

import { MdGetApp, MdLibraryMusic } from "react-icons/md";

const Navigation: React.FC = () => {
    return (
        <div className="navigation" style={style} >

            <div className="watermark">
                <img src={logo} alt="Yuuna"/>
                <span>Yuuna</span>
            </div>

            <ul >
                <li>
                    <MdGetApp/>
                    <span>Download songs</span>
                </li>
                <li>
                    <MdLibraryMusic/>
                    <span>Library</span>
                </li>
                <li>
                    <br />
                </li>
            </ul>
        </div>
    );
}

export default Navigation;