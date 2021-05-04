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
const book1 = new Book ("The Martian", "Andy Weir", 369, "read", Date.now()-1);
const book2 = new Book ("Sapiens", "Yuval Noah Harari", 443, "not read", Date.now());
book1.addToLibrary();
book2.addToLibrary();

initModalDialog();
initBookshelf();


/* FUNCTIONS */
function initBookshelf() {
    const bookshelf = document.querySelector(".bookshelf");
    library.forEach(element => {
        const book = document.createElement("div");
        book.classList.add("book");
        
        book.textContent = element.title;


        bookshelf.appendChild(book);
    });
}


function initModalDialog () {
    const addNewBookButton = document.querySelector(".add-new-book-button");
    const modal = document.querySelector(".modal");
    const close = document.querySelector(".close");
    const submitButton = document.querySelector(".submit");
    addNewBookButton.onclick = function () {
        modal.style.display = "block";
    }
    window.onclick = function (event) {
        if (event.target === modal || event.target === close) modal.style.display = "none";

    }
    submitButton.onclick = function () {
        const book = new Book (getInputTitle(), getInputAuthor(), getInputPages(), getInputStatus(), Date.now());
        modal.style.display = "none";
        book.addToLibrary();
        clearInputs();
        console.table(library);
    }
}

function clearInputs() {
    setInputTitle("");
    setInputAuthor("");
    setInputPages("");
    setInputStatus("read");
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
