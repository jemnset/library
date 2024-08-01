const bookStatus = ["Completed", "Reading"];
const myLibrary = [];
let libraryIndex = 0;

function BookRecord (book) {
    this.book = book;
    this.index = libraryIndex++;
}

function Book(title, author, pages, status){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readingStatus = status;
    this.info = function(){
        return `${this.title} by ${this.author}, ${this.pages} pages, ${bookStatus[this.readingStatus]}`;
    }
}
 
function addBookToLibrary(title, author, pages, read){
    let bookRecord = new BookRecord(new Book(title, author, pages, read));
    myLibrary.push(bookRecord);

    return bookRecord;
}

function getBookRecordFromLibraryByIdx(idx){
    return myLibrary.find((bookRecord) => {
        bookRecord.index = idx;
    });
}
 
function removeBookFromLibrary(bookRecord){
    //clean up the web page
    const bookCollection = document.querySelector(".bookCollectionBody");
    const bookCard = document.querySelector(`.bookCard[data-index="${bookRecord.index}"]`);

    bookCollection.removeChild(bookCard);

    //update the library
    myLibrary.splice(myLibrary.findIndex(record => record.index === bookRecord.index), 1);

}
 
function setReadStatusOfBook(bookRecord, readStatus){
    //update the book object
    bookRecord.book.read = readStatus;

    //clean up the web page
    const bookCard = document.querySelector(`.bookCard[data-index="${bookRecord.index}"]`);
    bookCard.querySelector(".bookHeader").removeChild(bookCard.querySelector(".bookHeaderBtnGroup"));
    bookCard.querySelector(".readingStatus").textContent = bookStatus[bookRecord.book.read];
}

addBookToLibrary("The Hobbit", "J.R.R Tolkien", 295, 0);
addBookToLibrary("What Feasts At Night", "T. Kingfisher", 147, 1);
addBookToLibrary("The Storm of Echoes", "Christelle Dabos", 540, 1);
addBookToLibrary("The Last Graduate", "Naomi Novik", 388, 0);

function displayBooksFromLibrary(){
    const collection = document.querySelector(".bookCollectionBody");

    for(bookRecord of myLibrary){
        let bookCard = generateBookCard(bookRecord);
        collection.appendChild(bookCard);
    }
}

function generateBookCard(bookRecord){
    const bookCard = document.createElement("div");
    bookCard.classList.add("bookCard");
    bookCard.dataset.index = bookRecord.index;

    bookCard.appendChild(generateBookHeader(bookRecord));
    bookCard.appendChild(generateBookMain(bookRecord));

    return bookCard;
}

function generateBookHeader(bookRecord){
    const bookHeader = document.createElement("div");
    bookHeader.classList.add("bookHeader");

    const readingStatus = document.createElement("div");
    readingStatus.classList.add("readingStatus");
    readingStatus.textContent = bookStatus[bookRecord.book.readingStatus];

    bookHeader.appendChild(readingStatus);

    if(bookStatus[bookRecord.book.readingStatus] == 'Reading'){
        const bookHeaderBtnGroup = document.createElement("div");
        bookHeaderBtnGroup.classList.add("bookHeaderBtnGroup");

        const readBtn = document.createElement("button");
        readBtn.classList.add("readBtn");
        readBtn.textContent = "Finished it!";

        readBtn.addEventListener("click", () => {
            setReadStatusOfBook(bookRecord, bookStatus.indexOf("Completed"));
        });

        bookHeaderBtnGroup.appendChild(readBtn);
        bookHeader.appendChild(bookHeaderBtnGroup);
    }

    return bookHeader;
}

function generateBookMain(bookRecord){
    const bookMain = document.createElement("div");
    bookMain.classList.add("bookMain");

    const title = document.createElement("div");
    title.classList.add("title");
    title.textContent = bookRecord.book.title;

    const author = document.createElement("div");
    author.classList.add("author");
    author.textContent = bookRecord.book.author;
    
    const pages = document.createElement("div");
    pages.classList.add("pages");
    pages.textContent = `${bookRecord.book.pages} pages`;

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("removeBtn");
    removeBtn.textContent = "Remove Book";

    removeBtn.addEventListener("click", () => {
        removeBookFromLibrary(bookRecord);
    });

    bookMain.appendChild(title);
    bookMain.appendChild(author);
    bookMain.appendChild(pages);
    bookMain.appendChild(removeBtn);

    return bookMain;
}

displayBooksFromLibrary();

/***********************************
 * Dialog box functions
 ***********************************/

const addBookForm = document.querySelector(".addBookForm");
const addBookBtn = document.querySelector(".addBtn");
const addBookDialog = document.querySelector(".addBookDialog");

const cancelBtn = document.querySelector(".cancelBtn");
const confirmBtn = document.querySelector(".confirmBtn");

addBookBtn.addEventListener("click", () => {
    addBookDialog.showModal();
});

cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addBookDialog.close();
});

//handle the confirm button event
confirmBtn.addEventListener("click", (e) => {
    e.preventDefault(); //prevent submitting to server
    
    if(addBookForm.checkValidity()) {

        const titleField = document.querySelector(".formBookTitle");
        const authorField = document.querySelector(".formBookAuthor");
        const pagesField = document.querySelector(".formBookPages");
        const readStatus = document.querySelector("input[name='reading']:checked").value;
        
        console.log(`${titleField.value} ${authorField.value} ${pagesField.value} ${readStatus}`); 

        const bookRecord = addBookToLibrary(
                titleField.value.trim(), 
                authorField.value.trim(),
                parseInt(pagesField.value.trim()),
                parseInt(readStatus)
            );

        const collection = document.querySelector(".bookCollectionBody");
        let bookCard = generateBookCard(bookRecord);
        collection.appendChild(bookCard);
        
        addBookForm.reset();
        addBookDialog.close();
    }
    else
        addBookForm.reportValidity();
});


