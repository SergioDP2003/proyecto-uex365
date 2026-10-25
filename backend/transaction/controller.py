import uuid
from datetime import datetime
from transaction.models import Transaction
from .serializers import *

def get_transaction_queryset_for_request(request):
	"""Return transactions visible for the authenticated user."""
	user = request.user
	if not user.is_authenticated:
		return Transaction.objects.none()
	if user.is_superuser or user.is_staff:
		return Transaction.objects.all()
	return Transaction.objects.filter(user=user)


def save_transaction_for_request_user(serializer, request):
	"""Ensure normal users can only create transactions for themselves."""
	user = request.user
	if user.is_authenticated and not (user.is_superuser or user.is_staff):
		serializer.save(user=user)
		return
	serializer.save()

#----------------------------- Controller TRANSACTION ------------------------------

class TransactionController:

    @staticmethod
    def get_transactions():
        transactions = Transaction.objects.all()
        serializer_list = TransactionListSerializer(transactions, many=True).data
        return serializer_list
    
    @staticmethod
    def get_one_transaction(id):
        try:
            transaction = Transaction.objects.get(id=id)
            serializer_list = TransactionListSerializer(transaction).data
            return serializer_list
        except Transaction.DoesNotExist:
            return {"error": "Transacción no encontrada"}
    
    @staticmethod
    def create_transaction(data, user):
        actual_date = datetime.now()
        serializer = TransactionCreateSerializer(data=data)
        if serializer.is_valid(): 
            transaction = serializer.save(date=actual_date, transaction_type_id=4)
            serializer_list = TransactionListSerializer(transaction).data
            target_user = serializer.validated_data['user']
            target_user.balance = target_user.balance + data["amount"]
            target_user.save()
            target_user.refresh_from_db()
            return serializer_list, True
        else:
            return serializer.errors, False
        
    @staticmethod
    def edit_transaction(data, id):
        try:
            transaction_old = Transaction.objects.get(id=id)
            serializer = TransactionEditSerializer(transaction_old, data=data, partial=True)
            if serializer.is_valid():
                transaction = serializer.save()
                serializer_list = TransactionListSerializer(transaction).data
                return serializer_list, True
            else:
                return serializer.errors, False
        except Transaction.DoesNotExist:
            return {"error": "Transacción no encontrada"}, False
    
    @staticmethod
    def delete_transaction(id):
        try:
            transaction = Transaction.objects.get(id=id)
            transaction.delete()
            return True, "Eliminado con éxito"
        except Transaction.DoesNotExist:
            return False, "La transacción no existe"
        except Exception as e:
            return False, str(e)

#----------------------------- Controller TRANSACTION_TYPE --------------------------

class TransactionTypeController:

    @staticmethod
    def get_transaction_types():
        transaction_types = TransactionType.objects.all()
        serializer_list = TransactionTypeSerializer(transaction_types, many=True).data
        return serializer_list
    
    @staticmethod
    def get_one_transaction_type(id):
        try:
            transaction_type = TransactionType.objects.get(id=id)
            serializer_list = TransactionTypeSerializer(transaction_type).data
            return serializer_list
        except TransactionType.DoesNotExist:
            return {"error": "Tipo de transacción no encontrada"}
    
    @staticmethod
    def create_transaction_type(data, user):
        serializer = TransactionTypeSerializer(data=data)
        if serializer.is_valid(): 
            transaction_type = serializer.save()
            serializer_list = TransactionTypeSerializer(transaction_type).data
            return serializer_list, True
        else:
            return serializer.errors, False
        
    @staticmethod
    def edit_transaction_type(data, id):
        try:
            transaction_type_old = TransactionType.objects.get(id=id)
            serializer = TransactionTypeSerializer(transaction_type_old, data=data, partial=True)
            if serializer.is_valid():
                transaction_type = serializer.save()
                serializer_list = TransactionTypeSerializer(transaction_type).data
                return serializer_list, True
            else:
                return serializer.errors, False
        except TransactionType.DoesNotExist:
            return {"error": "Tipo de transacción no encontrada"}, False
    
    @staticmethod
    def delete_transaction_type(id):
        try:
            transaction_type = TransactionType.objects.get(id=id)
            transaction_type.delete()
            return True, "Eliminado con éxito"
        except TransactionType.DoesNotExist:
            return False, "El tipo de transacción no existe"
        except Exception as e:
            return False, str(e)

