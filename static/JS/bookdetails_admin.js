
        const urlParams = new URLSearchParams(window.location.search);
        const bookId = urlParams.get("id");

        const books = [
            { id: 1, name: "How to Win Friends and Influence People", author: "Dale Carnegie", category: "Self-Help", description: "A timeless classic that teaches you how to improve your social skills, communicate effectively, and build meaningful relationships in both personal and professional life.", image: "images/img1.jpg" },
            { id: 2, name: "The Psychology of Money", author: "Morgan Housel", category: "Finance", description: "Explores the complex relationship between psychology and money, offering valuable insights into how people think about wealth and make financial decisions.", image: "images/img2.jpg" },
            { id: 3, name: "The Power Of Now", author: "Eckhart Tolle", category: "Spirituality", description: "A guide to spiritual enlightenment that emphasizes the importance of living in the present moment to find true happiness and peace.", image: "images/img3.jpg" },
            { id: 4, name: "Coraline", author: "Neil Gaiman", category: "Fantasy/Horror", description: "A dark fantasy novella about a curious girl who discovers a parallel world that seems perfect but hides sinister secrets.", image: "images/img4.jpg" },
            { id: 5, name: "Harry Potter", author: "J.K. Rowling", category: "Fantasy", description: "The magical story of a young wizard's journey through the wizarding world, filled with friendship, adventure, and the battle between good and evil.", image: "images/img5.jpg" },
            { id: 6, name: "Diary of a Wimpy Kid 'The Getaway'", author: "Jeff Kinney", category: "Children's Fiction", description: "A humorous account of Greg Heffley's family vacation gone wrong, filled with the typical middle-schooler's struggles and misadventures.", image: "images/img6.jpg" },
            { id: 7, name: "Crime and Punishment", author: "Fyodor Dostoevsky", category: "Classic Literature", description: "A profound psychological novel exploring themes of guilt, redemption, and morality through the story of a desperate young man who commits a crime.", image: "images/img7.jpg" },
            { id: 8, name: "Dune", author: "Frank Herbert", category: "Science Fiction", description: "An epic science fiction saga set in a distant future amidst a feudal interstellar society, dealing with themes of politics, religion, and ecology.", image: "images/img8.jpg" },
            { id: 9, name: "Good Girl's Guide to Murder", author: "Holly Jackson", category: "Mystery/Thriller", description: "A gripping mystery about a determined teenager investigating a closed murder case in her town, uncovering shocking truths along the way.", image: "images/img9.jpg" },
            { id: 10, name: "Sherlock Holmes", author: "Arthur Conan Doyle", category: "Mystery", description: "A collection of brilliant detective stories featuring the iconic Sherlock Holmes and his loyal friend Dr. Watson as they solve London's most puzzling crimes.", image: "images/img10.jpg" },
            { id: 11, name: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Classic Literature", description: "A tragic love story set in the Jazz Age, exploring themes of decadence, idealism, and the American Dream through the mysterious millionaire Jay Gatsby.", image: "images/img11.jpg" },
            { id: 12, name: "Project Hail Mary", author: "Andy Weir", category: "Science Fiction", description: "A lone astronaut must save the earth from disaster in this thrilling science fiction adventure filled with scientific problem-solving and interstellar discovery.", image: "images/img12.jpg" },
            { id: 13, name: "Harrow the Ninth", author: "Tamsyn Muir", category: "Science Fantasy", description: "The second book in the Locked Tomb series, featuring necromancers in space, complex political intrigue, and mind-bending narrative twists.", image: "images/img13.jpg" },
            { id: 14, name: "Dead Silence", author: "S.A. Barnes", category: "Horror/Sci-Fi", description: "A chilling space horror about a crew that discovers a ghost ship drifting near the edge of explored space, with something terrifying lurking aboard.", image: "images/img14.jpg" }
        ];

        const book = books.find(b => b.id == bookId);
        const bookDetails = document.getElementById("book-details");

        if (book) {
            bookDetails.innerHTML = `
                <div class="book-image-container">
                    <img class="book-image" src="${book.image}" alt="${book.name}">
                </div>
                <div class="book-info">
                    <h2>${book.name}</h2>
                    <p class="author">By ${book.author}</p>
                    <p class="category">Category: ${book.category}</p>
                    <div class="description">
                        <h3>Description</h3>
                        <p>${book.description}</p>
                    </div>
                </div>
            `;
        } else {
            bookDetails.innerHTML = "<p>Book not found.</p>";
        }
