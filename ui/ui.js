let entries = []

const headers = [
    {
        id: 'id',
        name: 'ID',
        visible: true
    },
    {
        id: 'title1',
        name: 'Title',
        visible: true
    },
    {
        id: 'title2',
        name: 'Alt. Title',
        visible: true
    },
    {
        id: 'parodies',
        name: 'Parodies',
        visible: true
    },
    {
        id: 'characters',
        name: 'Characters',
        visible: true
    },
    {
        id: 'tags',
        name: 'Tags',
        visible: true
    },
    {
        id: 'artists',
        name: 'Artists',
        visible: true
    },
    {
        id: 'groups',
        name: 'Groups',
        visible: true
    },
    {
        id: 'languages',
        name: 'Languages',
        visible: true
    },
    {
        id: 'categories',
        name: 'Categories',
        visible: true
    },
    {
        id: 'pages',
        name: 'Pages',
        visible: true
    },
    {
        id: 'uploaded',
        name: 'Uploaded',
        visible: true
    },
    {
        id: 'cover',
        name: 'Cover',
        visible: true
    },
    {
        id: 'favorite',
        name: 'Favorite',
        visible: true
    },
    {
        id: 'rating',
        name: 'Rating',
        visible: true
    },
    {
        id: 'note',
        name: 'Note',
        visible: true
    },
    {
        id: 'remove',
        name: 'Remove',
        visible: true
    }
];


class Entry {
    constructor(id, title1, title2, parodies, characters, tags, artists, groups, languages, categories, pages, uploaded, cover, favorite, rating, note) {
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
        // Fancy
        this.favorite = favorite
        this.rating = rating
        this.note = note
    }

    createRow(optionalHeaders) {
        const tableBody = document.getElementById('tableBody')
        const row = tableBody.appendChild(createElement('tr', { 'class': 'row' ,'id': this.id }))
        for (let i = 0; i < optionalHeaders.length; i++) {
            if (optionalHeaders[i].visible) {
                const headerID = optionalHeaders[i].id
                switch (headerID) {
                    case 'id':
                        var cell = row.appendChild(createElement('td', { 'class': headerID }))
                        cell.appendChild(createElement('a', { 'href': 'https://nhentai.net/g/' + this.id + '/' }, this.id))
                        break;
                
                    case 'title1':
                    case 'title2':
                        var cell = row.appendChild(createElement('td', { 'class': headerID }))
                        if (this[headerID]) {
                            cell.appendChild(createElement('span', { 'class': 'before'}, this[headerID].before + " "))
                            cell.appendChild(createElement('span', { 'class': 'pretty'}, this[headerID].pretty + " "))
                            cell.appendChild(createElement('span', { 'class': 'after'}, this[headerID].after))
                        }
                        break;

                    case 'parodies':
                    case 'characters':
                    case 'tags':
                    case 'artists':
                    case 'groups':
                    case 'languages':
                    case 'categories':
                        if (!this[headerID]) {
                            if (headerID != 'tags') {
                                this[headerID] = ['original']
                            } else {
                                this[headerID] = []
                        }}

                        var cell = row.appendChild(createElement('td', { 'class': headerID }))
                        this[headerID].forEach((element) => {
                            cell.appendChild(createElement('span', {}, element))
                        })
                        break;
                    
                    case 'pages':
                        var cell = row.appendChild(createElement('td', { 'class': headerID }))
                        cell.appendChild(createElement('span', {}, this[headerID]))
                        break;
                        
                    case 'uploaded':
                        var cell = row.appendChild(createElement('td', { 'class': headerID }))
                        const date = new Date(this[headerID])
                        cell.appendChild(createElement('span', {}, date.toLocaleDateString()))
                        break;

                    case 'cover':
                        var cell = row.appendChild(createElement('td', { 'class': headerID }))
                        cell.appendChild(createElement('img', { 'src': this[headerID].url, 'style': 'height: 10rem;'}))
                        break;

                    case 'favorite': 
                        var cell = row.appendChild(createElement('td', { 'class': headerID }))
                        if (!this[headerID]) {this[headerID] = false}
                        var span = cell.appendChild(createElement('span', {}, this[headerID]))
                        cell.addEventListener('click', ()=> {
                            this[headerID] = !this[headerID]
                            span.innerHTML = this[headerID]
                            this.saveData()
                        })
                        break;

                    case 'rating':
                        var cell = row.appendChild(createElement('td', { 'class': headerID }))
                        const inputRating = cell.appendChild(createElement('input', {'type': 'number', 'min': '1', 'max': '10', 'step': '1', 'value': this[headerID]}))
                        const ratingFunction = () => {
                            var value = inputRating.value
                            if (value == '') {value = ''} else if (value < 1) {value = 1} else if (value > 10) {value = 10}
                            this[headerID] =  value
                            inputRating.value = value
                            this.saveData()
                        }
                        cell.addEventListener('focusout', () => {ratingFunction()})
                        cell.addEventListener('click', () => {ratingFunction()})
                        break;

                    case 'note': 
                        var cell = row.appendChild(createElement('td', { 'class': headerID }))
                        if (!this[headerID] || this[headerID] == undefined) { this[headerID] = '' }
                        var inputNotes = cell.appendChild(createElement('input', {'type': 'text', 'value': this[headerID]}))
                        const noteFunction = () => {
                            var value = inputNotes.value
                            this[headerID] =  value
                            inputNotes.value = value
                            this.saveData()
                        }
                        cell.addEventListener('focusout', () => {noteFunction()})
                        cell.addEventListener('click', () => {noteFunction()})
                        break;


                    case 'remove':
                        var cell = row.appendChild(createElement('td', { 'class': headerID }))
                        cell.appendChild(createElement('remove', {}, headerID))
                        cell.addEventListener('click', () => {
                            console.log('Dober')
                            for (let k = 0; k < entries.length; k++) {
                                console.log(entries[k].id)
                                if (entries[k].id == this.id) {
                                    console.log(entries[k])
                                    entries.splice(k, 1)
                                    row.style.display = 'none'
                                    this.saveData()
                                }
                            }
                        })
                        break;
                        
                }
            }
        }
    }

