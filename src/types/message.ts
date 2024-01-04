import { type LogLevelName } from "roarr";

export enum EventType {
    Log,
    HomeTable,
}

export type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | { [key: string]: JSONValue };

export interface JSONObject {
    [k: string]: JSONValue;
}
export interface JSONArray extends Array<JSONValue> {}

export interface Message<E extends EventType, T = unknown> {
    event: E;
    data: T;
}

export type LogMessage = Message<
    EventType.Log,
    {
        level: LogLevelName;
        message: string;
        context?: JSONObject;
    }
>;

export function isLogMessage(message: any): message is LogMessage {
    return message.event === EventType.Log;
}
