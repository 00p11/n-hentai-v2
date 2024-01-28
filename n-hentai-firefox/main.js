console.log("v2 loaded!")


class Entry {
    constructor(id, title1, title2, parodies, characters, tags, artists, groups, languages, categories, pages, uploaded, cover) {
        this.id = id
        this.title1 = title1
        this.title2 = title2
        this.parodies = parodies
        this.characters = characters
        this.tags = tags
        this.artists = artists
        this.groups = groups
        this.languages = languages
        this.categories = categories
        this.pages = pages
        this.uploaded = uploaded
        this.cover = cover
    }

    constructFromPage() {
        try {
            this.id = this.getId()
    
            const titles = this.getTitles();
            this.title1 = titles["title1"];
            this.title2 = titles["title2"];
    
            const tagInfo = this.getInfoFromTagSection();
            this.parodies = tagInfo["Parodies"];
            this.characters = tagInfo["Characters"];
            this.tags = tagInfo["Tags"];
            this.artists = tagInfo["Artists"];
            this.groups = tagInfo["Groups"];
            this.languages = tagInfo["Languages"];
            this.categories = tagInfo["Categories"];
            this.pages = parseInt(tagInfo["Pages"][0]);
            this.uploaded = tagInfo["Uploaded"];

            this.cover = this.getCover()

            popup.info("Data grabed sucefusly", titles["title1"]["before"] + " " + titles["title1"]["pretty"] + " " + titles["title1"]["after"])
        } catch(err) {
            popup.error("Error", err, 5000)
            console.error(err)
        }
    }

    getId() {
        const info = document.getElementById('info')
        const gallery_id = document.getElementById('gallery_id')
        const id = parseInt(gallery_id.textContent.split("#")[1])
        return id;
    }

    getTitles() {
        const info = document.getElementById("info");

        let title1 = info.querySelector('h1.title');
        if (title1) {
            const beforeSpan = title1.querySelector('span.before');
            const prettySpan = title1.querySelector('span.pretty');
            const afterSpan = title1.querySelector('span.after');

            const beforeText = beforeSpan.textContent.trim();
            const prettyText = prettySpan.textContent.trim();
            const afterText = afterSpan.textContent.trim();

            title1 = { before: beforeText, pretty: prettyText, after: afterText }
        } else {title1 = undefined}

        let title2 = info.querySelector('h2.title');
        if (title2) {
            const beforeSpan = title2.querySelector('span.before');
            const prettySpan = title2.querySelector('span.pretty');
            const afterSpan = title2.querySelector('span.after');

            const beforeText = beforeSpan.textContent.trim();
            const prettyText = prettySpan.textContent.trim();
            const afterText = afterSpan.textContent.trim();

            title2 = { before: beforeText, pretty: prettyText, after: afterText }
        } else {title2 = undefined};
        return {title1: title1, title2: title2};
    }   

    getInfoFromTagSection() {
        const tagsSection = document.getElementById("tags");
        if (tagsSection) {
            const tagContainer = tagsSection.querySelectorAll('div.tag-container.field-name:not(.hidden)');
            const tagGroups = {};
            tagContainer.forEach(tagContainer => {
                const categoryName = tagContainer.textContent.trim().split(':')[0].trim();
                const tags = [];

                if (categoryName == "Uploaded") {
                    const time = tagContainer.querySelector("time").dateTime
                    tagGroups[categoryName] = time;
                } else {
                    tagContainer.querySelectorAll('span.tags a.tag').forEach( tag => {
                        const tagName = tag.querySelector('span.name').textContent;
                        tags.push(tagName);
                    });
                    tagGroups[categoryName] = tags;
                }
                
            })
            return tagGroups;
        }
    }

    getCover() {
        const div = document.querySelector('div#cover');
        const img = div.querySelector('img')
        img.addEventListener('load', () => {
            const imgUrl = img.src;
            const id = parseInt(imgUrl.split('/')[4]);
            return {url: imgUrl, id: id};
        })
    }
}


class Popup {
    constructor() {
        this.popup = document.createElement('div');
    }

    error(title, text, duration = 2500, clickToHide = true, posTop = 0, posLeft = 0) {
        this.pop(title, text, posTop, posLeft, false, false, "#030303bd", "red", "1px solid red")
        this.show(duration, clickToHide)
    }

    info(title, text, duration = 2500, clickToHide = true, posTop = 0, posLeft = 0) {
        this.pop(title, text, posTop, posLeft)
        this.show(duration, clickToHide)
    }

    pop(title, text, posTop, posLeft, translateX = false, translateY = false, backgroundColor = "#030303bd", color = "white", border = "1px solid #ed2553") {
        this.popup.id = 'myPopup';
        this.popup.innerHTML = `
        <h2>`+ title +`</h2>
        <p>`+ text +`</p>
        `

        this.popup.style.cssText = 'position: fixed; top: '+ posTop +'%; left: '+ posLeft +'%; background-color: '+ backgroundColor +'; color: '+ color +'; font-family: Noto Sans,sans-serif; border: '+ border +'; border-radius: 8px; padding: 20px;';
        this.popup.style.display = 'none'
        if (translateX == true) {
            this.popup.transform = 'translateX(-50%)'
        }
        if (translateY == true) {
            this.popup.transform = 'translateY(-50%)'
        }

        document.body.appendChild(this.popup);
    }

    
    show(duration = 2500, clickToHide = true) {
        this.popup.style.display = 'block';
        if (clickToHide) { this.popup.addEventListener("click", ()=> { this.hide() }) }
        setTimeout(() => {
            this.hide();
        }, duration)
    }

    hide() {
        this.popup.style.display = 'none'
    }
}

// Firefox, change for chromium
async function saveEntry() {
    const response = await browser.runtime.sendMessage({ action: "saveEntry", value: entry });
    console.log(response)
    if (response.success == true && response.reason == "saved") {
        popup.info("Entry saved", "Entry " + entry.title1.before + " " + entry.title1.pretty + " " + entry.title1.after + " saved successfully!");
    } else if (response.success === false && response.reason === "duplicate") {
        popup.error("Duplicate", "The entry you tried to save is a duplicate.");
    } else if (response.success === true && response.reason === "updated") {
        popup.info("Entry updated", "The entry you tried to save is a duplicate.");
    } else {
        popup.error("Unknown response:", response);
    }
}

async function setLocalStorage(key, value) {
    browser.runtime.sendMessage({
        action: "setData",
        key: key,
        value: value
    })
}
async function getLocalStorage(key) {
    browser.runtime.sendMessage({
        action: "getData",
        key: key
    })
}

// Key bindings
addEventListener('keydown', (e) => {
    if (e.key === "n" || e.key === "N") { saveEntry() };
})


function init() {
    entry.constructFromPage()
    console.log(entry)
}

const entry = new Entry()
const popup = new Popup()

init()