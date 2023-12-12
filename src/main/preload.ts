import { Point } from "@nut-tree/nut-js";
import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";

export const electronApi = {
    onUpdateLanguage: (callback: (lng: string) => void) => {
        ipcRenderer.on(
            "update-language",
            (_event: IpcRendererEvent, lng: string) => callback(lng)
        );
    },
    requestLanguage: () => ipcRenderer.send("request-language"),
    responseLanguage: (callback: (lng: string) => void) =>
        ipcRenderer.once(
            "response-language",
            (_event: IpcRendererEvent, lng: string) => callback(lng)
        ),
    moveMouse: (x: number, y: number) => ipcRenderer.send("move-mouse", x, y),
    volumeUp: () => ipcRenderer.send("volume-up"),
    volumeDown: () => ipcRenderer.send("volume-down"),
    nextTrack: () => ipcRenderer.send("next-track"),
    previousTrack: () => ipcRenderer.send("previous-track"),
    playTrack: () => ipcRenderer.send("play-track"),
    leftClick: () => ipcRenderer.send("left-click"),
    rightClick: () => ipcRenderer.send("right-click"),
    requestMousePos: () => ipcRenderer.send("request-mouse-pos"),
    responseMousePos: (callback: (pos: Point) => void) =>
        ipcRenderer.on(
            "response-mouse-pos",
            (_event: IpcRendererEvent, pos: Point) => callback(pos)
        ),
};

contextBridge.exposeInMainWorld("electronAPI", electronApi);