    async saveData() {
        // Optimaze
        await browser.runtime.sendMessage({ action: "setEntries", value: entries })
    }
    
}


function initSearch() {
    const search = document.getElementById('search')
    search.addEventListener('input', handleSearch)
}

function handleSearch() {
    const search = document.getElementById('search')
    const searchValue = search.value.toLowerCase()
    entries.forEach(entry => { 
        const title = entry.title1.pretty.toLowerCase()
        const element = document.getElementById(entry.id);
        if (title.includes(searchValue)) {
            console.log(title);
            element.style.display = 'table-row';

            // TO FIX
            // const regex = new RegExp(searchValue, 'gi');
            // console.log(regex)
            // const highlightedText = entry.innerHTML.replace(regex, match => `<span class="highlighted">${match}</span>`);
            
        } else {
            element.style.display = 'none';
            element.querySelectorAll('.highlighted').forEach(element => {element.classList.remove('highlighted')})
        }
        if (searchValue == '') {
            element.style.display = 'table-row';
            element.querySelectorAll('.highlighted').forEach(element => {element.classList.remove('highlighted')})
        }
    })
}

initSearch()


function createRows() {
    entries.forEach(entry => {
        entry.createRow(headers)
    });
}

function createHeaders(optionalHeaders = [{name: 'Alt. Title', id: 'title2', visible: true}, {name: 'Parodies', id: 'parodies', visible: true}]) {
    const tableHeaders = document.getElementById("tableHeaders")
    for (let i = 0; i < optionalHeaders.length; i++) {
        if (optionalHeaders[i].visible == true) {
            tableHeaders.appendChild(createElement('th', { 'id': optionalHeaders[i].id}, optionalHeaders[i].name));
        }
    }
}

function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    for (const [attr, value] of Object.entries(attributes)) { // Realy usefull line of cod
        element.setAttribute(attr, value);
    } 
    element.innerHTML = content;
    return element;
}

function convertEntries(rawEntries) {
    const convertedEntries = [];
    entries.forEach((element) => {
        if (!(element instanceof Entry)) {
            const { id, title1, title2, parodies, characters, tags, artists, groups, languages, categories, pages, uploaded, cover, favorite, rating, note } = element; // Realy usefull line of code
            const entry = new Entry(id, title1, title2, parodies, characters, tags, artists, groups, languages, categories, pages, uploaded, cover, favorite, rating, note);

            convertedEntries.push(entry);
        } else if (element instanceof Entry) {
            convertedEntries.push(element);
        }
    })
    return convertedEntries;
}


async function init() {
    const messageResponse = await browser.runtime.sendMessage({ action: "getEntries" });
    if (messageResponse.succes == true && messageResponse.value != undefined) {
        entries = messageResponse.value;
        entries = convertEntries(entries);

        createHeaders(headers);
        createRows();
    } else if (messageResponse.value == undefined) {
        console.log("No entries saved")
    } 

}

init()

// function createElement(apedTo, tag, innerHTML) {
//     const element = apedTo.appendChild(document.createElement(tag))
//     element.innerHTML = innerHTML
// }