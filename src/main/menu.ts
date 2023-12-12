import { app, Menu, BrowserWindow, MenuItemConstructorOptions } from "electron";
import i18n from "./i18n";

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
    selector?: string;
    submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
    mainWindow: BrowserWindow;

    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    buildMenu(): Menu {
        const template = this.buildDarwinTemplate();

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);

        return menu;
    }

    buildDarwinTemplate(): MenuItemConstructorOptions[] {
        const subMenuAbout: DarwinMenuItemConstructorOptions = {
            label: app.name,
            submenu: [
                {
                    label: i18n.t("Hide Gesturea"),
                    accelerator: "Command+H",
                    selector: "hide:",
                },
                {
                    label: i18n.t("Hide Others"),
                    accelerator: "Command+Shift+H",
                    selector: "hideOtherApplications:",
                },
                {
                    label: i18n.t("Show All"),
                    selector: "unhideAllApplications:",
                },
                { type: "separator" },
                {
                    label: i18n.t("Quit Gesturea"),
                    accelerator: "Command+Q",
                    click: () => {
                        app.quit();
                    },
                },
            ],
        };
        const subMenuView: MenuItemConstructorOptions = {
            label: i18n.t("View"),
            submenu: [
                {
                    label: i18n.t("Reload"),
                    accelerator: "Command+R",
                    click: () => {
                        this.mainWindow.webContents.reload();
                    },
                },
                {
                    label: i18n.t("Toggle Full Screen"),
                    accelerator: "Ctrl+Command+F",
                    click: () => {
                        this.mainWindow.setFullScreen(
                            !this.mainWindow.isFullScreen()
                        );
                    },
                },
                {
                    label: i18n.t("Toggle Developer Tools"),
                    accelerator: "Alt+Command+I",
                    click: () => {
                        this.mainWindow.webContents.toggleDevTools();
                    },
                },
            ],
        };
        const subMenuWindow: DarwinMenuItemConstructorOptions = {
            label: i18n.t("Window"),
            submenu: [
                {
                    label: i18n.t("Minimize"),
                    accelerator: "Command+M",
                    selector: "performMiniaturize:",
                },
                {
                    label: i18n.t("Close"),
                    accelerator: "Command+W",
                    selector: "performClose:",
                },
                { type: "separator" },
                {
                    label: i18n.t("Bring All to Front"),
                    selector: "arrangeInFront:",
                },
            ],
        };
        const subMenuLanguage: DarwinMenuItemConstructorOptions = {
            label: i18n.t("Language"),
            submenu: [
                {
                    label: i18n.t("English"),
                    type: "radio",
                    checked: i18n.language === "en",
                    click: () => {
                        i18n.changeLanguage("en");
                    },
                },
                {
                    label: i18n.t("Russian"),
                    type: "radio",
                    checked: i18n.language === "ru",
                    click: () => {
                        i18n.changeLanguage("ru");
                    },
                },
            ],
        };

        return [subMenuAbout, subMenuView, subMenuWindow, subMenuLanguage];
    }
}
