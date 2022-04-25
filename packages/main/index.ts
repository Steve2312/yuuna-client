import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import Beatmap from "@/interfaces/Beatmap";
import {Simulate} from "react-dom/test-utils";


if (!app.requestSingleInstanceLock()) {
    app.quit();
}

let win: BrowserWindow | null = null

async function createWindow() {
    win = new BrowserWindow( {
        width: 1280,
        height: 720,
        minHeight: 600,
        minWidth: 800,
        frame: false,
        backgroundColor: '#1e1e1e',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        },
    });

    if (app.isPackaged) {
        await win.loadFile(path.join(__dirname, '../renderer/index.html'))
    } else {
        // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
        require('dotenv').config()
        const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
        await win.loadURL(url)
    }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

ipcMain.on("minimize-me", () => {
    if (win) win.minimize();
});

ipcMain.on("maximize-me", () => {
    if (win) {
        if (win.isMaximized()) win.unmaximize();
        else win.maximize();
    }
});

ipcMain.on("close-me", () => {
    app.quit();
});

ipcMain.on("appData-path", (event) => {
    event.returnValue = app.getPath('userData');
})

ipcMain.on("download-beatmap", (event, args: {beatmap: Beatmap}) => {

    console.log("Received in main thread")

    let beatmap = args.beatmap;
    let downloadURL = "https://beatconnect.io/b/" + beatmap.id + "/" + beatmap.unique_id;
    let output = path.join(app.getPath('userData'), 'temp', beatmap.id + '.zip');
})
