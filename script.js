let library = [];

initModalDialog();

function Book (title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.addToLibrary = function() {
        library.push(this);
    }
    // this.timestamp = timestamp;
}


const book1 = new Book ("The Martian", "Andy Weir", 369, "read");
const book2 = new Book ("Sapiens", "Yuval Noah Harari", 443, "unread");

book1.addToLibrary();
book2.addToLibrary();

console.table(library);

function initModalDialog () {
    const addButton = document.querySelector(".add-button");
    const modal = document.querySelector(".modal");
    const close = document.querySelector(".close");
    addButton.onclick = function () {
        modal.style.display = "block";
    }
    window.onclick = function (event) {
        if (event.target === modal || event.target === close) modal.style.display = "none";

    }
}