import { useTranslation } from "react-i18next";
import { CheckBoxProps } from "./CheckBox.props";

export const CheckBox: React.FC<CheckBoxProps> = ({
    className,
    title,
    ...props
}) => {
    const { t } = useTranslation(["main"]);

    return (
        <div
            className={`grid items-center grid-cols-[auto_72px] gap-x-3 ${className}`}
            {...props}
        >
            <h3 className="text-white font-medium">{t(title)}</h3>
            <label className={`w-full relative items-center cursor-pointer`}>
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-[72px] h-10 bg-zinc-700 peer-checked:bg-indigo-600 rounded-full transition-colors peer after:content-[''] after:w-8 after:h-8 after:bg-white after:absolute after:rounded-full after after:top-1 after:left-1 peer-checked:after:translate-x-full after:transition-transform peer-focus-visible:outline-none peer-focus-visible:outline peer-focus-visible:outline-white peer-focus-visible:outline-offset-4"></div>
            </label>
        </div>
    );
};
