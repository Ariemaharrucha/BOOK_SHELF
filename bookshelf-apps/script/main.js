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

        const searchBookTitle = document.getElementById('searchBookTitle');
        searchBookTitle.addEventListener('blur',function(){
            searchBooks(books)
        });

        setTimeout(() => {
            Swal.fire({
                title: "Welcome",
                text: "in Bookshelf Apps",
                
                
              });
        }, 1000);

        document.dispatchEvent(new CustomEvent(RENDER_EVENT, { detail: books }));
})

document.addEventListener('click',function(e){
    const target = e.target;
    const undoBtn = target.classList.contains('undoBtn');
    const doneBtn = target.classList.contains('doneBtn');
    const delBtn = target.classList.contains('delBtn');
    const btnEdit = target.classList.contains('editBtn')
     
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

    if(btnEdit){
        const id = tes.dataset.book_id;
        editBook(id)               
    }

    
})


//save event
document.addEventListener(SAVE_EVENT,function(){
    console.log(localStorage.getItem(STORAGE_KEY));
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
    
const card = `<div class="card mb-3  border-3 book_item rounded" style="max-width: 400px;" id="book-${book.id}" data-book_id="${book.id}">                        
        <div class="d-flex g-0 p-1 align-items-center justify-content-around ">
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
                <button type="button" class="btn btn-primary rounded-0 editBtn" data-bs-toggle="modal" data-bs-target="#exampleModal">edit</button>
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
    const bookTarget = findBookIndex(bookid);

    if (bookTarget === -1) {
        return;
    }

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        
    });

    swalWithBootstrapButtons.fire({
        title: "Mengahapus buku",
        text: "Apakah anda yakin mengahapus buku ini ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Hapus",
        cancelButtonText: "Batal",
        reverseButtons: true,
        
    }).then((result) => {
        if (result.isConfirmed) {
            books.splice(bookTarget, 1);
            swalWithBootstrapButtons.fire({
                title: "Buku telah di hapus.",
                icon: "success"
            });
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveDate();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
                text: "Buku anda masih tersimpan",
                icon: "error"
            });
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveDate();
        }
    });

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


//edit
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
     <h1 class="modal-title fs-5" id="exampleModal1Label">Edit Data buku</h1>
   </div>
   <div class="modal-body">
     <form id="editBook" >
       
       <div class="mb-3">
         <label for="editBookTitle" class="form-label">input Buku</label>
         <input type="text" class="form-control" id="editBookTitle"  required value="${idBook.title}">
         
       </div>
       <div class="mb-3">
         <label for="editBookAuthor" class="form-label">input Penulis</label>
         <input type="text" class="form-control" id="editBookAuthor"  required value="${idBook.author}">
         
       </div>
       <div class="mb-3">
         <label for="editBookYear" class="form-label">input Tahun terbit</label>
         <input type="number" class="form-control" id="editBookYear"  required value="${idBook.year}">
       </div>

       <div class="modal-footer">
         <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
         <button class="btn btn-success" id="editBookSubmit" type="submit" data-bs-dismiss="modal" >Edit data bukku</button>
       </div>
       
     </form> 
   </div>
   
 </div>`
}


//search book
function searchBooks() {
    const searchTitle = document.getElementById('searchBookTitle');
    
    const searchResults = books.filter(book => book.title.includes(searchTitle.value));
    if(searchResults.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Buku tidak ada",  
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

//storage
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