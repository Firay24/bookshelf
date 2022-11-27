document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('form');

    const RENDER_EVENT = 'render-book';
    document.addEventListener(RENDER_EVENT, function() {
        const uncompletedBookList = document.getElementById('uncompletedBooks');
        uncompletedBookList.innerHTML = '';

        const completedBookList = document.getElementById('completedBooks');
        completedBookList.innerHTML = '';

        for (const bookItem of books) {
            const bookElement = makeBook(bookItem);
            if (bookItem.isComplete) {
                completedBookList.append(bookElement);
            } else {
                uncompletedBookList.append(bookElement);
            }
        }
    });

    let books = [];
    const STORAGE_KEY = 'BOOK_APPS';
    
    if(books.length === 0){
        let localItems = JSON.parse( localStorage.getItem(STORAGE_KEY));
        if (localItems !== null) {
            books = localItems;
            document.dispatchEvent(new Event(RENDER_EVENT));
        } else {
            books = [];
            console.log('buku kosong')
        }
        
    } else {
        books = [];
        console.log('buku kosong dua')
    };

    submitForm.addEventListener('submit', function (e){
        e.preventDefault();
        addBook();
    });

    function addBook() {
        const titleBook = document.getElementById('title').value;
        const authorBook = document.getElementById('author').value;
        const yearBook = document.getElementById('year').value;
        let isCompleteCheck = document.querySelector('.inputBookIsComplete').checked;

        const idBook = generateID();

        const bookObject = generateBookObject(idBook, titleBook, authorBook, yearBook, isCompleteCheck);
        books.push(bookObject);

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    };

    function generateID() {
        return +new Date();
    };

    function generateBookObject(id, title, author, year, isComplete) {
        return {
            id,
            title,
            author,
            year,
            isComplete
        };
    };

    function makeBook(bookObject) {
        const textTitle = document.createElement('h5');
        textTitle.innerText = bookObject.title;

        const textAuthor = document.createElement('p');
        textAuthor.innerText = bookObject.author;

        const textYear = document.createElement('p');
        textYear.innerText = bookObject.year;

        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');
        bookItem.append(textTitle, textAuthor, textYear);

        const buttonGreen = document.createElement('button');
        buttonGreen.classList.add('green');
        if (bookObject.isComplete) {
            const textGreen = document.createTextNode('Belum Selesai Dibaca');
            buttonGreen.appendChild(textGreen);
            
            buttonGreen.addEventListener('click', function() {
                addBookToUncompleted(bookObject.id);
            })

        } else {
            const textGreen = document.createTextNode('Selesai Dibaca');
            buttonGreen.appendChild(textGreen);

            buttonGreen.addEventListener('click', function() {
                addBookToCompleted(bookObject.id);
            })

        };


        const buttonRed = document.createElement('button');
        buttonRed.classList.add('red');
        const textRed = document.createTextNode('Hapus Buku');
        buttonRed.appendChild(textRed);
        
        buttonRed.addEventListener('click', function() {
            if(confirm('Apakah Anda yakin menghapusnya?')) {
                removeBook(bookObject.id);
            }
        })


        const action = document.createElement('div');
        action.classList.add('action');
        action.append(buttonGreen, buttonRed);

        const itemList = document.createElement('div');
        itemList.classList.add('item');
        itemList.append(bookItem, action);
        itemList.setAttribute('id', bookObject.id)

        function addBookToCompleted (bookId) {
            const bookTarget = findBook(bookId);

            if (bookTarget == null) return;

            bookTarget.isComplete = true;
            document.dispatchEvent(new Event(RENDER_EVENT));  
            saveData()

        };

        function addBookToUncompleted (bookId) {
            const bookTarget = findBook(bookId);

            if (bookTarget == null) return;

            bookTarget.isComplete = false;
            document.dispatchEvent(new Event(RENDER_EVENT)); 
            saveData()
        };

        function findBook(bookId) {
            for (const bookItem of books) {
                if (bookItem.id === bookId) {
                    return bookItem;
                };
            }
            return null;
        };

        function removeBook(bookId) {
            const bookTarget = findBookIndex(bookId);

            if (bookTarget === -1) return;

            books.splice(bookTarget, 1);
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData()
        };

        function findBookIndex(bookId) {
            for (const index in books) {
                if (books[index].id === bookId) {
                    return index;
                }
            }
            return -1;
        };

        return itemList;
    };

    function saveData() {
        if(isStorageExist()) {
            const parsed = JSON.stringify(books);
            localStorage.setItem(STORAGE_KEY, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    };

    const SAVED_EVENT = 'saved-book';

    function isStorageExist() {
        if (typeof (Storage) === undefined) {
            alert('Maaf browser Anda tidak mendukung local storage');
            return false;
        }
        return true;
    };

});

function filter(){
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    const searchList = document.getElementsByTagName('h5');
    const books = document.getElementsByClassName('item');
    
    for(let i=0; i<=searchList.length; i++) {
        const book = books[i].getElementsByTagName('h5')[0];
        const bookTitle = book.innerHTML.toLowerCase();

        if(bookTitle.includes(searchValue)) {
            books[i].style.display = '';
        } else {
            books[i].style.display = 'none';
        };

    };

};

