import React from "react";
import styles from "../styles/app.module.scss";

import Window from "@/components/Window";
import Navigation from "@/components/Navigation";
import Outlet from "@/components/Outlet";
import Player from "@/components/Player";
import Downloads from "@/components/Downloads";

const App: React.FC = () => {
    return (
        <div className={styles.app + (process.platform == "darwin" ? " " + styles.darwin : "")}>
            <Window />
            <Navigation />
            <div className={styles.outlet}>
                <Outlet />
            </div>
            <Downloads />
            <Player />
        </div>
    );
};

export default App;
