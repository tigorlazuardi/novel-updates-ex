import { bgEvent } from "../events";

bgEvent.on("home::release-table", (message) => {
    console.log(message);
});

export {};
