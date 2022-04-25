import React from "react";
import {ipcRenderer} from "electron";
import {VscChromeMinimize, VscChromeMaximize, VscChromeClose} from 'react-icons/vsc';
import styles from '../styles/window.module.scss';

const Window: React.FC = () => {

    const maximize = (): void => {
        ipcRenderer.send('maximize-me');
    }

    const minimize = (): void => {
        ipcRenderer.send('minimize-me');
    }

    const close = (): void => {
        ipcRenderer.send('close-me');
    }

    return (
        <div className={styles.window}>
            <div className={styles.dragRegion}/>
            <div className={styles.controls}>
                <div onClick={minimize} className={styles.minButton}><VscChromeMinimize /></div>
                <div onClick={maximize} className={styles.maxButton}><VscChromeMaximize /></div>
                <div onClick={close} className={styles.closeButton}><VscChromeClose /></div>
            </div>
        </div>
    )
}

export default Window;
