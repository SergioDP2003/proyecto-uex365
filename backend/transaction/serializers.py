from rest_framework import serializers
from .models import TransactionType, Transaction

#------------------------- Serializer TRANSACTION_TYPE ------------------------

class TransactionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionType
        fields = '__all__'

#-------------------------- Serializer TRANSACTION ----------------------------

class TransactionListSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    transaction_type_name = serializers.CharField(source='transaction_type.name', read_only=True)
    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'description', 'date', 'user', 'user_username', 'transaction_type', 'transaction_type_name']

class TransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['amount', 'description', 'user']

class TransactionEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['description']
    