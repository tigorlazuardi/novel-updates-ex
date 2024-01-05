import { HandlerContext } from "..";
import { Message } from "../../../types/message";
import { contentEvent } from "../../events";
import { type ReleaseTable, extractReleaseTable } from "./extract_tables";
import "./augment_tables";

export type ReleaseTableMessage = Message<
    "home::release-table",
    ReleaseTable[]
>;

export function handle(_: HandlerContext) {
    const content = document.querySelector(
        ".l-submain-h",
    ) as HTMLElement | null;
    if (content) {
        content.style.maxWidth = "100vw";
    }
    const releases = extractReleaseTable(document.body);

    const data: ReleaseTableMessage = {
        event: "home::release-table",
        data: releases,
    };

    contentEvent.emit(data);
}
