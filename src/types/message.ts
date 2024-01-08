import { type LogLevelName } from "roarr";
import { ReleaseTableMessage } from "../content/routes/home";
import { ReleaseTableDetailResponse } from "../background/handlers/home";

export interface EventMap {
    log: LogMessage;
    ["home::release-table::fetch-details::request"]: ReleaseTableMessage;
    ["home::release-table::fetch-details::response"]: ReleaseTableDetailResponse;
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
