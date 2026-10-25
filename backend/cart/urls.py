from django.urls import path
from .views import *

urlpatterns = [
    path("cart/", CartView.as_view()),
    path("cart/add/", AddToCartView.as_view()),
    path("cart/clear/", ClearCartView.as_view()),
    path("cart/add-option/", AddOptionToBetView.as_view()),
    path("cart/bet/<str:bet_cart_id>/option/<int:option_id>/",RemoveOptionFromBetView.as_view()),
    path("cart/checkout/", CheckoutView.as_view()),
]