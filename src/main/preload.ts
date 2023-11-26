import { contextBridge, ipcRenderer } from "electron";

export const electronAPI = {
    moveMouse: (x: number, y: number) => ipcRenderer.send("move-mouse", x, y),
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
