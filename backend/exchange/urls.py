from django.urls import path
from .views import *

urlpatterns = [
    path("exchange_product/", ExchangeProductCRUDGeneralView.as_view()),
    path("exchange_product/<int:id>/", ExchangeProductCRUDDetailView.as_view()),
    path("exchange_product/available/", ExchangeProductAvailableView.as_view()),
    path("exchange_status/", ExchangeStatusCRUDGeneralView.as_view()),
    path("exchange_status/<int:id>/", ExchangeStatusCRUDDetailView.as_view()),
    path("exchange/", ExchangeCRUDGeneralView.as_view()),
    path("exchange/<int:id>/", ExchangeCRUDDetailView.as_view()),
    path("exchange/user/<int:id>/", ExchangeUserView.as_view()),
]  