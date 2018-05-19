// Book Constructor
function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
} 

// UI controller Constructor
function UI(){}

// add prototype function to UI for adding books to the UI list
UI.prototype.addBook = function (book) {
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

// Show error alert
UI.prototype.showAlert = function (msg, status) {
    // creat div for element
    const div = document.createElement("div");

    // Add classes for styling
    div.className = `alert ${status}`;

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

// clear fields
UI.prototype.clearFields = function () {
    document.getElementById("title").value = '';
    document.getElementById("author").value = '';
    document.getElementById("isbn").value = '';
}

// Delete Book
UI.prototype.deleteBook = function (target) {
    if (target.className === 'delete') {
        target.parentElement.parentElement.remove();
        return true;
    }
}


// Event Listener for adding a book
document.getElementById("book-form").addEventListener('submit', function(e) {
    // get values from form
    const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;

    // create a new book object
    const book = new Book(title, author, isbn)

    // Start up UI controller
    const ui = new UI();

    // validate input
    if (title === '' || author === '' || isbn === '') {
        // show error alert
        ui.showAlert("Please fill in all fields", "error");
    } else {
        // Add book to list
        ui.addBook(book);

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
    const ui = new UI();

    // Delete book
     const deleted = ui.deleteBook(e.target);

    // show success if book was deleted
    if (deleted) {
        // Show Alert when book is deleted
        ui.showAlert("Book Deleted", "success");
    }

    e.preventDefault();
});