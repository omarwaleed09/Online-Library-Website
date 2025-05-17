document.addEventListener('DOMContentLoaded', function() {
    const booksContainer = document.getElementById('books-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
    loadingSpinner.style.display = 'flex';
    
    fetch('/api/booklist', {
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
    .then(books => {
        loadingSpinner.style.display = 'none';
        
        if (books.length === 0) {
            booksContainer.innerHTML = '<p class="no-books">No books available at the moment.</p>';
            return;
        }
        
        books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            
            const img = document.createElement('img');
            if (book.image) {
                img.src = book.image;
            } else {
                img.src = '/static/images/default-book.jpg'; 
            }
            img.alt = book.title;
            
            const title = document.createElement('h3');
            title.textContent = book.title;
            
            const author = document.createElement('p');
            author.textContent = book.author;
            
            bookCard.appendChild(img);
            bookCard.appendChild(title);
            bookCard.appendChild(author);
            
            bookCard.addEventListener('click', function() {
                window.location.href = `/bookdetails_user/${book.id}`;
            });
            
            bookCard.style.cursor = 'pointer';
            
            booksContainer.appendChild(bookCard);
        });
    })
    .catch(error => {
        console.error('Error fetching books:', error);
        loadingSpinner.style.display = 'none';
        booksContainer.innerHTML = `
            <div class="message error">
                An error occurred while loading books. Please try again later.
            </div>
        `;
    });
});
