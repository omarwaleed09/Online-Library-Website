
document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/booklist')
        .then(response => response.json())
        .then(data => {
            const bookList = document.getElementById('book-list');
            bookList.innerHTML = '';
            data.forEach(book => {
                const bookDiv = document.createElement('div');
                bookDiv.classList.add('book-item');

                let imageHtml = '';
                if (book.image) {
                    imageHtml = `<img src="${book.image}" alt="${book.title}" class="book-image">`;
                }

                bookDiv.innerHTML = `
                    ${imageHtml}
                    <h3>${book.title}</h3>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Category:</strong> ${book.category}</p>
                    <p>${book.description}</p>
                `;
                bookList.appendChild(bookDiv);
            });
        })
        .catch(error => {
            document.getElementById('book-list').innerHTML = '<p>Error loading books.</p>';
            console.error(error);
        });
});
