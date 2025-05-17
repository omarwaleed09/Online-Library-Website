document.addEventListener('DOMContentLoaded', function() {
    const pathSegments = window.location.pathname.split('/');
    const bookId = pathSegments[pathSegments.length - 2]; // Extract the ID from the URL path

    const loadingSpinner = document.getElementById('loading-spinner');
    const bookDetails = document.getElementById('book-details');

    loadingSpinner.style.display = 'flex';
    bookDetails.style.display = 'none';

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    function loadBookDetails() {
        fetch(`/api/books/${bookId}/`, {
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
        .then(book => {
            loadingSpinner.style.display = 'none';
            bookDetails.style.display = 'flex';

            const html = `
                <div class="book-image-container">
                    <img class="book-image" src="${book.image || '/static/images/default-book.jpg'}" alt="${book.title}">
                </div>
                <div class="book-info">
                    <h2>${book.title}</h2>
                    <p class="author">By ${book.author}</p>
                    <p class="category">Category: ${book.category}</p>
                    <div class="description">
                        <h3>Description</h3>
                        <p>${book.description}</p>
                    </div>
                </div>
            `;

            bookDetails.innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching book details:', error);
            loadingSpinner.style.display = 'none';
            bookDetails.style.display = 'block';
            
            bookDetails.innerHTML = `
                <div class="message error">
                    An error occurred while loading book details. Please try again later.
                </div>
            `;
        });
    }

    loadBookDetails();
    
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Refresh';
    refreshButton.className = 'refresh-button';
    refreshButton.addEventListener('click', loadBookDetails);
    document.querySelector('.book-details-container').prepend(refreshButton);
});