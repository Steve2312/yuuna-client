import { ipcRenderer } from 'electron';
import path from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';

export const appDataPath = isDevelopment ? path.join(ipcRenderer.sendSync("getPath", "appData"), process.env.npm_package_name) : ipcRenderer.sendSync("getPath", "userData");
export const songsPath = path.join(appDataPath, "songs");
export const tempPath = path.join(appDataPath, "temp");

export default {appDataPath, songsPath, tempPath}