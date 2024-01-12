const printers = {
    debug: console.log.bind(console),
    error: console.error.bind(console),
    fatal: console.error.bind(console),
    info: console.log.bind(console),
    trace: console.log.bind(console),
    warn: console.log.bind(console),
};

type LogLevelName = keyof typeof printers;

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

export function log(level: LogLevelName, message: string, ...context: any[]) {
    const printer = printers[level];
    const color = logLevelColors[level];

    const style = `
        background-color: ${color.backgroundColor};
        color: ${color.color};
        font-weight: bold;
    `;

    const nuexStyle = `
        background-color: ${logLevelColors.info.backgroundColor};
        color: ${logLevelColors.info.color};
        font-weight: bold;
    `;

    const resetStyle = `
        color: inherit;
      `;

    printer(
        `%c NUEX %c %c ${level} %c ${message}`,
        nuexStyle,
        resetStyle,
        style,
        resetStyle,
        ...context,
    );
}
