import React from "react";
import {BrowserWindow, remote} from "electron";
import {VscChromeMinimize, VscChromeMaximize, VscChromeClose} from 'react-icons/vsc';
import styles from '../styles/window.module.scss';

const Window: React.FC = () => {

    const window: BrowserWindow = remote.getCurrentWindow();

    const toggleMaximize = (): void => {
        if (window.isMaximized()) {
            window.unmaximize();
        } else {
            window.maximize();
        }
    }

    const minimize = (): void => {
        window.minimize();
    }

    const close = (): void => {
        window.close();
    }

    return (
        <div className="window" style={styles}>
            <div id="drag-region"/>
            <div className="controls">
                <div onClick={minimize} id="min-button"><VscChromeMinimize /></div>
                <div onClick={toggleMaximize} id="max-button"><VscChromeMaximize /></div>
                <div onClick={close} id="close-button"><VscChromeClose /></div>
            </div>
        </div>
    )
}

export default Window;
