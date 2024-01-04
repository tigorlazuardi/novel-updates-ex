import { HandlerContext } from "..";
import { Message } from "../../../types/message";
import { log } from "../../log";
import { type ReleaseTable, extractReleaseTable } from "./extract_tables";
import browser from "webextension-polyfill";

export type ReleaseTableMessage = Message<"releaseTable", ReleaseTable[]>;

export function handle(_: HandlerContext) {
    const releases = extractReleaseTable(document.body);

    const data: ReleaseTableMessage = {
        event: "releaseTable",
        data: releases,
    };

    log("info", "sending release table", releases);
    browser.runtime.connect().postMessage(data);
}
