import React from "react";
import styles from "../styles/app.module.scss";

import Window from "./Window";
import Navigation from "./Navigation";
import Outlet from "@/components/Outlet";

const App: React.FC = () => {
    return (
        <div className={styles.app}>
            <Window />
            <Navigation />
            <div className={styles.outlet}>
                <Outlet />
            </div>
        </div>
    );
}

export default App;