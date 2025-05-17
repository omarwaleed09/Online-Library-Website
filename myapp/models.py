from django.db import models
from django.contrib.auth.models import User


class Book(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='book_images/', null=True, blank=True)
    author = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    description = models.TextField()
    is_available = models.BooleanField(default=True)

class BorrowedBook(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='borrowed_books')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='borrowers')
    borrowed_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField(null=True, blank=True)
    
    class Meta:
        unique_together = ('user', 'book')  

    def __str__(self):
        return f"{self.user.username} borrowed {self.book.title}"