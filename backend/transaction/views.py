from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, mixins
from .models import TransactionType, Transaction
from .serializers import *
from .controller import *

# Create your views here.

#-------------------------- View TRANSACTION ------------------------------------------

class TransactionCRUDGeneralView(APIView):

    # GET /transaction/
    @extend_schema(responses=TransactionListSerializer)
    def get(self, request):
        transactions = TransactionController.get_transactions()
        return Response(transactions, status=status.HTTP_200_OK)
    
    # POST /transaction/
    @extend_schema(request=TransactionCreateSerializer, responses=TransactionListSerializer)
    def post(self, request):
        transaction, created = TransactionController.create_transaction(request.data, request.user)
        if created:
            return Response(transaction, status=status.HTTP_201_CREATED)
        else:
            return Response(transaction, status=status.HTTP_400_BAD_REQUEST)

class TransactionCRUDDetailView(APIView):
    
    # GET /transaction/{id}/
    @extend_schema(responses=TransactionListSerializer)
    def get(self, request, id=None):
        transaction = TransactionController.get_one_transaction(id)
        return Response(transaction)

    # PUT /transaction/{id}/
    @extend_schema(request=TransactionEditSerializer, responses=TransactionListSerializer)
    def put(self, request, id):
        transaction, updated = TransactionController.edit_transaction(request.data,id)
        if updated:
            return Response(transaction, status=status.HTTP_200_OK)
        else:
            return Response(transaction, status=status.HTTP_400_BAD_REQUEST)
    
    # DELETE /transaction/{id}/
    @extend_schema()
    def delete(self, request, id):
        deleted, message = TransactionController.delete_transaction(id)
        if deleted:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return self.response({"error": message}, status=status.HTTP_404_NOT_FOUND)
        
#-------------------------- View TRANSACTION_TYPE ------------------------------------------

class TransactionTypeCRUDGeneralView(APIView):

    # GET /transaction_type/
    @extend_schema(responses=TransactionTypeSerializer)
    def get(self, request):
        transaction_types = TransactionTypeController.get_transaction_types()
        return Response(transaction_types, status=status.HTTP_200_OK)
    
    # POST /transaction_type/
    @extend_schema(request=TransactionTypeSerializer, responses=TransactionTypeSerializer)
    def post(self, request):
        transaction_type, created = TransactionTypeController.create_transaction_type(request.data, request.user)
        if created:
            return Response(transaction_type, status=status.HTTP_201_CREATED)
        else:
            return Response(transaction_type, status=status.HTTP_400_BAD_REQUEST)

class TransactionTypeCRUDDetailView(APIView):
    
    # GET /transaction_type/{id}/
    @extend_schema(responses=TransactionTypeSerializer)
    def get(self, request, id=None):
        transaction_type = TransactionTypeController.get_one_transaction_type(id)
        return Response(transaction_type)

    # PUT /transaction_type/{id}/
    @extend_schema(request=TransactionTypeSerializer, responses=TransactionTypeSerializer)
    def put(self, request, id):
        transaction_type, updated = TransactionTypeController.edit_transaction_type(request.data,id)
        if updated:
            return Response(transaction_type, status=status.HTTP_200_OK)
        else:
            return Response(transaction_type, status=status.HTTP_400_BAD_REQUEST)
    
    # DELETE /transaction_type/{id}/
    @extend_schema()
    def delete(self, request, id):
        deleted, message = TransactionTypeController.delete_transaction_type(id)
        if deleted:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return self.response({"error": message}, status=status.HTTP_404_NOT_FOUND)
 