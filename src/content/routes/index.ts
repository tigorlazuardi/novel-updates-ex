import { log } from "../log";

type HandlerContext = {
    path: string;
    handler: Handler;
    match: RegExpMatchArray | null;
};

type PathCallback = (ctx: HandlerContext) => void;

type PathHandler = [RegExp, PathCallback];

class Handler {
    handlers: PathHandler[] = [];

    constructor() {}

    register(path: string | RegExp, handler: PathCallback) {
        if (typeof path === "string") {
            this.handlers.push([new RegExp(`^${path}$`), handler]);
            return;
        }
        this.handlers.push([path, handler]);
    }

    handle(path: string) {
        for (const [re, cb] of this.handlers) {
            if (re.test(path)) {
                cb({ path, handler: this, match: path.match(re) });
                return;
            }
        }
        log("warn", `handler not found for path: ${path}`);
    }
}

export const handler = new Handler();

export function handle() {
    handler.handle(window.location.pathname);
}
