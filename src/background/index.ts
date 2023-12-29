browser.runtime.onConnect.addListener((client) => {
    client.onMessage.addListener(console.log);
});

export {};
