import { electronApi } from "./main/preload";

declare global {
    interface Window {
        electronAPI: typeof electronApi;
    }
}
