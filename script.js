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


const book1 = new Book ("The Martian", "Andy Weir", 369, "read", Date.now()-1);
const book2 = new Book ("Sapiens", "Yuval Noah Harari", 443, "not read", Date.now());
book1.addToLibrary();
book2.addToLibrary();
initBookshelf();


/* FUNCTIONS */
function initBookshelf() {
    const bookshelf = document.querySelector(".bookshelf");
    library.forEach(element => {
        addBookToDOM(element);
    });
}

function initModalDialog () {
    initSubmitButton();
    initClickToClose();
    initKeyboardInput();
}

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

    remove.textContent = "\u00d7";
    edit.textContent = "edit";
    updateBookInDOM(book);

    remove.onclick = removeBook;
    edit.onclick = editBook;
}


// Removes book from library array and from DOM
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
    clearModalTimestamp();
}

function removeBook() {
    const book = this.parentElement;
    for (let i = 0; i < library.length; i++) {
        if (library[i].timestamp.toString() === book.id) {
            library.splice(i,1);
            break;
        }
    }
    book.remove();
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

function extractBookElements () {
    let books = [];
    const bookshelf = getBookshelfElement();
    while (bookshelf.firstChild) {
        books.push(bookshelf.removeChild(bookshelf.firstChild));
    }
    return books;
}

function attachBookElements(books) {
    const bookshelf = getBookshelfElement();
    for (let i = 0; i < books.length; i++) {
        bookshelf.appendChild(books[i]);
    }
}

function getBookshelfElement () {
    return document.querySelector(".bookshelf");
}


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


function initSortButton() {
    const sortButton = document.querySelector(".sort");
    sortButton.onchange = sortBooks;
}

function initAddNewBookButton() {
    const addNewBookButton = document.querySelector(".add-new-book-button");
    addNewBookButton.onclick = () => {
        setSubmitButtonText("ADD TO LIBRARY");
        displayModalDialog();
    }
}
function initSubmitButton() {
    const submitButton = document.querySelector(".submit");
    submitButton.onclick = submit;
}
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


function getBookByTimestamp(timestamp) {
    for (let i = 0; i < library.length; i++) {
        if (library[i].timestamp.toString() === timestamp) return library[i];
    }
}
function clearModalTimestamp() {
    setModalTimestamp("");
}
function setModalTimestamp(timestamp) {
    document.querySelector(".modal").dataset.timestamp = timestamp;
}
function getModalTimestamp() {
    let timestamp = document.querySelector(".modal").dataset.timestamp;
    if (typeof(timestamp) === "undefined") timestamp = "";
    return timestamp;
}
function displayModalDialog() {
    document.querySelector(".modal").style.display = "block";
}
function hideModalDialog() {
    document.querySelector(".modal").style.display = "none";
}
function setSubmitButtonText(text) {
    document.querySelector(".submit").textContent = text;
}

function getInputSortBy() {
    return document.querySelector('select[name="sort"]').value;
}

function clearInputs() {
    setInputTitle("");
    setInputAuthor("");
    setInputPages("");
    setInputStatus("read");
}
function setInputs(book) {
    setInputTitle(book.title);
    setInputAuthor(book.author);
    setInputPages(book.pages);
    setInputStatus(book.status);
    setModalTimestamp(book.timestamp);
}
function getInputs() {
    return new Book (getInputTitle(), getInputAuthor(), getInputPages(), getInputStatus(), getModalTimestamp());
}
function getInputTitle() {
    return document.querySelector('input[name="title"]').value;
}
function getInputAuthor() {
    return document.querySelector('input[name="author"]').value;
}
function getInputPages() {
    return document.querySelector('input[name="pages"]').value;
}
function getInputStatus() {
    return document.querySelector('select[name="status"]').value;
}
function setInputTitle(text) {
    document.querySelector('input[name="title"]').value = text;
}
function setInputAuthor(text) {
    document.querySelector('input[name="author"]').value = text;
}
function setInputPages(text) {
    document.querySelector('input[name="pages"]').value = text;
}
function setInputStatus(text) {
    document.querySelector('select[name="status"]').value = text;
}
