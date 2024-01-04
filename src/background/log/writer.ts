import { Message, getLogLevelName, LogLevelName } from "roarr";

const logMethods = {
    debug: console.log.bind(console),
    error: console.error.bind(console),
    fatal: console.error.bind(console),
    info: console.log.bind(console),
    trace: console.log.bind(console),
    warn: console.log.bind(console),
};

const logLevelColors: {
    [key in LogLevelName]: { backgroundColor: string; color: string };
} = {
    debug: {
        backgroundColor: "#712bde",
        color: "#fff",
    },
    error: {
        backgroundColor: "#f05033",
        color: "#fff",
    },
    fatal: {
        backgroundColor: "#f05033",
        color: "#fff",
    },
    info: {
        backgroundColor: "#3174f1",
        color: "#fff",
    },
    trace: {
        backgroundColor: "#666",
        color: "#fff",
    },
    warn: {
        backgroundColor: "#f5a623",
        color: "#000",
    },
};

const namespaceColors: {
    [key in LogLevelName]: { color: string };
} = {
    debug: {
        color: "#8367d3",
    },
    error: {
        color: "#ff1a1a",
    },
    fatal: {
        color: "#ff1a1a",
    },
    info: {
        color: "#3291ff",
    },
    trace: {
        color: "#999",
    },
    warn: {
        color: "#f7b955",
    },
};

export function writer(message: string) {
    const payload = JSON.parse(message) as Message;

    const {
        logLevel: numericLogLevel,
        namespace,
        ...context
    } = payload.context;

    const logLevelName = getLogLevelName(Number(numericLogLevel));

    const logMethod = logMethods[logLevelName];

    const logColor = logLevelColors[logLevelName];

    const styles = `
        background-color: ${logColor.backgroundColor};
        color: ${logColor.color};
        font-weight: bold;
      `;

    const namespaceStyles = `
        color: ${namespaceColors[logLevelName].color};
      `;

    const resetStyles = `
        color: inherit;
      `;

    if (Object.keys(context).length > 0) {
        logMethod(
            `%c ${logLevelName} %c${
                namespace ? ` [${String(namespace)}]:` : ""
            }%c ${payload.message} %O`,
            styles,
            namespaceStyles,
            resetStyles,
            context,
        );
    } else {
        logMethod(
            `%c ${logLevelName} %c${
                namespace ? ` [${String(namespace)}]:` : ""
            }%c ${payload.message}`,
            styles,
            namespaceStyles,
            resetStyles,
        );
    }
}
