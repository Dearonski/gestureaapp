import { ButtonProps } from "./Button.props";

export const Button: React.FC<ButtonProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <button
            className={`${className} p-2 bg-indigo-600 rounded-xl text-white hover:bg-indigo-700 transition-colors focus-visible:outline-none focus-visible:outline focus-visible:outline-white focus-visible:outline-offset-4`}
            {...props}
        >
            {children}
        </button>
    );
};
