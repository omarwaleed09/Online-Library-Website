const bookTableBody = document.getElementById('book-table-body');

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function fetchBooks() {
    fetch('/api/booklist')
        .then(response => response.json())
        .then(data => {
            renderBooks(data);
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            bookTableBody.innerHTML = '<tr><td colspan="7">Failed to load books.</td></tr>';
        });
}

function renderBooks(books) {
    bookTableBody.innerHTML = '';
    books.forEach(book => {
        const row = document.createElement('tr');
        const imageUrl = book.image ? book.image : '/path/to/default-image.jpg';
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${escapeHtml(book.title)}</td>
            <td>${escapeHtml(book.author)}</td>
            <td>${escapeHtml(book.category)}</td>
            <td>${escapeHtml(book.description)}</td>
            <td>
                <img data-book-id="${book.id}" src="${imageUrl}" alt="Book Image" />
                <button class="upload-btn" onclick="uploadImage(${book.id})">Upload New Image</button>
            </td>
            <td>
                <button onclick="editBook(${book.id})">Edit</button>
                <button onclick="deleteBook(${book.id})">Delete</button>
            </td>
        `;
        bookTableBody.appendChild(row);
    });
}



// Handle image upload for a specific book
function uploadImage(bookId) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        const csrftoken = getCookie('csrftoken');

        fetch(`/api/books/${bookId}/upload_book_image/`, {
            method: 'POST',  // change PUT to POST
            headers: {
                'X-CSRFToken': csrftoken
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to upload image');
            return response.json();
        })
        .then(data => {
            if (data.imageUrl) {
                // Update the image in the UI
                const imgElement = document.querySelector(`img[data-book-id="${bookId}"]`);
                imgElement.src = data.imageUrl;
            }
        })
        .catch(error => alert(error));
    };
    fileInput.click();
}





// Edit a book: fetch current data, prompt user, then update via PUT
function editBook(bookId) {
    fetch(`/api/books/${bookId}/edit/`, { method: 'GET' })
        .then(response => {
            if (!response.ok) throw new Error('Book not found');
            return response.json();
        })
        .then(book => {
            const newTitle = prompt("Enter new book name:", book.title);
            if (newTitle === null) return; // User cancelled
            const newAuthor = prompt("Enter new author:", book.author);
            if (newAuthor === null) return;
            const newCategory = prompt("Enter new category:", book.category);
            if (newCategory === null) return;
            const newDescription = prompt("Enter new description:", book.description);
            if (newDescription === null) return;

            const csrftoken = getCookie('csrftoken');

            fetch(`/api/books/${bookId}/edit/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({
                    title: newTitle,
                    author: newAuthor,
                    category: newCategory,
                    description: newDescription
                })
            })
            .then(response => {
                if (!response.ok) throw new Error('Failed to update book');
                return response.json();
            })
            .then(() => {
                fetchBooks(); // Refresh the book list after update
            })
            .catch(error => alert(error));
        })
        .catch(error => alert(error));
}

// Delete a book by ID
function deleteBook(bookId) {
    if (!confirm("Are you sure you want to delete this book?")) return;

    const csrftoken = getCookie('csrftoken');

    fetch(`/api/books/${bookId}/delete/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': csrftoken,
        }
    })
    .then(response => {
        if (response.status === 204) {
            fetchBooks(); // Refresh list after deletion
        } else {
            throw new Error('Failed to delete book');
        }
    })
    .catch(error => alert(error));
}

// Escape HTML to prevent XSS attacks
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Initial load of books when page loads
fetchBooks();
