import { EventType, JSONObject, LogMessage } from "../types/message";
import browser from "webextension-polyfill";
import { type LogLevelName } from "roarr";

export function log(
    level: LogLevelName,
    message: string,
    context?: JSONObject,
) {
    const data: LogMessage = {
        event: EventType.Log,
        data: {
            level,
            message,
            context,
        },
    };
    browser.runtime.connect().postMessage(data);
}
