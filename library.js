const myLibrary = [];

function Book(title, author, pages, read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function(){
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? "read": "not yet read"}`;
    }
}
 
function addBookToLibrary(title, author, pages, read){
    myLibrary.push(new Book(title, author, pages, read));
}
 
function getBooksFromLibrary(){
    for(book of myLibrary){
        console.log(book.info());
    }
}

function removeBookFromLibraryByIndex(bookIndex){
    myLibrary.splice(bookIndex, 1);
}

function setReadStatusOfBook(book, readStatus){
    book.read = readStatus;
}

addBookToLibrary("The Hobbit", "J.R.R Tolkien", 295, true);
addBookToLibrary("What Feasts At Night", "T. Kingfisher", 147, false);
addBookToLibrary("The Storm of Echoes", "Christelle Dabos", 540, false);
addBookToLibrary("The Last Graduate", "Naomi Novik", 388, true);



