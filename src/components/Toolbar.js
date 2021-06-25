import React from 'react';
import Electron from 'electron';

function Toolbar() {
    const window = Electron.remote.getCurrentWindow();
    
    function minimize() {
        window.minimize();
    }

    function maximize() {
        if (window.isMaximized()) {
            window.unmaximize();
        } else {
            window.maximize();
        }
    }

    function close() {
        window.close();
    }

    return <>
        <div id="drag-region"></div>
        <div>
            <span onClick={minimize} id="min-button"><i><svg aria-hidden="false" width="12" height="12" viewBox="0 0 12 12"><rect fill="currentColor" width="10" height="1" x="1" y="6"></rect></svg></i></span>
            <span onClick={maximize} id="max-button"><i><svg aria-hidden="false" width="12" height="12" viewBox="0 0 12 12"><rect width="9" height="9" x="1.5" y="1.5" fill="none" stroke="currentColor"></rect></svg></i></span>
            <span onClick={close} id="close-button"><i><svg aria-hidden="false" width="12" height="12" viewBox="0 0 12 12"><polygon fill="currentColor" fillRule="evenodd" points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"></polygon></svg></i></span>
        </div>
    </>;
}

export default Toolbar;