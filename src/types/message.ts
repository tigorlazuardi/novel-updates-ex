import { type LogLevelName } from "roarr";
import { ReleaseTableMessage } from "../content/routes/home";

export interface EventMap {
    log: LogMessage;
    releaseTable: ReleaseTableMessage;
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
