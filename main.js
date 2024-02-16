    const books = [];
    const RENDER_EVENT = 'render-book';
    const SAVE_EVENT = 'SAVE_EVENT'
    const STORAGE_KEY = 'BOOK_SHELF';

    document.addEventListener('DOMContentLoaded',function(){

        //add book
        const submitForm = document.getElementById('inputBook');
        submitForm.addEventListener('submit',function (event) {
            event.preventDefault();         
            addBook();
        })

        //search bbok
        const searchForm = document.getElementById('searchBook');
        searchForm.addEventListener('submit', function (event) {         
            event.preventDefault();
            searchBooks();
        });
        
        if(isStorageExist()){
            loadDataFromStorage();
        }

        //input search
        const searchBookTitle = document.getElementById('searchBookTitle');
        searchBookTitle.addEventListener('blur',function(){
            searchBooks(books)
        })

        document.dispatchEvent(new CustomEvent(RENDER_EVENT, { detail: books }));
        
    })

    //new element
    document.addEventListener('click',function(e){
        const target = e.target;
        const undoBtn = target.classList.contains('undoBtn');
        const doneBtn = target.classList.contains('doneBtn');
        const delBtn = target.classList.contains('delBtn');
        const btnEdit = target.classList.contains('editBtn')
        
        const tes = target.closest('.book_item')
        
        console.log(target);
        if(undoBtn){
            const id = tes.dataset.book_id;
            console.log(id);
            undo_readComplete(id)
        }

        if(doneBtn) {
            const id = tes.dataset.book_id;
            
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

    //save event
    document.addEventListener(SAVE_EVENT,function(){
        console.log(sessionStorage.getItem(STORAGE_KEY));
    })

    //render event
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

    //add book
    function addBook () {
        const title = document.getElementById('inputBookTitle').value;
        const author = document.getElementById('inputBookAuthor').value;
        const year = parseInt(document.getElementById('inputBookYear').value);
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


    //add list book
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

        const btnEdit = document.createElement('button')
        btnEdit.innerHTML = `<button type="button" class="btn btn-primary editBtn" data-bs-toggle="modal" data-bs-target="#exampleModal">
       edit data buku
     </button>`;

        if(book.isComplete === true) {
            const btnUndo = document.createElement('button');
            btnUndo.innerText = 'Belum selesai di Baca';
            btnUndo.classList.add('green','undoBtn');
            divBtn.append(btn_delete_book,btnUndo,btnEdit);
            article_book.append(divBtn);
        } else {
            const btnDone = document.createElement('button');
            btnDone.innerText = 'selesai di Baca';
            btnDone.classList.add('green','doneBtn');
            divBtn.append(btn_delete_book,btnDone,btnEdit);
            article_book.append(divBtn);
        }

        return article_book
    }

    //read book
    function readComplete(idComplete) {
        const readBook = findBook_id(idComplete)
        if (readBook == null) return;
        readBook.isComplete = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveDate();

    }

    //undo readComplete
    function undo_readComplete(idUndo){
        console.log(`tes ${idUndo}`);
        const readBook = findBook_id(idUndo)
        console.log(`tesr= ${readBook}`);
        if (readBook == null) return;
        
        readBook.isComplete = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveDate();

    }

    //delete book
    function delBook(bookid) {
        const bookTarget = findBookIndex(bookid)

        if(bookTarget === -1) return;
        books.splice(bookTarget,1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveDate();
    }

    //mencari id
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

    
    //search book
    function searchBooks() {
        const searchTitle = document.getElementById('searchBookTitle').value;
        
        const searchResults = books.filter(book => book.title.includes(searchTitle));
        if(searchResults.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
                footer: '<a href="#">Why do I have this issue?</a>'
              })             
        } 
        else {
            renderBooks(searchResults);
        }
    }

    function renderBooks(booksToRender) {
        const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
        const completeBookshelfList = document.getElementById('completeBookshelfList');

            

        document.getElementById('inputBook').reset();
        
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


    //edit data
    function editBook(Id_book) {
        const idBook = findBook_id(Id_book);
        const modal_Body = document.getElementById('modal_body')  

        const formEdit = editForm(idBook)
        modal_Body.innerHTML = formEdit;

        const submitEditBook = document.getElementById('editBook')

        submitEditBook.addEventListener('submit',function(event){
        event.preventDefault()
        
            
        const editedTitle = document.getElementById('editBookTitle').value;
        const editedAuthor = document.getElementById('editBookAuthor').value;
        const editedYear = parseInt(document.getElementById('editBookYear').value);

        updateBook(idBook,editedTitle,editedAuthor,editedYear)

        
        document.dispatchEvent(new Event(RENDER_EVENT));

        })

        
    }

    function updateBook(book,editTitle,editAuthor,edityear) {
        book.title = editTitle;
        book.author = editAuthor;
        book.year = edityear;

        saveDate()
        
    }   
    
    function editForm(idBook){
       return `<div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="editBook">
            <div class="input">
              <label for="inputBookTitle">Judul</label>
              <input id="editBookTitle" type="text" required value="${idBook.title}" >
            </div>
            <div class="input">
              <label for="inputBookAuthor">Penulis</label>
              <input id="editBookAuthor" type="text" required value="${idBook.author}" >
            </div>
            <div class="input">
              <label for="inputBookYear">Tahun</label>
              <input id="editBookYear" type="number" required value="${idBook.year}" >
            </div>
            
            <button id="editBookSubmit" type="submit" data-bs-dismiss="modal">Edit data bukku</button>
          </form>
        </div>
        
      </div>`
    }


    //storage
    function saveDate(){
        if(isStorageExist()){
            const parsed = JSON.stringify(books);
            sessionStorage.setItem(STORAGE_KEY, parsed);
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
        const serializedData = sessionStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serializedData);
    
        if (data !== null) {
            for (const book of data) {
                books.push(book);
            }
        }
    
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

