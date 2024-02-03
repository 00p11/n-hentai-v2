browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("Received message:", message);
    if (message.action == "saveEntry") {
        try {
            let entries = await getLocalStorage("entries");
            if (!entries) { entries = [] };
            for (let i = 0; i < entries.length; i++) {
                // Checks if duplicate
                if (JSON.stringify(message.value) == JSON.stringify(entries[i])) {
                    console.log("Duplicate")
                    return ({ success: false, reason: "duplicate" });
                } else if (message.value.id == entries[i].id) {
                    console.log("Updated")
                    entries[i] = message.value
                    await setLocalStorage("entries", entries);
                    return ({ success: true, reason: "updated" });
                }
            }
            entries.push(message.value);

            await setLocalStorage("entries", entries);

            return ({ success: true, reason: "saved" });
        } catch (error) {
            console.error("Error:", error);
            return ({ success: false, reason: "error", error: error.message });
        }

    // Get and set entries
    } else if (message.action == "getEntries") {
        try {
            const value = await getLocalStorage('entries');
            return ({ succes: true, reason: 'dataGet', value: value });
        } catch (error) {
            return ({ succes: false, reason: 'error', error: error.message })
        }
    } else if (message.action == "setEntries") {
        try {
            const value = message.value;
            setLocalStorage('entries', value);
            return ({ succes: true, reason: 'dataSet' });
        } catch (error) {
            return ({ succes: false, reason: 'error', error: error.message });
        }
    }
        
    return ({ success: false, reason: "unknown action"});
});

async function setLocalStorage(key, value) {
    try {
        await browser.storage.local.set({ [key]: value });
    } catch (error) {
        console.error("Error saving data:", error);
        throw error; 
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
