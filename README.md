# Online Library Website

## Overview
Role-based online library system built with Django.  
Admins manage books.  
Users search and borrow books.

## Features

### Admin
- Register and log in  
- Add new books (ID, name, author, category, description)  
- View all books  
- Edit book details  
- Delete books  

### User
- Register and log in  
- Search books by title, author, or category  
- View books with availability status  
- View book details  
- Borrow available books  
- View borrowed books list  

## Tech Stack
- **Backend:** Python, Django  
- **Frontend:** HTML, CSS, JavaScript  
- **Database:** SQLite  

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/omarwaleed09/Online-Library-Website  
cd Online-Library-Website
```

### 2. Create virtual environment
```bash
python -m venv env
env\Scripts\activate     # Windows  
source env/bin/activate  # Linux/macOS
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Apply migrations
```bash
python manage.py migrate
```

### 5. Run the server
```bash
python manage.py runserver
```

Visit http://127.0.0.1:8000 in your browser.

## Structure

- `templates/` — HTML files  
- `static/` — CSS, JS files  
- `myapp/` — Views, models, URLs, forms  

## Notes

- Users select role (Admin/User) at signup  
- Admin sees admin dashboard  
- User sees user dashboard  
- Borrowed books are user-specific  

