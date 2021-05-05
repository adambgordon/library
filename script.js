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
        addBookToDOM(element);
    });
}

function addBookToDOM(bookObj) {
    const bookshelf = document.querySelector(".bookshelf");
    const book = document.createElement("div");
    const remove = document.createElement("div");
    const edit = document.createElement("div");
    const title = document.createElement("div");
    const author = document.createElement("div");
    const pages = document.createElement("div");
    const status = document.createElement("div");

    book.classList.add("book");
    remove.classList.add("remove");
    edit.classList.add("edit");
    edit.classList.add("material-icons")
    title.classList.add("title");
    author.classList.add("author");
    pages.classList.add("pages");
    status.classList.add("pages");

    book.id = bookObj.timestamp;
    remove.textContent = "\u00d7";
    edit.textContent = "edit";
    title.textContent = bookObj.title;
    author.textContent = bookObj.author;
    pages.textContent = bookObj.pages + " pp";
    if (bookObj.status === "read") {
        status.textContent = "Already read";
    } else {
        status.textContent = "Not read";
    }

    book.appendChild(remove);
    book.appendChild(edit);
    book.appendChild(title);
    book.appendChild(author);
    book.appendChild(pages);
    book.appendChild(status);

    bookshelf.appendChild(book);

    remove.onclick = removeBook;
    edit.onclick = editBook;
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
    let book;
    for (let i = 0; i < library.length; i++) {
        if (library[i].timestamp.toString() === this.parentElement.id) {
            book = library[i];
            break;
        }
    }

    const modal = document.querySelector(".modal");
    const submitButton = document.querySelector(".submit");
    const updateButton = document.querySelector(".update");

    submitButton.style.display = "none";
    modal.style.display = "block";
    updateButton.style.display = "block";

    console.log(typeof(book.pages));


    updateButton.dataset.timestamp = book.timestamp;
    setInputTitle(book.title);
    setInputAuthor(book.author);
    setInputPages(book.pages);
    setInputStatus(book.status);

}

function initModalDialog () {
    const addNewBookButton = document.querySelector(".add-new-book-button");
    const modal = document.querySelector(".modal");
    const close = document.querySelector(".close");
    const submitButton = document.querySelector(".submit");
    const updateButton = document.querySelector(".update");

    addNewBookButton.onclick = () => {
        updateButton.style.display = "none";
        modal.style.display = "block";
        submitButton.style.display = "block";
    }
    window.onclick = function (event) { // make separate fn
        if (event.target === modal || event.target === close) modal.style.display = "none";
    }
    window.onkeydown = function (event) { // make separate fn
        if (modal.style.display === "block") {
            if (event.key === "Enter") {
                if (submitButton.style.display === "block") {
                    submit();
                } else if (updateButton.style.display === "block") {
                    update();
                }
            } else if (event.key === "Escape") {
                modal.style.display = "none";
            }
        } 
    }
    submitButton.onclick = submit;
    updateButton.onclick = update;
}

function update() {
    const modal = document.querySelector(".modal");
    modal.style.display = "none";

    const updateButton = document.querySelector(".update");

    const timestamp = updateButton.dataset.timestamp;
    const title = getInputTitle();
    const author = getInputAuthor();
    const pages = Number(getInputPages());
    const status = getInputStatus();
    clearInputs();

    console.log(typeof(pages));
    for (let i = 0; i < library.length; i++) {
        if (library[i].timestamp.toString() === timestamp) {
            library[i].title = title;
            library[i].author = author;
            library[i].pages = pages;
            library[i].status = status;
            break;
        }
    }
    const book = document.querySelector(`[id="${timestamp}"]`);

    book.querySelector(".title").textContent = title;
    book.querySelector(".author").textContent = author;
    book.querySelector(".pages").textContent = pages + " pp";

    if (status === "read") {
        book.querySelector(".pages").textContent = "Already read";
    } else {
        book.querySelector(".pages").textConten = "Not read";
    }

    console.table(library);
}

  

function submit () {
    const book = new Book (getInputTitle(), getInputAuthor(), getInputPages(), getInputStatus(), Date.now());
    const modal = document.querySelector(".modal");
    modal.style.display = "none";
    book.addToLibrary();
    addBookToDOM(book);
    clearInputs();
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
