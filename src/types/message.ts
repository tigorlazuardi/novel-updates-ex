import { type LogLevelName } from "roarr";
import { ReleaseTableMessage } from "../content/routes/home";
import { ReleaseTableImageFetchMessage } from "../background/handlers/home";

export interface EventMap {
    log: LogMessage;
    ["home::release-table"]: ReleaseTableMessage;
    ["home::release-table::cover-image"]: ReleaseTableImageFetchMessage;
}

export interface Message<E extends keyof EventMap, T = unknown> {
    event: E;
    data: T;
}

export type Log = {
    level: LogLevelName;
    message: string;
    context?: unknown;
};

export type LogMessage = Message<"log", Log>;
