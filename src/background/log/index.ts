import { LogLevelName, ROARR, Roarr } from "roarr";
import { JSONObject } from "../../types/message";
import { writer } from "./writer";

ROARR.write = writer;

export function log(
    level: LogLevelName,
    message: string,
    context?: JSONObject,
) {
    switch (level) {
        case "debug":
            if (context) Roarr.info(context, message);
            else Roarr.info(message);
            break;
        case "info":
            if (context) Roarr.info(context, message);
            else Roarr.info(message);
            break;
        case "warn":
            if (context) Roarr.warn(context, message);
            else Roarr.warn(message);
            break;
        case "error":
            if (context) Roarr.error(context, message);
            else Roarr.error(message);
            break;
        case "fatal":
            if (context) Roarr.fatal(context, message);
            else Roarr.fatal(message);
            break;
        default:
            if (context) Roarr.info(context, message);
            else Roarr.info(message);
            break;
    }
}
