import { electronApi } from "./src/main/preload";

declare global {
    interface Window {
        electronAPI: typeof electronApi;
    }
}
