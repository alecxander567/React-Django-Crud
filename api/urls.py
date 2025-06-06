from django.urls import path
from .views import signup_view, login_view, UserListView, logout_view

urlpatterns = [
    path('api/signup/', signup_view, name='signup'),
    path('api/login/', login_view, name='login'),
    path('api/users/', UserListView.as_view(), name='users'),
    path('api/logout/', logout_view, name='logout'),
]
