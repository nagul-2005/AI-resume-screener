from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('api/signup/', views.signup_view, name='signup'),
    path('api/login/', views.login_view, name='login'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]