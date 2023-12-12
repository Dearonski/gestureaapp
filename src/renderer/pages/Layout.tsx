import { useEffect } from "react";
import i18n from "../i18n";

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    useEffect(() => {
        window.electronAPI.requestLanguage();
    }, []);

    useEffect(() => {
        window.electronAPI.responseLanguage((lng: string) => {
            i18n.changeLanguage(lng);
        });
    }, [window.electronAPI.responseLanguage]);

    useEffect(() => {
        window.electronAPI.onUpdateLanguage((lng: string) => {
            i18n.changeLanguage(lng);
        });
    }, [window.electronAPI.onUpdateLanguage]);

    return (
        <div className="bg-zinc-900 overflow-hidden">
            <h1 className="pointer-events-none text-white text-center py-1 font-medium text-sm titleBar">
                Gesturea
            </h1>
            <div className="bg-zinc-800 rounded-t-xl p-5 h-[calc(100vh-28px)]">
                {children}
            </div>
        </div>
    );
};
