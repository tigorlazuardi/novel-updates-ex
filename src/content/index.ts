const bgPort = browser.runtime.connect({ name: "content" });

bgPort.postMessage({ message: "Hello from content script" });
