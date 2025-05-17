from rest_framework import serializers
from .models import Book, BorrowedBook

class BookSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)
    is_borrowed = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ['id', 'title', 'image', 'author', 'category', 'description', 'is_borrowed', 'is_available']
    
    def get_is_borrowed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return BorrowedBook.objects.filter(user=request.user, book=obj).exists()
        return False
        
    def create(self, validated_data):
        validated_data['is_available'] = True
        return super().create(validated_data)

class BorrowedBookSerializer(serializers.ModelSerializer):
    book_details = BookSerializer(source='book', read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(source='book', queryset=Book.objects.all(), write_only=True)
    
    class Meta:
        model = BorrowedBook
        fields = ['id', 'book_id', 'book_details', 'borrowed_date', 'due_date']
        
    def create(self, validated_data):
        # Extract the user from the context
        user = self.context['request'].user
        # Get the book from validated_data
        book = validated_data.pop('book')
        # Create the borrowed book
        borrowed_book = BorrowedBook.objects.create(user=user, book=book, **validated_data)
        return borrowed_book


# there is a serializer for each table in the model.py //// model.py includes all the tables im the data base