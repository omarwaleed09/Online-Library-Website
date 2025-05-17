from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage


def admin_required(view_func):
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('login')
        if not request.user.is_staff:
            return HttpResponseForbidden("You do not have admin access.")
        return view_func(request, *args, **kwargs)
    return wrapper


def home(request):
    if request.user.is_authenticated:
        if request.user.is_staff:
            return redirect('admin_home')
        else:
            return redirect('user_home')
    return render(request, 'home.html')


def login_page(request):
    if request.method == 'GET' and request.GET.get('check_status') == 'true' and request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        if request.user.is_authenticated:
            return JsonResponse({
                'is_authenticated': True,
                'is_staff': request.user.is_staff,
                'username': request.user.username
            })
        else:
            return JsonResponse({
                'is_authenticated': False
            })

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)

        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.content_type == 'application/json'

        if user is not None:
            login(request, user)
            if is_ajax:
                return JsonResponse({
                    'success': True,
                    'is_staff': user.is_staff,
                    'redirect_url': '/adminhome' if user.is_staff else '/user_home/'
                })
            else:
                if user.is_staff:
                    return redirect('admin_home')
                else:
                    return redirect('user_home')
        elif is_ajax:
            return JsonResponse({
                'success': False,
                'error': 'Invalid username or password'
            })

    return render(request, 'login.html')


def signup(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        user_role = request.POST.get('user_role', 'user')

        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.content_type == 'application/json'

        if password == confirm_password:
            if not User.objects.filter(username=username).exists():
                user = User.objects.create_user(username=username, email=email, password=password)
                if user_role == 'admin':
                    user.is_staff = True
                    user.save()
                if is_ajax:
                    return JsonResponse({
                        'success': True,
                        'message': 'Account created successfully. Please log in.',
                        'redirect_url': '/login/'
                    })
                else:
                    return redirect('login')
            elif is_ajax:
                return JsonResponse({
                    'success': False,
                    'error': 'Username already exists'
                })
        elif is_ajax:
            return JsonResponse({
                'success': False,
                'error': 'Passwords do not match'
            })

    return render(request, 'signup.html')


@login_required
def user_home(request):
    if request.user.is_staff:
        return redirect('admin_home')
    return render(request, 'userhome.html')


@admin_required
def addnewbook(request):
    return render(request, 'addnewbook.html')


@admin_required
def bookdetails_admin(request):
    return render(request, 'bookdetails_admin.html')


@admin_required
def viewbooksadmin(request):
    return render(request, 'viewbooksadmin.html')


@admin_required
def adminhome(request):
    return render(request, 'adminhome.html')


def logout_view(request):
    logout(request)
    return redirect('home')


@login_required
def viewbooksuser(request):
    if request.user.is_staff:
        return redirect('viewbooksadmin')
    return render(request, 'viewbooksuser.html')


@login_required
def borrowedbooks(request):
    if request.user.is_staff:
        return redirect('admin_home')
    return render(request, 'borrowedbooks.html')


@login_required
def bookdetails_user(request, book_id):
    if request.user.is_staff:
        return redirect('admin_home')
    return render(request, 'bookdetails_user.html')


@csrf_exempt
def upload_book_image(request, book_id):
    book = Book.objects.get(id=book_id)
    print("file name")
    if request.method == 'POST' and request.FILES['image']:
        image = request.FILES['image']
        file_name = default_storage.save(f'books/{book_id}/{image.name}', image)
        print("file name",file_name)
        book.image = file_name
        book.save()
        return JsonResponse({'imageUrl': book.image.url})

    return JsonResponse({'error': 'Failed to upload image'}, status=400)



@api_view(['GET'])
def book_list(request):
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=401)

    books = Book.objects.all()
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)