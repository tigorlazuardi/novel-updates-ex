import browser from "webextension-polyfill";

console.log("Background Script Loaded");

browser.runtime.onConnect.addListener((client) => {
    client.onMessage.addListener(console.log);
});

export {};
