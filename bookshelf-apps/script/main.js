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

        const searchBookTitle = document.getElementById('searchBookTitle');
        searchBookTitle.addEventListener('blur',function(){
            searchBooks(books)
        })

        document.dispatchEvent(new CustomEvent(RENDER_EVENT, { detail: books }));
})

document.addEventListener('click',function(e){
    const target = e.target;
    const undoBtn = target.classList.contains('undoBtn');
    const doneBtn = target.classList.contains('doneBtn');
    const delBtn = target.classList.contains('delBtn');
    // const btnEdit = target.classList.contains('editBtn')
     
    const tes = target.closest('.book_item')   
    // console.log(target);

    if(undoBtn){
        const id = tes.dataset.book_id;
        console.log(id);
        undo_readComplete(id)
    }

    if(doneBtn) {
        const id = tes.dataset.book_id; 
        console.log(id);       
        readComplete(id)
    }

    if(delBtn){
        const id = tes.dataset.book_id;
        console.log(id);
        delBook(id);
    }

    // if(btnEdit){
    //     const id = tes.dataset.book_id;
    //     editBook(id)               
    // }

    
})

document.addEventListener(RENDER_EVENT,function(event){
    const booksToRender = event.detail ? event.detail : books;
    renderBooks(booksToRender);
})

function addBook () {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = parseInt(document.getElementById('inputBookYear').value);
    const isComplete = document.getElementById('inputBookIsComplete').checked;

    const generateID = generateid();

    const book = generateBook(generateID,title,author,year,isComplete)
    books.push(book);
    document.dispatchEvent(new Event(RENDER_EVENT));
    // saveDate();
    
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
    
const card = `<div class="card mb-3  border-4 book_item" style="max-width: 540px;" id="book-${book.id}" data-book_id="${book.id}">
                            
    <div class="d-flex g-0 p-1 align-items-center justify-content-around p-">
      <div class="ms-3  ">
      <img src="img/Book.png" class="  d-inline-block " alt="...">
      </div>

        <div class="card-body">
          <h5 class="card-title">${book.title}</h5>
          <p class="card-text">Penulis: ${book.author}</p>
          <p class="card-text"><small class="text-body-secondary">Tahun: ${book.year}</small></p>
        </div>

    </div>
      
        <div class="btn-group mt-2 btn_listBook " role="group" aria-label="Basic example">
            <button type="button" class="btn btn-danger rounded-0 delBtn">Hapus</button>
            ${book.isComplete 
                ? `<button type="button" class="btn btn-success undoBtn">Undo</button>`
                : `<button type="button" class="btn btn-success doneBtn">Done</button>`
              }
            <button type="button" class="btn btn-warning rounded-0 editBtn">edit</button>
        </div>
        
  </div>`

    return card
}


 //read book
 function readComplete(idComplete) {
    const readBook = findBook_id(idComplete)
    if (readBook == null) return;
    readBook.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    // saveDate();

}

//undo readComplete
function undo_readComplete(idUndo){
    console.log(`tes ${idUndo}`);
    const readBook = findBook_id(idUndo)
    console.log(`tesr= ${readBook}`);
    if (readBook == null) return;
    
    readBook.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    // saveDate();

}

//delete book
function delBook(bookid) {
    const bookTarget = findBookIndex(bookid)

    if(bookTarget === -1) return;
    books.splice(bookTarget,1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    // saveDate();
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
    let bookelement =" ";
        for (const bookItem of booksToRender) {
             bookelement = makeBook(bookItem);         
            if (bookItem.isComplete === true) {
                completeBookshelfList.innerHTML += bookelement;
            } else {
                
                incompleteBookshelfList.innerHTML += bookelement;
            }
        }   
}  