from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Book, BorrowedBook
from .serializers import BookSerializer, BorrowedBookSerializer
from django.shortcuts import get_object_or_404


@api_view(['POST'])
def add_book(request):
    serializer = BookSerializer(data=request.data)
    if serializer.is_valid():
        book = serializer.save()
        book.is_available = True
        book.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def book_list(request):
    search_query = request.GET.get('search', '')
    if search_query:
        books = Book.objects.filter(title__icontains=search_query)
    else:
        books = Book.objects.all()
    serializer = BookSerializer(books, many=True,context={'request': request})
    return Response(serializer.data)


@api_view(['GET', 'PUT'])
def edit_book(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BookSerializer(book)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_book(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

    book.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def book_detail(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = BookSerializer(book)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def borrowed_book_list(request):
    """Get all books borrowed by the current user"""
    borrowed_books = BorrowedBook.objects.filter(user=request.user)
    serializer = BorrowedBookSerializer(borrowed_books, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def borrow_book(request, pk):
    """Borrow a book"""
    book = get_object_or_404(Book, pk=pk)
    
    if not book.is_available:
        return Response({'error': 'This book is already borrowed by someone else'}, status=status.HTTP_400_BAD_REQUEST)
    
    if BorrowedBook.objects.filter(user=request.user, book=book).exists():
        return Response({'error': 'You have already borrowed this book'}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = BorrowedBookSerializer(
        data={'book_id': pk}, 
        context={'request': request}
    )
    
    if serializer.is_valid():
        book.is_available = False
        book.save()
        
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def return_book(request, pk):
    """Return a borrowed book"""
    borrowed_book = get_object_or_404(BorrowedBook, pk=pk, user=request.user)
    
    book = borrowed_book.book
    book.is_available = True
    book.save()
    
    borrowed_book.delete()
    
    return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(['POST'])
def edit_image(request, book_id):
    try:
        book = get_object_or_404(Book, id=book_id)

        if 'image' not in request.FILES:
            return Response({'error': 'No image uploaded'}, status=400)

        image = request.FILES['image']
        book.image.save(image.name, image)
        book.save()

        return Response({'imageUrl': book.image.url})

    except Exception as e:
        return Response({'error': str(e)}, status=500)