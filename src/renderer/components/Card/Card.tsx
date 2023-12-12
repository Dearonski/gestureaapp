import { CardProps } from "./Card.props";

export const Card: React.FC<CardProps> = ({ className, children }) => {
    return (
        <div
            className={`rounded-xl border-2 p-3 shadow-xl border-zinc-700 bg-zinc-800 ${className}`}
        >
            {children}
        </div>
    );
};
