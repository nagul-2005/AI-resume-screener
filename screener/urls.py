from django.urls import path
from . import views

urlpatterns = [
    path('api/screen/', views.screen_resume, name='screen_resume'),
    path('api/result/<int:pk>/', views.get_result, name='get_result'),
    path('api/history/', views.history, name='history'),
]