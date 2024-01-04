import { LogMessage } from "../types/message";
import browser from "webextension-polyfill";
import { type LogLevelName } from "roarr";
import { contentEvent } from "./events";

export function log<T = unknown>(
    level: LogLevelName,
    message: string,
    context?: T,
) {
    const data: LogMessage = {
        event: "log",
        data: {
            level,
            message,
            context,
        },
    };
    contentEvent.emit(data);
}
