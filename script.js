/* MAIN CODE */
let library = [];
function LibraryItem () {
}
LibraryItem.prototype.addToLibrary = function () {
    library.push(this);
}
function Book (title, author, pages, status, timestamp) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
    this.timestamp = timestamp;
}
Book.prototype = Object.create(LibraryItem.prototype);


initAddNewBookButton();
initSortButton();
initModalDialog();
initBookshelf();

/* FUNCTIONS */

// Adds books to bookshelf DOM element
function initBookshelf() {
    addBooksFromStorage();
    const bookshelf = document.querySelector(".bookshelf");
    library.forEach(element => {
        addBookToDOM(element);
    });
}

// Initializes all modal dialogs
function initModalDialog () {
    initSubmitButton();
    initClickToClose();
    initKeyboardInput();
}

// Creates and adds DOM elements for a given book
function addBookToDOM(book) {
    const bookElement = document.createElement("div");
    const remove = document.createElement("div");
    const edit = document.createElement("div");
    const title = document.createElement("div");
    const author = document.createElement("div");
    const pages = document.createElement("div");
    const status = document.createElement("div");

    bookElement.classList.add("book");
    remove.classList.add("remove");
    edit.classList.add("edit");
    edit.classList.add("material-icons")
    title.classList.add("title");
    author.classList.add("author");
    pages.classList.add("pages");
    status.classList.add("status");

    bookElement.appendChild(remove);
    bookElement.appendChild(edit);
    bookElement.appendChild(title);
    bookElement.appendChild(author);
    bookElement.appendChild(pages);
    bookElement.appendChild(status);

    document.querySelector(".bookshelf").appendChild(bookElement);
    bookElement.id = book.timestamp;

    remove.textContent = "+";
    edit.textContent = "edit";
    updateBookInDOM(book);

    remove.onclick = removeBook;
    edit.onclick = editBook;
}

// Overwrites information for a given book
function updateBookInDOM(book) {
    const bookElement = document.querySelector(`[id="${book.timestamp}"]`);
    bookElement.querySelector(".title").textContent = book.title;
    bookElement.querySelector(".author").textContent = book.author;
    if (book.pages > 0) bookElement.querySelector(".pages").textContent = book.pages + " pp";
    if (book.status === "read") {
        bookElement.querySelector(".status").textContent = "Already read";
    } else {
        bookElement.querySelector(".status").textContent = "Not read";
    }
    updateBookInStorage(book);
    clearModalTimestamp();
}



// Removes book from library array and from DOM
function removeBook() {
    const book = this.parentElement;
    for (let i = 0; i < library.length; i++) {
        if (library[i].timestamp.toString() === book.id) {
            removeBookInStorage(library.splice(i,1)[0]);
            break;
        }
    }
    book.remove();
}

// Removes book from local storage
function removeBookInStorage (book) {
    if(storageAvailable("localStorage")) {
        localStorage.removeItem(`${book.timestamp}:title`);
        localStorage.removeItem(`${book.timestamp}:author`);
        localStorage.removeItem(`${book.timestamp}:status`);
        localStorage.removeItem(`${book.timestamp}:pages`);
    }
}

// Adds all books from local storage to the library
function addBooksFromStorage() {
    if (storageAvailable("localStorage")) {
        let books = [];
        let timestamps = [];
        for (let i = 0; i < localStorage.length; i++) {
            const timestamp = localStorage.key(i).split(":")[0];
            if (!timestamps.includes(timestamp)) timestamps.push(timestamp);
        }
        timestamps.forEach(timestamp => {
            const empty = "";
            books.push(new Book(empty, empty, empty, empty, timestamp));
        });
        for (let i = 0; i < localStorage.length; i++) {
            const storageKey = localStorage.key(i);
            const temp = storageKey.split(":");
            const timestamp = temp[0];
            const key = temp[1];
            const value = localStorage.getItem(storageKey);
            
            for (let j = 0; j < books.length; j++) {
                if (books[j].timestamp === timestamp) {
                    books[j][key] = value;
                }
            }
        }
        books.forEach (book => {
            book.addToLibrary();
        });
    }
}

function editBook() {
    setInputs(getBookByTimestamp(this.parentElement.id));
    setSubmitButtonText("UPDATE");
    displayModalDialog();
}

function submit () {
    hideModalDialog();
    const book = getInputs();
    clearInputs();
    if (book.timestamp === "") {
        book.timestamp = Date.now();
        book.addToLibrary();
        addBookToDOM(book);
    } else {
        const existingBook = getBookByTimestamp(book.timestamp);
        existingBook.title = book.title;
        existingBook.author = book.author;
        existingBook.pages = book.pages;
        existingBook.status = book.status;
        existingBook.timestamp = book.timestamp;
        updateBookInDOM(existingBook);
    }
}

// Overwrites a book in local storage
function updateBookInStorage(book) {
    if(storageAvailable("localStorage")) {
        localStorage.setItem(`${book.timestamp}:title`,book.title);
        localStorage.setItem(`${book.timestamp}:author`,book.author);
        localStorage.setItem(`${book.timestamp}:pages`,book.pages);
        localStorage.setItem(`${book.timestamp}:status`,book.status);
    }
}

// Returns array of all books in bookshelf DOM element
function extractBookElements () {
    let books = [];
    const bookshelf = getBookshelfElement();
    while (bookshelf.firstChild) {
        books.push(bookshelf.removeChild(bookshelf.firstChild));
    }
    return books;
}

