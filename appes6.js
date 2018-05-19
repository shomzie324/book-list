class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UiController {

    // Add a book to the ui table
    addBook(book) {
        const list = document.getElementById("book-list");

        // create new tr element for the table
        const row = document.createElement('tr');

        // insert columns to new row
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
        `

        // add new row to the book list
        list.appendChild(row);
    }

    // delete a book from the ui table
    deleteBook(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
            return true;
        }
    }


    // clear fields of the ui form
    clearFields() {
        document.getElementById("title").value = '';
        document.getElementById("author").value = '';
        document.getElementById("isbn").value = '';
    }

    // show alert when the ui is changed
    showAlert(msg, status) {
        // creat div for element
        const div = document.createElement("div");

        // Add classes for styling
        div.className = `alert alert-${status}`;

        // Add text to error
        div.appendChild(document.createTextNode(msg));

        // Inser Get ui elements to insert alert
        const container = document.querySelector(".container");
        const form = document.getElementById("book-form");

        // inser error message div before the form element
        container.insertBefore(div, form);

        // remove div after 3 seconds
        setTimeout(function () {
            document.querySelector(".alert").remove();
        }, 3000);
    }
}

// Local Storage Class
class Store {
    static getBooks(){
        let books;
        if (localStorage.getItem('books') === null) {
            // if there is no book list yet, start a list
            books = [];
        } else {
            // must parse the string in local storage to get an JSON object that can be used in code
            books = JSON.parse(localStorage.getItem("books"));
        }

        return books;
    }

    static displayBooks(){
        // get a copy of the book list from local storage
        const books = Store.getBooks();

        // loop through books to display each one
        books.forEach( function (book) {

            // Start up UI controller
            const ui = new UiController

            // add book to UI
            ui.addBook(book);
        });
    }

    static addBook(book){
        // get a copy of the book list from local storage
        const books = Store.getBooks();

        // add new book to array of books
        books.push(book);

        // replace old books array with new one
        // turn JSON object books array to a string
        // to store it in local storage
        localStorage.setItem("books", JSON.stringify(books));
    }

    static removeBook(isbn){
        // get a copy of the book list from local storage
        const books = Store.getBooks();

        // loop through books to fidn the right one and remove it
        // Note: for each provides access to index of item in the call back function
        books.forEach( function (book, index) {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        // update local storage with new book list
        localStorage.setItem("books", JSON.stringify(books));
    }
}

// DOM Loaded Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listener for adding a book
document.getElementById("book-form").addEventListener('submit', function(e) {
    // get values from form
    const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;

    // create a new book object
    const book = new Book(title, author, isbn)

    // Start up UI controller
    const ui = new UiController();

    // validate input
    if (title === '' || author === '' || isbn === '') {
        // show error alert
        ui.showAlert("Please fill in all fields", "danger");
    } else {
        // Add book to list
        ui.addBook(book);

        // Add book to local storage
        Store.addBook(book);

        // show success alert
        ui.showAlert("Book Added", "success");

        // Clear fields
        ui.clearFields();
    }


    e.preventDefault();
});

// Event Listener for delete
document.getElementById("book-list").addEventListener('click', function (e) {
    
    // Start up UI controller
    const ui = new UiController();

    // Delete book
     const deleted = ui.deleteBook(e.target);

    // remove from local storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // show success if book was deleted
    if (deleted) {
        // Show Alert when book is deleted
        ui.showAlert("Book Deleted", "success");
    }

    e.preventDefault();
});