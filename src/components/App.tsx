import React from "react";
import style from "../styles/app.module.scss";

import Window from "./Window";
import Navigation from "./Navigation";

const App: React.FC = () => {
    return (
        <div className="app" style={style}>
            <Window />
            <Navigation />
            <div className="outlet">
            </div>
        </div>
    );
}

export default App;