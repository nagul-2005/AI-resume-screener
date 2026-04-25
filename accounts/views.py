from django.shortcuts import render,redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from .forms import SignupForm
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def signup_view(request):
    if request.method == 'GET':
        return Response({'message': 'Signup API working ✅'})

    username = request.data.get('username', '').strip()
    email = request.data.get('email', '').strip()
    password = request.data.get('password', '').strip()

    # ← add this validation
    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    tokens = get_tokens_for_user(user)
    return Response({
        'message': 'Account created successfully',
        'tokens': tokens,
        'username': user.username
    }, status=status.HTTP_201_CREATED)
@api_view(['GET','POST'])
@permission_classes([AllowAny])
def login_view(request):
        if request.method == 'GET':
            return Response({'message': 'Login API is working'})
             
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request,username=username,password=password)

        if user:
            tokens = get_tokens_for_user(user)
            return Response({
                'message': 'Login successfull',
                'tokens': tokens,
                'username': user.username
            })
        
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

def logout_view(request):
    logout(request)
    return redirect('login')