// Adds books from given array to bookshelf DOM element
function attachBookElements(books) {
    const bookshelf = getBookshelfElement();
    for (let i = 0; i < books.length; i++) {
        bookshelf.appendChild(books[i]);
    }
}

// Gets bookshelf DOM element
function getBookshelfElement () {
    return document.querySelector(".bookshelf");
}


// Sorts bookshelf DOM by selected criterion
function sortBooks() {
    let sorted = extractBookElements();
    switch (getInputSortBy()) {
        case "date":
            sorted.sort( (a,b) => {
                return a.id < b.id ? -1 : 1;
            });
            break;
        case "title":
            sorted.sort( (a,b) => {
                return a.querySelector(".title").textContent < b.querySelector(".title").textContent ? -1 : 1;
            });
            break;
        case "author":
            sorted.sort( (a,b) => {
                return a.querySelector(".author").textContent.split(" ").pop() < b.querySelector(".author").textContent.split(" ").pop() ? -1 : 1;
            });
            break;
        case "unread":
            sorted.sort( (a,b) => {
                const unread = "Not read";
                const read = "Already read";
                if ( a.querySelector(".status").textContent === unread && b.querySelector(".status").textContent === read) {
                    return -1;
                }
                if ( a.querySelector(".status").textContent === read && b.querySelector(".status").textContent === unread) {
                    return 1;
                }
                return 0;
            });
            break;
    }
    attachBookElements(sorted);
}

// Creates sort drop-down
function initSortButton() {
    const sortButton = document.querySelector(".sort");
    sortButton.onchange = sortBooks;
}

// Creates add new book button
function initAddNewBookButton() {
    const addNewBookButton = document.querySelector(".add-new-book-button");
    addNewBookButton.onclick = () => {
        setSubmitButtonText("ADD TO LIBRARY");
        displayModalDialog();
    }
}

// Creates submit button for modal dialogs
function initSubmitButton() {
    const submitButton = document.querySelector(".submit");
    submitButton.onclick = submit;
}

// Creates close button for modal dialogs
function initClickToClose() {
    const modal = document.querySelector(".modal");
    const close = document.querySelector(".close");
    window.onclick = function (event) { // make separate fn
        if (event.target === modal || event.target === close) {
            hideModalDialog();
            clearModalTimestamp();
            clearInputs();
        }
    }
}

// Initializes keyboard inputs to close modal dialogs
function initKeyboardInput() {
    const modal = document.querySelector(".modal");
    window.onkeydown = function (event) { // make separate fn
        if (modal.style.display === "block") {
            if (event.key === "Enter") {
                submit();
            } else if (event.key === "Escape") {
                hideModalDialog();
                clearModalTimestamp();
                clearInputs();
            }
        } 
    }
}

// Returns book item in library based on unique timestamp
function getBookByTimestamp(timestamp) {
    for (let i = 0; i < library.length; i++) {
        if (library[i].timestamp.toString() === timestamp) return library[i];
    }
}

// Sets timestamp (dictated by modal dialog) opening to empty
function clearModalTimestamp() {
    setModalTimestamp("");
}

// Sets timestamp (dictated by modal dialog) to specified value
function setModalTimestamp(timestamp) {
    document.querySelector(".modal").dataset.timestamp = timestamp;
}

// Returns timestamp (dictated by modal dialog)
function getModalTimestamp() {
    let timestamp = document.querySelector(".modal").dataset.timestamp;
    if (typeof(timestamp) === "undefined") timestamp = "";
    return timestamp;
}

// Unhides modal dialog
function displayModalDialog() {
    document.querySelector(".modal").style.display = "block";
}

// Hides modal dialog
function hideModalDialog() {
    document.querySelector(".modal").style.display = "none";
}

// Sets submit button text
function setSubmitButtonText(text) {
    document.querySelector(".submit").textContent = text;
}

// Gets bookshelf sorting criterion
function getInputSortBy() {
    return document.querySelector('select[name="sort"]').value;
}

// Sets all modal dialog inputs to empty/default value
function clearInputs() {
    setInputTitle("");
    setInputAuthor("");
    setInputPages("");
    setInputStatus("read");
}

// Sets all modal dialog inputs to book's values
function setInputs(book) {
    setInputTitle(book.title);
    setInputAuthor(book.author);
    setInputPages(book.pages);
    setInputStatus(book.status);
    setModalTimestamp(book.timestamp);
}

// Returns book object based on inputs
function getInputs() {
    return new Book (getInputTitle(), getInputAuthor(), getInputPages(), getInputStatus(), getModalTimestamp());
}

// Gets input from modal dialog
function getInputTitle() {
    return document.querySelector('input[name="title"]').value;
}

// Gets input from modal dialog
function getInputAuthor() {
    return document.querySelector('input[name="author"]').value;
}

// Gets input from modal dialog
function getInputPages() {
    return document.querySelector('input[name="pages"]').value;
}

// Gets input from modal dialog
function getInputStatus() {
    return document.querySelector('select[name="status"]').value;
}

// Sets modal dialog input to specified string
function setInputTitle(text) {
    document.querySelector('input[name="title"]').value = text;
}

// Sets modal dialog input to specified string
function setInputAuthor(text) {
    document.querySelector('input[name="author"]').value = text;
}

// Sets modal dialog input to specified string
function setInputPages(text) {
    document.querySelector('input[name="pages"]').value = text;
}

// Sets modal dialog input to specified string
function setInputStatus(text) {
    document.querySelector('select[name="status"]').value = text;
}


// Checks if local storage is available
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}