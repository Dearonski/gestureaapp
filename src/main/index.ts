import { mouse, Point, keyboard, Key, Button } from "@nut-tree/nut-js";
import { app, BrowserWindow, ipcMain, net, protocol } from "electron";
import path from "path";
import MenuBuilder from "./menu";
import i18n from "./i18n";

protocol.registerSchemesAsPrivileged([
    {
        scheme: "static",
        privileges: { supportFetchAPI: true, bypassCSP: true },
    },
]);

if (require("electron-squirrel-startup")) {
    app.quit();
}

const createWindow = (): void => {
    const mainWindow = new BrowserWindow({
        minHeight: 600,
        minWidth: 1000,
        titleBarStyle: "hidden",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    i18n.changeLanguage(app.getLocale());

    ipcMain.on("request-language", (event) => {
        event.reply("response-language", i18n.language);
    });

    i18n.on("languageChanged", (lng: string) => {
        menuBuilder.buildMenu();
        mainWindow.webContents.send("update-language", lng);
    });

    ipcMain.on("move-mouse", async (event, x: number, y: number) => {
        await mouse.setPosition(new Point(x, y));
    });

    ipcMain.on("request-mouse-pos", async (event) => {
        event.reply("response-mouse-pos", await mouse.getPosition());
    });

    ipcMain.on("volume-up", async () => {
        await keyboard.pressKey(Key.AudioVolUp);
        await keyboard.releaseKey(Key.AudioVolUp);
    });

    ipcMain.on("volume-down", async () => {
        await keyboard.pressKey(Key.AudioVolDown);
        await keyboard.releaseKey(Key.AudioVolDown);
    });

    ipcMain.on("next-track", async () => {
        await keyboard.pressKey(Key.AudioNext);
        await keyboard.releaseKey(Key.AudioNext);
    });

    ipcMain.on("previous-track", async () => {
        await keyboard.pressKey(Key.AudioPrev);
        await keyboard.releaseKey(Key.AudioPrev);
    });

    ipcMain.on("play-track", async () => {
        await keyboard.pressKey(Key.AudioPlay);
        await keyboard.releaseKey(Key.AudioPlay);
    });

    ipcMain.on("left-click", async () => {
        await mouse.click(Button.LEFT);
    });

    ipcMain.on("right-click", async () => {
        await mouse.click(Button.RIGHT);
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(
            path.join(
                __dirname,
                `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`
            )
        );
    }

    const menuBuilder = new MenuBuilder(mainWindow);
    menuBuilder.buildMenu();

    mainWindow.webContents.openDevTools();
};

app.on("ready", () => {
    protocol.handle("static", (request) => {
        return net.fetch(
            "file://" +
                path.join(__dirname, request.url.slice("static://".length))
        );
    });

    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
