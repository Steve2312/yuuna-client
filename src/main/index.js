import { app, BrowserWindow } from 'electron';
import path from 'path';

const secondInstance = app.requestSingleInstanceLock();
var mainWindow = null;

const isDevelopment = process.env.NODE_ENV !== 'production';

const createWindow = () => {
    mainWindow = new BrowserWindow( {
        width: 1280,
        height: 720,
        minHeight: 700,
        minWidth: 800,
        frame: false,
        backgroundColor: '#1e1e1e',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    } );

    // load HTML file
    if( isDevelopment ) {
        require('dotenv').config();
        mainWindow.loadURL( `http://${ process.env.ELECTRON_WEBPACK_WDS_HOST }:${ process.env.ELECTRON_WEBPACK_WDS_PORT }` );
    } else {
        mainWindow.loadFile( path.resolve( __dirname, 'index.html' ) );
    }
};

if (!secondInstance) {
    app.quit();
}

app.on('ready', () => {
    createWindow();
} );

app.on('window-all-closed', () => {
    if( process.platform !== 'darwin' ) {
        app.quit();
    }
});

app.on( 'activate', () => {
    if( BrowserWindow.getAllWindows().length === 0 ) {
        createWindow();
    }
} );

app.on('second-instance', () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
        }
        mainWindow.focus();
    }
});