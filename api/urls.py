from django.urls import path
from .views import signup_view, login_view, UserListView, edit_user, UserDeleteView, logout_view

urlpatterns = [
    path('api/signup/', signup_view, name='signup'),
    path('api/login/', login_view, name='login'),
    path('api/users/', UserListView.as_view(), name='users'),
    path('users/<int:pk>/edit/', edit_user, name='edit-user'),
    path('api/users/<int:pk>/delete/', UserDeleteView.as_view(), name='user-delete'),
    path('api/logout/', logout_view, name='logout'),
] 
