import browser from "webextension-polyfill";
import { EventSend } from "../types/message";

export class EventHandler {
    private handlers: Map<keyof EventSend, ((message: any) => void)[]> =
        new Map();

    constructor() {
        browser.runtime.onMessage.addListener((message) =>
            this.handle(message),
        );
    }

    private handle(message: any) {
        const handlers = this.handlers.get(message.event);
        if (!handlers) {
            return;
        }
        handlers.forEach((handler) => handler(message));
    }

    /**
     * on adds a callback to the event handler
     */
    on<E extends keyof EventSend>(
        event: E,
        callback: (message: EventSend[E]) => void,
    ) {
        const handlers = this.handlers.get(event) || [];
        handlers.push(callback);
        this.handlers.set(event, handlers);
    }

    /**
     * once adds a callback to the event handler that will be removed after
     * completion
     */
    once<E extends keyof EventSend>(
        event: E,
        callback: (message: EventSend[E]) => void,
    ) {
        const handler = (message: EventSend[E]) => {
            callback(message);
            this.off(event, handler);
        };
        this.on(event, handler);
    }

    /**
     * off removes a callback from the event handler
     */
    off<E extends keyof EventSend>(
        event: E,
        callback: (message: EventSend[E]) => void,
    ) {
        const handlers = this.handlers.get(event) || [];
        const index = handlers.indexOf(callback);
        if (index > -1) {
            handlers.splice(index, 1);
        }
    }

    /**
     * emit send a message to the content script
     */
    async emit(message: EventSend[keyof EventSend]) {
        browser.runtime.connect().postMessage(message);
    }
}

export const contentEvent = new EventHandler();
