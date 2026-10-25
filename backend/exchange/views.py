from django.shortcuts import render
from rest_framework import viewsets, mixins
from .models import ExchangeStatus, ExchangeProduct, Exchange
from .serializers import *
from .controller import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema

# -------------- Views EXCHANGE_PRODUCT -----------------------

class ExchangeProductCRUDGeneralView(APIView):

    # GET /exchange_product/
    @extend_schema(responses=ExchangeProductListSerializer)
    def get(self, request):
        exchange_products = ExchangeProductController.get_exchange_products()
        return Response(exchange_products, status=status.HTTP_200_OK)
    
    # POST /exchange_product/
    @extend_schema(request=ExchangeProductCreateSerializer, responses=ExchangeProductListSerializer)
    def post(self, request):
        exchange_product, created = ExchangeProductController.create_exchange_product(request.data)
        if created:
            return Response(exchange_product, status=status.HTTP_201_CREATED)
        else:
            return Response(exchange_product, status=status.HTTP_400_BAD_REQUEST)

class ExchangeProductCRUDDetailView(APIView):
    
    # GET /exchange_product/{id}/
    @extend_schema(responses=ExchangeProductListSerializer)
    def get(self, request, id=None):
        exchange_product = ExchangeProductController.get_one_exchange_product(id)
        return Response(exchange_product)

    # PUT /exchange_product/{id}/
    @extend_schema(request=ExchangeProductEditSerializer, responses=ExchangeProductListSerializer)
    def put(self, request, id):
        exchange_product, updated = ExchangeProductController.edit_exchange_product(request.data,id)
        if updated:
            return Response(exchange_product, status=status.HTTP_200_OK)
        else:
            return Response(exchange_product, status=status.HTTP_400_BAD_REQUEST)
    
    # DELETE /exchange_product/{id}/
    @extend_schema()
    def delete(self, request, id):
        deleted, message = ExchangeProductController.delete_exchange_product(id)
        if deleted:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return self.response({"error": message}, status=status.HTTP_404_NOT_FOUND)

class ExchangeProductAvailableView(APIView):

    # GET /exchange/available
    def get(self, request):
        exchanges = ExchangeProductController.get_available_exchange_products()
        return Response(exchanges, status=status.HTTP_200_OK)

# -------------- Views EXCHANGE_STATUS -----------------------

class ExchangeStatusCRUDGeneralView(APIView):

    # GET /exchange_status/
    @extend_schema(responses=ExchangeStatusSerializer)
    def get(self, request):
        exchange_status = ExchangeStatusController.get_exchange_status()
        return Response(exchange_status, status=status.HTTP_200_OK)
    
    # POST /exchange_status/
    @extend_schema(request=ExchangeStatusSerializer, responses=ExchangeStatusSerializer)
    def post(self, request):
        exchange_status, created = ExchangeStatusController.create_exchange_status(request.data)
        if created:
            return Response(exchange_status, status=status.HTTP_201_CREATED)
        else:
            return Response(exchange_status, status=status.HTTP_400_BAD_REQUEST)

class ExchangeStatusCRUDDetailView(APIView):
    
    # GET /exchange_status/{id}/
    @extend_schema(responses=ExchangeStatusSerializer)
    def get(self, request, id=None):
        exchange_status = ExchangeStatusController.get_one_exchange_status(id)
        return Response(exchange_status)

    # PUT /exchange_status/{id}/
    @extend_schema(request=ExchangeStatusSerializer, responses=ExchangeStatusSerializer)
    def put(self, request, id):
        exchange_status, updated = ExchangeStatusController.edit_exchange_status(request.data,id)
        if updated:
            return Response(exchange_status, status=status.HTTP_200_OK)
        else:
            return Response(exchange_status, status=status.HTTP_400_BAD_REQUEST)
    
    # DELETE /exchange_status/{id}/
    @extend_schema()
    def delete(self, request, id):
        deleted, message = ExchangeStatusController.delete_exchange_status(id)
        if deleted:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return self.response({"error": message}, status=status.HTTP_404_NOT_FOUND)

# -------------- Views EXCHANGE -----------------------

class ExchangeCRUDGeneralView(APIView):

    # GET /exchange/
    @extend_schema(responses=ExchangeListSerializer)
    def get(self, request):
        exchanges = ExchangeController.get_exchanges()
        return Response(exchanges, status=status.HTTP_200_OK)
    
    # POST /exchange/
    @extend_schema(request=ExchangeCreateSerializer, responses=ExchangeListSerializer)
    def post(self, request):
        exchange, created = ExchangeController.create_exchange(request.data)
        if created:
            return Response(exchange, status=status.HTTP_201_CREATED)
        else:
            return Response(exchange, status=status.HTTP_400_BAD_REQUEST)

class ExchangeCRUDDetailView(APIView):
    
    # GET /exchange/{id}/
    @extend_schema(responses=ExchangeListSerializer)
    def get(self, request, id=None):
        exchange = ExchangeController.get_one_exchange(id)
        return Response(exchange)

    # PUT /exchange/{id}/
    @extend_schema(request=ExchangeEditSerializer, responses=ExchangeListSerializer)
    def put(self, request, id):
        exchange, updated = ExchangeController.edit_exchange(request.data,id)
        if updated:
            return Response(exchange, status=status.HTTP_200_OK)
        else:
            return Response(exchange, status=status.HTTP_400_BAD_REQUEST)
    
    # DELETE /exchange/{id}/
    @extend_schema()
    def delete(self, request, id):
        deleted, message = ExchangeController.delete_exchange(id)
        if deleted:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return self.response({"error": message}, status=status.HTTP_404_NOT_FOUND)

class ExchangeUserView(APIView):

    # GET /exchange/user/{id}
    @extend_schema(responses=ExchangeListSerializer)
    def get(self, request, userId):
        exchanges = ExchangeController.get_exchange_from_user(userId)
        return Response(exchanges, status=status.HTTP_200_OK)

