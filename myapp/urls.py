from django.contrib import admin
from django.urls import path, include
from . import views
from . import def_functions


urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.login_page, name='login'),
    path('signup/', views.signup, name='signup'),
    path('user_home/', views.user_home, name='user_home'),
    path('api/addnewbook', def_functions.add_book, name='addnewbook'),
    path('addnewbook', views.addnewbook, name='addnewbook'),
    path('api/booklist', def_functions.book_list, name='booklist'),
    path('api/books/<int:pk>/', def_functions.book_detail, name='book_detail'),
    path('api/borrowed-books/', def_functions.borrowed_book_list, name='borrowed_book_list'),
    path('api/books/<int:pk>/borrow/', def_functions.borrow_book, name='borrow_book'),
    path('api/borrowed-books/<int:pk>/return/', def_functions.return_book, name='return_book'),
    path('viewbooksadmin/', views.viewbooksadmin, name='viewbooksadmin'),
    path('viewbooksuser', views.viewbooksuser, name='viewbooksuser'),
    path('borrowedbooks', views.borrowedbooks, name='borrowedbooks'),
    path('bookdetails_user/<int:book_id>/', views.bookdetails_user, name='bookdetails_user'),
    path('api/books/<int:pk>/edit/', def_functions.edit_book, name='edit_book'),
    path('api/books/<int:pk>/delete/', def_functions.delete_book, name='delete_book'),
    path('adminhome/', views.adminhome, name='admin_home'),
    path('logout/', views.logout_view, name='logout'),
    path('api/books/<int:book_id>/upload_book_image/', def_functions.edit_image, name='upload_book_image'),
    
]
