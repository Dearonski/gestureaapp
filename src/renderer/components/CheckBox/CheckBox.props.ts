import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface CheckBoxProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
}
