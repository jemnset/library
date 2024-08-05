/**
 * Book class which stores the title, author, number of pages and the
 * user's reading status related to the book
 */
class Book{
    #title;
    #author;
    #pages;
    #readingStatus;

    constructor(title, author, pages, status){
        this.#title = title;
        this.#author = author;
        this.#pages = pages;
        this.#readingStatus = status;
    }

    getTitle(){
        return this.#title;
    }

    getAuthor(){
        return this.#author;
    }

    getPages(){
        return this.#pages;
    }

    getReadingStatus(){
        return this.#readingStatus;
    }

    setReadingStatus(status){
        this.#readingStatus = status;
    }

    getInfo(){
        return `${this.#title} by ${this.#author}, ${this.#pages} pages, ${Library.BookStatus[this.#readingStatus]}`;
    }
}

/**
 * Library manages an array of Book Record objects which contain a book and
 * a unique index that is managed by the library
 * 
 * Users have the ability to 
 * - add books to the library
 * - remove books from the library
 * - update the reading status of books from "Reading" to "Completed"
 */
class Library{
    static BookStatus = {
        COMPLETED: 0, 
        READING: 1
    };

    #collection = [];

    getBookById(bookID){
        return this.#collection[bookID];
    }

    getBookID(book){
        return this.#collection.findIndex((record) => record === book);
    }

    getBookCollection(){
        //provide a copy of the array so that one stored in the Library object is not altered
        return [...this.#collection];
    }

    addBookToLibrary(title, author, pages, read){
        let book = new Book(title, author, pages, read);
        this.#collection.push(book);

        return book;
    }

    removeBookFromLibrary(bookIndex){
        //update the library
        this.#collection.splice(bookIndex, 1);
    }

    setReadStatusOfBook(bookIndex, newStatus){
        //update the book object
        console.log(bookIndex);
        this.#collection.forEach((book,idx) => {
            console.log(idx + " " + book.getTitle());
        });
        this.#collection[bookIndex].setReadingStatus(newStatus);
    }
}

const ScreenController = (function() {
    const myLibrary = new Library();

    //DOM elements
    const bookCollection = document.querySelector(".bookCollectionBody");

    //dialog box DOM elements
    const addBookForm = document.querySelector(".addBookForm");
    const addBookBtn = document.querySelector(".addBtn");
    const addBookDialog = document.querySelector(".addBookDialog");

    const cancelBtn = document.querySelector(".cancelBtn");
    const confirmBtn = document.querySelector(".confirmBtn");

    const updateDisplay = () => {

        //empty the book collection 
        bookCollection.textContent = '';

        //recreate the collection
        for(book of myLibrary.getBookCollection()){
            let bookCard = generateBookCard(book);
            bookCollection.appendChild(bookCard);
        }
    }

    function generateBookCard(book){
        const bookCard = document.createElement("div");
        
        bookCard.classList.add("bookCard");
        bookCard.dataset.index = myLibrary.getBookID(book);
    
        bookCard.appendChild(generateBookHeader(book));
        bookCard.appendChild(generateBookMain(book));
    
        return bookCard;
    }

    function generateBookHeader(book){

        const bookHeader = document.createElement("div");
        const readingStatus = document.createElement("div");

        bookHeader.classList.add("bookHeader");
        readingStatus.classList.add("readingStatus");

        readingStatus.textContent = book.getReadingStatus() === Library.BookStatus.COMPLETED ? "Completed" : "Reading";
    
        bookHeader.appendChild(readingStatus);
    
        if(book.getReadingStatus() === Library.BookStatus.READING){
            const bookHeaderBtnGroup = document.createElement("div");
            const readBtn = document.createElement("button");
            
            bookHeaderBtnGroup.classList.add("bookHeaderBtnGroup");
            readBtn.classList.add("readBtn");

            readBtn.textContent = "Finished it!";
            readBtn.addEventListener("click", clickHandlerCompletedBtn);
    
            bookHeaderBtnGroup.appendChild(readBtn);
            bookHeader.appendChild(bookHeaderBtnGroup);
        }
    
        return bookHeader;
    }

    function generateBookMain(book){
        const bookMain = document.createElement("div");
        const title = document.createElement("div");
        const author = document.createElement("div");
        const pages = document.createElement("div");
        const removeBtn = document.createElement("button");

        bookMain.classList.add("bookMain");
        title.classList.add("title"); 
        removeBtn.classList.add("removeBtn");
        
        title.textContent = book.getTitle();
        author.textContent = book.getAuthor();
        pages.textContent = `${book.getPages()} pages`;
        removeBtn.textContent = "Remove Book";
    
        removeBtn.addEventListener("click", clickHandlerRemoveBookBtn);
    
        bookMain.appendChild(title);
        bookMain.appendChild(author);
        bookMain.appendChild(pages);
        bookMain.appendChild(removeBtn);
    
        return bookMain;
    }

    function clickHandlerRemoveBookBtn(e){
        let bookIdx = e.target.closest(".bookCard").dataset.index;
        myLibrary.removeBookFromLibrary(bookIdx);

        updateDisplay();
    }

    function clickHandlerCompletedBtn(e){
        let bookIdx = e.target.closest(".bookCard").dataset.index;
        myLibrary.setReadStatusOfBook(bookIdx, Library.BookStatus.COMPLETED);
        
        updateDisplay();
    }

    //dialog box event handlers
    function clickHandlerAddBookBtn(e){
        addBookDialog.showModal();
    }

    function clickHandlerCancelBtn(e){
        e.preventDefault();
        addBookForm.reset();
        addBookDialog.close();
    }

    function clickHandlerConfirmBtn(e){
        e.preventDefault(); //prevent submitting to server
    
        if(addBookForm.checkValidity()) {

            const titleField = document.querySelector(".formBookTitle");
            const authorField = document.querySelector(".formBookAuthor");
            const pagesField = document.querySelector(".formBookPages");
            const readStatus = document.querySelector("input[name='reading']:checked").value;
            
            console.log(`${titleField.value} ${authorField.value} ${pagesField.value} ${readStatus}`); 

            const book = myLibrary.addBookToLibrary(
                    titleField.value.trim(), 
                    authorField.value.trim(),
                    parseInt(pagesField.value.trim()),
                    parseInt(readStatus)
                );

            let bookCard = generateBookCard(book);
            bookCollection.appendChild(bookCard);
            
            addBookForm.reset();
            addBookDialog.close();
            updateDisplay();
        }
        else
            addBookForm.reportValidity();
        }


    myLibrary.addBookToLibrary("The Hobbit", "J.R.R Tolkien", 295, 0);
    myLibrary.addBookToLibrary("What Feasts At Night", "T. Kingfisher", 147, 1);
    myLibrary.addBookToLibrary("The Storm of Echoes", "Christelle Dabos", 540, 1);
    myLibrary.addBookToLibrary("The Last Graduate", "Naomi Novik", 388, 0);

    addBookBtn.addEventListener("click", clickHandlerAddBookBtn);
    cancelBtn.addEventListener("click", clickHandlerCancelBtn);
    confirmBtn.addEventListener("click", clickHandlerConfirmBtn);

    updateDisplay();
})();
