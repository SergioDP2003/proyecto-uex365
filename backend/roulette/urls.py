from django.urls import path
from .views import RouletteSpinView

urlpatterns = [
    path("roulette/spin/", RouletteSpinView.as_view()),
]