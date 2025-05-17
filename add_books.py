"""
Script to add sample books to the database
Run with: python add_books.py
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tgreeb.settings')
django.setup()

# Import after Django setup
from myapp.models import Book

# Sample books data
sample_books = [
    {
        'title': 'How to Win Friends and Influence People',
        'author': 'Dale Carnegie',
        'category': 'Self-Help',
        'description': 'A timeless classic that teaches you how to improve your social skills, communicate effectively, and build meaningful relationships in both personal and professional life.',
    },
    {
        'title': 'The Psychology of Money',
        'author': 'Morgan Housel',
        'category': 'Finance',
        'description': 'Explores the complex relationship between psychology and money, offering valuable insights into how people think about wealth and make financial decisions.',
    },
    {
        'title': 'The Power Of Now',
        'author': 'Eckhart Tolle',
        'category': 'Spirituality',
        'description': 'A guide to spiritual enlightenment that emphasizes the importance of living in the present moment to find true happiness and peace.',
    },
    {
        'title': 'Coraline',
        'author': 'Neil Gaiman',
        'category': 'Fantasy',
        'description': 'A dark fantasy novella about a curious girl who discovers a parallel world that seems perfect but hides sinister secrets.',
    },
    {
        'title': 'Harry Potter and the Philosopher\'s Stone',
        'author': 'J.K. Rowling',
        'category': 'Fantasy',
        'description': 'The magical story of a young wizard\'s journey through the wizarding world, filled with friendship, adventure, and the battle between good and evil.',
    },
    {
        'title': 'Diary of a Wimpy Kid',
        'author': 'Jeff Kinney',
        'category': 'Children\'s Fiction',
        'description': 'A humorous account of Greg Heffley\'s family vacation gone wrong, filled with the typical middle-schooler\'s struggles and misadventures.',
    },
    {
        'title': 'Crime and Punishment',
        'author': 'Fyodor Dostoevsky',
        'category': 'Classic',
        'description': 'A psychological novel about guilt and redemption, following the mental anguish and moral dilemmas of Raskolnikov after he commits murder.',
    },
    {
        'title': 'Dune',
        'author': 'Frank Herbert',
        'category': 'Science Fiction',
        'description': 'An epic science fiction novel set in a distant future amid a feudal interstellar society where noble houses control individual planets.',
    },
    {
        'title': 'A Good Girl\'s Guide to Murder',
        'author': 'Holly Jackson',
        'category': 'Mystery',
        'description': 'A thrilling mystery about a girl investigating a murder that took place in her town, uncovering secrets that some would prefer to stay buried.',
    },
    {
        'title': 'The Adventures of Sherlock Holmes',
        'author': 'Arthur Conan Doyle',
        'category': 'Mystery',
        'description': 'A collection of detective stories featuring the brilliant Sherlock Holmes and his loyal friend Dr. Watson as they solve mysterious and complex cases.',
    }
]

def main():
    # Check if there are already books in the database
    books_count = Book.objects.count()
    if books_count > 0:
        print(f"There are already {books_count} books in the database.")
        answer = input("Do you want to add more books? (y/n): ").lower()
        if answer != 'y':
            print("Operation cancelled.")
            return

    books_added = 0
    books_skipped = 0

    # Add books to database
    for book_data in sample_books:
        # Check if book already exists
        if Book.objects.filter(title=book_data['title'], author=book_data['author']).exists():
            print(f"Book '{book_data['title']}' by {book_data['author']} already exists. Skipping.")
            books_skipped += 1
            continue

        # Create book
        book = Book.objects.create(
            title=book_data['title'],
            author=book_data['author'],
            category=book_data['category'],
            description=book_data['description']
        )
        books_added += 1
        print(f"Added: {book_data['title']}")

    print(f"Added {books_added} books to the database. Skipped: {books_skipped}.")

if __name__ == "__main__":
    main() 