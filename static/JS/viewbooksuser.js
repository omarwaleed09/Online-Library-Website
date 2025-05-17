document.addEventListener('DOMContentLoaded', function() {
    const booksContainer = document.getElementById('books-container');
    const searchQuery = document.getElementById('search_query');
    const searchButton = document.getElementById('search-button');
    const resetButton = document.getElementById('reset-button');
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
    
    function loadBooks(query = '') {
        loadingSpinner.style.display = 'flex';
        booksContainer.innerHTML = '';
        
        let apiUrl = '/api/booklist';
        if (query) {
            apiUrl += `?search=${encodeURIComponent(query)}`;
        }
        
        console.log('Fetching books from:', apiUrl); 
        
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken
            }
        })
        .then(response => {
            console.log('Response status:', response.status); 
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(books => {
            console.log('Books received:', books); 
            
            loadingSpinner.style.display = 'none';
            
            if (books.length === 0) {
                booksContainer.innerHTML = `
                    <div class="no-books-message">
                        <p>No books found. Please try another search.</p>
                    </div>
                `;
                return;
            }
            
            const table = document.createElement('table');
            
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Book Name</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Action</th>
                </tr>
            `;
            table.appendChild(thead);
            
            const tbody = document.createElement('tbody');
            
            books.forEach((book, index) => {
                const tr = document.createElement('tr');
                
                const shortDescription = book.description.length > 100 
                    ? book.description.substring(0, 100) + '...' 
                    : book.description;
                
                const isAlreadyBorrowed = book.is_borrowed;
                const isAvailable = book.is_available;
                
                let borrowButtonText = 'Borrow';
                let borrowedClass = '';
                let isDisabled = false;
                
                if (isAlreadyBorrowed) {
                    borrowButtonText = 'Borrowed';
                    borrowedClass = 'borrowed';
                    isDisabled = true;
                } else if (!isAvailable) {
                    borrowButtonText = 'Unavailable';
                    borrowedClass = 'unavailable';
                    isDisabled = true;
                }
                
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td><a href="/bookdetails_user/${book.id}/">${book.title}</a></td>
                    <td>${book.author}</td>
                    <td>${book.category}</td>
                    <td>${shortDescription}</td>
                    <td><button class="borrow-button ${borrowedClass}" data-book-id="${book.id}" ${isDisabled ? 'disabled' : ''}>${borrowButtonText}</button></td>
                `;
                
                tbody.appendChild(tr);
            });
            
            table.appendChild(tbody);
            booksContainer.appendChild(table);
            
            document.querySelectorAll('.borrow-button').forEach(button => {
                button.addEventListener('click', handleBorrowBook);
            });
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            loadingSpinner.style.display = 'none';
            showMessage('Failed to load books. Please try again.', 'error');
        });
    }
    
    function handleBorrowBook(event) {
        const button = event.target;
        const bookId = button.getAttribute('data-book-id');
        
        button.disabled = true;
        button.textContent = 'Borrowing...';
        
        fetch(`/api/books/${bookId}/borrow/`, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken
            }
        })
        .then(response => {
            if (!response.ok) {
                // Extract error message from response if possible
                return response.json().then(data => {
                    throw new Error(data.error || 'Failed to borrow book');
                });
            }
            return response.json();
        })
        .then(data => {
            showMessage('Book borrowed successfully!', 'success');
            
            // Change button appearance and disable it
            button.textContent = 'Borrowed';
            button.disabled = true;
            button.classList.add('borrowed');
        })
        .catch(error => {
            console.error('Error borrowing book:', error);
            // Re-enable button
            button.disabled = false;
            button.textContent = 'Borrow';
            
            showMessage(error.message || 'Failed to borrow book. Please try again.', 'error');
        });

    }

    
    searchButton.addEventListener('click', function() {
        const query = searchQuery.value.trim();
        if (query) {
            loadBooks(query);
        } else {
            showMessage('Please enter a search term', 'info');
        }
    });
    
    resetButton.addEventListener('click', function() {
        searchQuery.value = '';
        loadBooks();
    });
 
    searchQuery.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchButton.click();
        }
    });
    
    loadBooks();
});