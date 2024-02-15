    const books = [];
    const RENDER_EVENT = 'render-book';
    const SAVE_EVENT = 'SAVE_EVENT'
    const STORAGE_KEY = 'BOOK_SHELF';

    document.addEventListener('DOMContentLoaded',function(){

        const submitForm = document.getElementById('inputBook');

        submitForm.addEventListener('submit',function (event) {
            event.preventDefault();
            addBook();
        })

        const searchForm = document.getElementById('searchBook');

        searchForm.addEventListener('submit', function (event) {
            event.preventDefault();
            searchBooks();
        });
        
        if(isStorageExist()){
            loadDataFromStorage();
        }
        document.dispatchEvent(new CustomEvent(RENDER_EVENT, { detail: books }));
        
    })

    document.addEventListener('click',function(e){
        const target = e.target;
        const undoBtn = target.classList.contains('undoBtn');
        const doneBtn = target.classList.contains('doneBtn');
        const delBtn = target.classList.contains('delBtn');
        const btnEdit = target.classList.contains('editBtn')
        const tes = target.closest('.book_item')
        
        if(undoBtn){
            const id = tes.dataset.book_id;
            console.log(id);
            undo_readComplete(id)
        }

        if(doneBtn) {
            const id = tes.dataset.book_id;
            // console.log(id);
            readComplete(id)
        }

        if(delBtn){
            const id = tes.dataset.book_id;
            delBook(id);
        }

        if(btnEdit){
            const id = tes.dataset.book_id;
            editBook(id)
        }
        
    })

    document.addEventListener(SAVE_EVENT,function(){
        console.log(localStorage.getItem(STORAGE_KEY));
    })

    document.addEventListener(RENDER_EVENT,function(event){

        // document.dispatchEvent(new Event(RENDER_EVENT));
        // const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
        // const completeBookshelfList = document.getElementById('completeBookshelfList');
        // incompleteBookshelfList.innerHTML ='';
        // completeBookshelfList.innerHTML ='';

        // for (const bookItem of books) {
        //     const bookelement = makeBook(bookItem)
        //     // incompleteBookshelfList.append(bookelement)
        //     if(bookItem.isComplete === true) {
        //         completeBookshelfList.append(bookelement)
        //     } else {
        //         incompleteBookshelfList.append(bookelement)
        //     }
        // } 

        const booksToRender = event.detail ? event.detail : books;
        renderBooks(booksToRender);

    })

    function addBook () {
        const title = document.getElementById('inputBookTitle').value;
        const author = document.getElementById('inputBookAuthor').value;
        const year = document.getElementById('inputBookYear').value;
        const isComplete = document.getElementById('inputBookIsComplete').checked;

        const generateID = generateid();
        const book = generateBook(generateID,title,author,year,isComplete)
        books.push(book);

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveDate();
    }

    function generateid () {
        return +new Date();
    }

    function generateBook (id,title,author,year,isComplete) {
        return {
            id,
            title,
            author,
            year,
            isComplete
        }
    }

    function makeBook(book) {
        const article_book = document.createElement('article');
        article_book.classList.add('book_item');

        const Book_Title = document.createElement('h3');
        Book_Title.innerText = ` ${book.title} `;

        const titleBook = document.createElement('p');
        const tahun = document.createElement('p');

        titleBook.innerText = `Penulis : ${book.author}`;
        tahun.innerText= `Tahun Rilis : ${book.year}`;

    
        const divBtn = document.createElement('div');
        divBtn.classList.add('action');
        const btn_delete_book = document.createElement('button');
        btn_delete_book.innerText = 'Hapus buku';
        btn_delete_book.classList.add('red','delBtn')

        article_book.append(Book_Title,titleBook,tahun);
        article_book.setAttribute('id',`book-${book.id}`);
        article_book.setAttribute('data-book_id',`${book.id}`)

        const btnEdit = document.createElement('button');
        btnEdit.classList.add('yellow','editBtn');
        btnEdit.innerText ="EDIT data buku";

        if(book.isComplete === true) {
            const btnUndo = document.createElement('button');
            btnUndo.innerText = 'Belum selesai di Baca';
            btnUndo.classList.add('green','undoBtn');

            // event undo and del
            // btnUndo.addEventListener('click',function(){
            //     undo_readComplete(book.id);
            // })

            // btn_delete_book.addEventListener('click',function(){
            //     delBook(book.id);
            // })

            divBtn.append(btn_delete_book,btnUndo,btnEdit);
            article_book.append(divBtn);
        } else {
            const btnDone = document.createElement('button');
            btnDone.innerText = 'selesai di Baca';
            btnDone.classList.add('green','doneBtn');

            //btn done
            // btnDone.addEventListener('click',function(){
            //     readComplete(book.id);
            // })

            // btn_delete_book.addEventListener('click',function(){
            //     delBook(book.id);
            // })

            divBtn.append(btn_delete_book,btnDone,btnEdit);
            article_book.append(divBtn);
        }

        return article_book
    }

    function readComplete(idComplete) {
        const readBook = findBook_id(idComplete)
        if (readBook == null) return;
        readBook.isComplete = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveDate();

    }

    function undo_readComplete(idUndo){
        console.log(`tes ${idUndo}`);
        const readBook = findBook_id(idUndo)
        console.log(`tesr= ${readBook}`);
        if (readBook == null) return;
        
        readBook.isComplete = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveDate();

    }

    function  delBook(bookid) {
        const bookTarget = findBookIndex(bookid)

        if(bookTarget === -1) return;
        books.splice(bookTarget,1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveDate();
    }

    function findBook_id(bookId) {
        for (const bookItem of books) {
            if(bookItem.id == bookId) {
                return bookItem;
            }
        }
        return null;
    }

    function findBookIndex(bookId) {
        for (const index in books) {
            if(books[index].id == bookId) {
                return index;
            }   
        }
        return -1
    }

    
    function searchBooks() {
        const searchTitle = document.getElementById('searchBookTitle').value;
        const searchResults = books.filter(book => book.title.includes(searchTitle));
    
        renderBooks(searchResults);
    }

    function renderBooks(booksToRender) {
        const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
        const completeBookshelfList = document.getElementById('completeBookshelfList');
        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';
    
        for (const bookItem of booksToRender) {
        const bookelement = makeBook(bookItem);
    
        if (bookItem.isComplete === true) {
            completeBookshelfList.append(bookelement);
        } else {
            incompleteBookshelfList.append(bookelement);
        }
        }
    }  

    function editBook(Id_book) {
        const idBook = findBook_id(Id_book);
    
        if (idBook) {
            const default_title = idBook.title;
            const default_author = idBook.author;
            const default_year = idBook.year;
    
            const newTitle = prompt('Edit judul buku', default_title);
            const newAuthor = prompt('Edit Penulis buku', default_author);
            const newYear = prompt('Edit tahun rilis', default_year);
    
            if (newTitle !== null) {
                idBook.title = newTitle;
            }
            if (newAuthor !== null) {
                idBook.author = newAuthor;
            }
            if (newYear !== null) {
                idBook.year = newYear;
            }
    
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveDate();
        }
    }
    

    function saveDate(){
        if(isStorageExist()){
            const parsed = JSON.stringify(books);
            localStorage.setItem(STORAGE_KEY, parsed);
            document.dispatchEvent(new Event(SAVE_EVENT));
        }
    }

    function isStorageExist() {
        if(typeof (Storage) === undefined) {
            alert ('Browser kamu tidak mendukung local storage');
            return false;
        } else {
            return true;
        }
    }

    function loadDataFromStorage(){
        const serializedData = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serializedData);
    
        if (data !== null) {
            for (const book of data) {
                books.push(book);
            }
        }
    
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

