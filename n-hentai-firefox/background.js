browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action == "saveEntry") {
        try {
            console.log("Received message from content script:", message);

            let entries = await getLocalStorage("entries");
            if (!entries) { entries = [] };
            for (let i = 0; i < entries.length; i++) {
                // Checks if duplicate
                if (JSON.stringify(message.value) == JSON.stringify(entries[i])) {
                    console.log("Duplicate")
                    sendResponse({ success: false, reason: "duplicate" })
                    return;
                } else if (message.value.id == entries[i].id) {
                    console.log("Updated")
                    entries[i] = message.value
                    await setLocalStorage("entries", entries);
                    sendResponse({ success: true, reason: "updated" })
                    return;
                }
            }
            entries.push(message.value);

            await setLocalStorage("entries", entries);

            sendResponse({ success: true, reason: "saved" });
        } catch (error) {
            console.error("Error:", error);
            sendResponse({ success: false, reason: "error", error: error.message });
        }
    }
});

async function setLocalStorage(key, value) {
    try {
        await browser.storage.local.set({ [key]: value });
    } catch (error) {
        console.error("Error saving data:", error);
        throw error; // Rethrow the error to propagate it
    }
}

async function getLocalStorage(key) {
    try {
        const result = await browser.storage.local.get(key);
        return result[key];
    } catch (error) {
        console.error("Error retrieving data:", error);
        throw error; // Rethrow the error to propagate it
    }
}
