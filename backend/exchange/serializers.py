from rest_framework import serializers
from .models import ExchangeStatus, ExchangeProduct, Exchange
from transaction.serializers import *
from user.serializers import *

class ExchangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exchange
        fields = '__all__'


# -------------- Serializers EXCHANGE_PRODUCT -----------------------

class ExchangeProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeProduct
        fields = ['id', 'name', 'description', 'price', 'is_active']

class ExchangeProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeProduct
        fields = ['name', 'description', 'price', 'is_active']

class ExchangeProductEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeProduct
        fields = ['name', 'description', 'price', 'is_active']

# -------------- Serializers EXCHANGE_STATUS -----------------------

class ExchangeStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeStatus
        fields = '__all__'

# -------------- Serializers EXCHANGE ------------------------------

class ExchangeListSerializer(serializers.ModelSerializer):
    transaction = TransactionListSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    exchange_product = ExchangeProductListSerializer(read_only=True)
    exchange_status = ExchangeStatusSerializer(read_only=True)
    class Meta:
        model = Exchange
        fields = ['id', 'date', 'transaction', 'user', 'exchange_product', 'exchange_status']

class ExchangeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exchange
        fields = ['user', 'exchange_product']

class ExchangeEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exchange
        fields = ['date', 'transaction', 'user', 'exchange_product', 'exchange_status']
