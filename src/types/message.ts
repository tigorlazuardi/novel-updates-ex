import { type LogLevelName } from "roarr";

export interface EventSend {
    log: LogMessage;
}

export interface Message<E extends keyof EventSend, T = unknown> {
    event: E;
    data: T;
}

export type Log = {
    level: LogLevelName;
    message: string;
    context?: unknown;
};

export type LogMessage = Message<"log", Log>;
