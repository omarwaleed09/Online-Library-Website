document.addEventListener('DOMContentLoaded', function() {
    const borrowedBooksContainer = document.getElementById('borrowed-books');
    const unborrowSelect = document.getElementById('unborrow-select');
    const unborrowButton = document.getElementById('unborrow-button');
    const loadingSpinner = document.getElementById('loading-spinner');
    const messageContainer = document.getElementById('message-container');

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
    function showMessage(message, type) {
        messageContainer.innerHTML = '';
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}-message`;
        messageElement.textContent = message;
        
        messageContainer.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
    
    function loadBorrowedBooks() {
        loadingSpinner.style.display = 'flex';
        borrowedBooksContainer.innerHTML = '';
        
        unborrowSelect.innerHTML = '<option value="">Select a book to return</option>';
        
        fetch('/api/borrowed-books/', {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(borrowedBooks => {
            loadingSpinner.style.display = 'none';
            
            if (borrowedBooks.length === 0) {
                borrowedBooksContainer.innerHTML = `
                    <div class="no-books-message">
                        <p>You have not borrowed any books yet.</p>
                    </div>
                `;
                return;
            }
            
            borrowedBooks.forEach(borrowedBook => {
                const book = borrowedBook.book_details;
                
                const bookCard = document.createElement('div');
                bookCard.className = 'book-card';
                
                const borrowedDate = new Date(borrowedBook.borrowed_date);
                const formattedDate = borrowedDate.toLocaleDateString();
                
                bookCard.innerHTML = `
                    <img src="${book.image || '/static/images/default-book.jpg'}" alt="${book.title}">
                    <div class="book-name">${book.title}</div>
                    <div class="book-author">by ${book.author}</div>
                    <div class="borrowed-date">Borrowed on: ${formattedDate}</div>
                `;
                
                borrowedBooksContainer.appendChild(bookCard);
                
                const option = document.createElement('option');
                option.value = borrowedBook.id;
                option.textContent = book.title;
                unborrowSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching borrowed books:', error);
            loadingSpinner.style.display = 'none';
            showMessage('Failed to load borrowed books. Please try again.', 'error');
        });
    }
    
    unborrowButton.addEventListener('click', function() {
        const selectedBookId = unborrowSelect.value;
        
        if (!selectedBookId) {
            showMessage('Please select a book to return', 'error');
            return;
        }
        
        unborrowButton.disabled = true;
        unborrowButton.textContent = 'Returning...';
        
        fetch(`/api/borrowed-books/${selectedBookId}/return/`, {
            method: 'DELETE',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            showMessage('Book returned successfully!', 'success');
            
            loadBorrowedBooks();
        })
        .catch(error => {
            console.error('Error returning book:', error);
            showMessage('Failed to return book. Please try again.', 'error');
        })
        .finally(() => {
            unborrowButton.disabled = false;
            unborrowButton.textContent = 'Return Book';
        });
    });
    
    loadBorrowedBooks();
});
