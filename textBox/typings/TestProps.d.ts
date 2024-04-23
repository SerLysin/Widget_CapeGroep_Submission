/**
 * This file was generated from Test.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, EditableValue } from "mendix";

export interface TestContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    initialGreeting: string;
    userInput?: EditableValue<string>;
    result: EditableValue<string>;
    systemResponse?: EditableValue<string>;
    onUserInputChange?: ActionValue;
}

export interface TestPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    initialGreeting: string;
    userInput: string;
    result: string;
    systemResponse: string;
    onUserInputChange: {} | null;
}
