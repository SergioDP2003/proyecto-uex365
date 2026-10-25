from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    UserStateViewSet,
    GroupViewSet,
    UserViewSet,
    RegisterView,
    LogoutView
)

routerUser = DefaultRouter()

routerUser.register(prefix="user_state", basename="user_state", viewset=UserStateViewSet)

routerUser.register(prefix="group", basename="group", viewset=GroupViewSet)

routerUser.register(prefix="user", basename="user", viewset=UserViewSet)


urlPatterns = [
    path('',include(routerUser.urls)),
    path('register/', RegisterView.as_view(), name='register'),
]

