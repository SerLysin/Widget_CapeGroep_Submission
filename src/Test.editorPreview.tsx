import { ReactElement, createElement } from "react";
import { TestPreviewProps } from "../typings/TestProps";

export function preview({  }: TestPreviewProps): ReactElement {
    return <div></div>;
}

export function getPreviewCss(): string {
    return require("./ui/Test.css");
}

  