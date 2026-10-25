from django.contrib import admin
from django.urls import path, re_path
from user import views
from user.views import MeView, MeStatsView, RankingView
from drf_spectacular.views import SpectacularRedocView, SpectacularSwaggerView, SpectacularAPIView
from django.urls import path, include
from bet.router import *
from event.urls import *
from exchange.urls import *
from transaction.urls import *
from user.router import *
from cart.urls import *
from roulette.urls import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('admin/', admin.site.urls),
    path('me/', MeView.as_view(), name='me'),
    path('me/stats/', MeStatsView.as_view(), name='me-stats'),
    path('ranking/', RankingView.as_view(), name='ranking'),
    path("", include(routerBet.urls)),
    path("", include("event.urls")),
    path("", include("exchange.urls")),
    path("", include("transaction.urls")),
    path("", include(routerUser.urls)),
    path("", include("cart.urls")),
    path("", include("roulette.urls")),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', views.RegisterView.as_view(), name='register'),
    path('api/logout/', views.LogoutView.as_view(), name='logout'),
    path('api/google-login/', views.GoogleLoginView.as_view(), name='google_login'),
    path('api/me/', views.MeView.as_view(), name='me'),
]