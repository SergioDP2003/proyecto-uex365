from django.urls import path
from .views import *

urlpatterns = [
    path("transaction/", TransactionCRUDGeneralView.as_view()),
    path("transaction/<int:id>/", TransactionCRUDDetailView.as_view()),
    path("transaction_type/", TransactionTypeCRUDGeneralView.as_view()),
    path("transaction_type/<int:id>/", TransactionTypeCRUDDetailView.as_view()),
]