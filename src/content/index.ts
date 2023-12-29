async function main() {
    await browser.runtime.sendMessage("Content Script is Loaded");
}

main();
