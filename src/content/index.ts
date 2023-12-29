import browser from "webextension-polyfill";

document.body.style.border = "5px solid red !important";

const bgPort = browser.runtime.connect({ name: "content" });

bgPort.postMessage({ message: "Hello from content script" });

window.addEventListener("click", notifyExtension);

function notifyExtension(e: any) {
    if (e.target.tagName !== "A") {
        return;
    }
    const bgPort = browser.runtime.connect({ name: "content" });
    bgPort.postMessage({ url: e.target.href });
}
