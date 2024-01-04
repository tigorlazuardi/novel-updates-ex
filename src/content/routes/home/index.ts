import { HandlerContext } from "..";
import { Message } from "../../../types/message";
import { log } from "../../log";
import { type ReleaseTable, extractReleaseTable } from "./extract_tables";
import browser from "webextension-polyfill";

export type ReleaseTableMessage = Message<
    "home::release-table",
    ReleaseTable[]
>;

export function handle(_: HandlerContext) {
    const releases = extractReleaseTable(document.body);

    const data: ReleaseTableMessage = {
        event: "home::release-table",
        data: releases,
    };

    browser.runtime.connect().postMessage(data);
}
