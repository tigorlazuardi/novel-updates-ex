import browser from "webextension-polyfill";
import { isLogMessage } from "../types/message";
import { log } from "./log";

log("info", "Background Script Loaded");

function handleLog(message: any) {
    if (isLogMessage(message)) {
        log(message.data.level, message.data.message, message.data.context);
    }
}

browser.runtime.onConnect.addListener((client) => {
    client.onMessage.addListener(handleLog);
});

export {};
