import { app, session, BrowserWindow, ipcMain } from "electron";
import path from "path";
import dotenv from "dotenv";

if (!app.requestSingleInstanceLock()) {
    app.quit();
}

let win: BrowserWindow | null = null;

async function createWindow() {
    win = new BrowserWindow( {
        width: 1280,
        height: 720,
        minHeight: 600,
        minWidth: 800,
        frame: false,
        titleBarStyle: process.platform == "darwin" ? "hiddenInset" : "hidden",
        backgroundColor: "#1e1e1e",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        },
    });

    if (app.isPackaged) {
        await win.loadFile(path.join(__dirname, "dist", "../index.html"));
    } else {
        await session.defaultSession.loadExtension("C:\\Users\\stefl\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\4.24.7_0");
        dotenv.config();
        const url = "http://" + process.env.DEV_HOST + ":" + process.env.DEV_PORT;
        await win.loadURL(url);
    }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    win = null;
    if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
    if (win) {
        if (win.isMinimized()) win.restore();
        win.focus();
    }
});

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
    event.returnValue = app.getPath("userData");
});