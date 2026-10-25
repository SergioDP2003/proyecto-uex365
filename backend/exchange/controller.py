import uuid
from datetime import datetime
from .models import *
from .serializers import *
from user.models import User
from transaction.models import Transaction
from django.utils import timezone

#--------------------------- Controller EXCHANGE_PRODUCT ----------------------------

class ExchangeProductController:

    @staticmethod
    def get_exchange_products():
        exchange_products = ExchangeProduct.objects.all()
        serializer_list = ExchangeProductListSerializer(exchange_products, many=True).data
        return serializer_list
    
    @staticmethod
    def get_one_exchange_product(id):
        try:
            exchange_product = ExchangeProduct.objects.get(id=id)
            serializer_list = ExchangeProductListSerializer(exchange_product).data
            return serializer_list
        except ExchangeProduct.DoesNotExist:
            return {"error": "Producto no encontrado"}
        
    @staticmethod
    def get_available_exchange_products():
        exchange_products = ExchangeProduct.objects.filter(is_active=1)
        serializer_list = ExchangeProductListSerializer(exchange_products, many=True).data
        return serializer_list
    
    @staticmethod
    def create_exchange_product(data):
        serializer = ExchangeProductCreateSerializer(data=data)
        if serializer.is_valid(): 
            exchange_product = serializer.save()
            serializer_list = ExchangeProductListSerializer(exchange_product).data
            return serializer_list, True
        else:
            return serializer.errors, False
        
    @staticmethod
    def edit_exchange_product(data, id):
        try:
            exchange_product_old = ExchangeProduct.objects.get(id=id)
            serializer = ExchangeProductEditSerializer(exchange_product_old, data=data, partial=True)
            if serializer.is_valid():
                exchange_product = serializer.save()
                serializer_list = ExchangeProductListSerializer(exchange_product).data
                return serializer_list, True
            else:
                return serializer.errors, False
        except ExchangeProduct.DoesNotExist:
            return {"error": "Producto no encontrado"}, False
    
    @staticmethod
    def delete_exchange_product(id):
        try:
            exchange_product = ExchangeProduct.objects.get(id=id)
            exchange_product.delete()
            return True, "Eliminado con éxito"
        except ExchangeProduct.DoesNotExist:
            return False, "El producto no existe"
        except Exception as e:
            return False, str(e)

#--------------------------- Controller EXCHANGE_STATUS ----------------------------

class ExchangeStatusController:

    @staticmethod
    def get_exchange_status():
        exchange_status = ExchangeStatus.objects.all()
        serializer_list = ExchangeStatusSerializer(exchange_status, many=True).data
        return serializer_list
    
    @staticmethod
    def get_one_exchange_status(id):
        try:
            exchange_status = ExchangeStatus.objects.get(id=id)
            serializer_list = ExchangeStatusSerializer(exchange_status).data
            return serializer_list
        except ExchangeStatus.DoesNotExist:
            return {"error": "Estado de intercambio no encontrado"}
    
    @staticmethod
    def create_exchange_status(data):
        serializer = ExchangeStatusSerializer(data=data)
        if serializer.is_valid(): 
            exchange_status = serializer.save()
            serializer_list = ExchangeStatusSerializer(exchange_status).data
            return serializer_list, True
        else:
            return serializer.errors, False
        
    @staticmethod
    def edit_exchange_status(data, id):
        try:
            exchange_status_old = ExchangeStatus.objects.get(id=id)
            serializer = ExchangeStatusSerializer(exchange_status_old, data=data, partial=True)
            if serializer.is_valid():
                exchange_status = serializer.save()
                serializer_list = ExchangeStatusSerializer(exchange_status).data
                return serializer_list, True
            else:
                return serializer.errors, False
        except ExchangeStatus.DoesNotExist:
            return {"error": "Estado de intercambio no encontrado"}, False
    
    @staticmethod
    def delete_exchange_status(id):
        try:
            exchange_status = ExchangeStatus.objects.get(id=id)
            exchange_status.delete()
            return True, "Eliminado con éxito"
        except ExchangeStatus.DoesNotExist:
            return False, "El estado de intercambio no existe"
        except Exception as e:
            return False, str(e)

#--------------------------- Controller EXCHANGE ----------------------------

class ExchangeController:

    @staticmethod
    def get_exchanges():
        exchanges = Exchange.objects.all()
        serializer_list = ExchangeListSerializer(exchanges, many=True).data
        return serializer_list
    
    @staticmethod
    def get_one_exchange(id):
        try:
            exchange = Exchange.objects.get(id=id)
            serializer_list = ExchangeListSerializer(exchange).data
            return serializer_list
        except Exchange.DoesNotExist:
            return {"error": "Canje no encontrado"}
        
    @staticmethod
    def get_exchange_from_user(userId):
        try:
            exchanges = Exchange.objects.filter(user_id=userId)
            serializer_list = ExchangeListSerializer(exchanges, many=True).data
            return serializer_list
        except Exchange.DoesNotExist:
            return {"error": "Canjes no encontrado"}
 
    @staticmethod
    def create_exchange(data):
        serializer = ExchangeCreateSerializer(data=data)

        if not serializer.is_valid():
            return serializer.errors, False
        
        user_id = data.get("user")
        exchange_product_id = data.get("exchange_product")

        try:
            user = User.objects.get(id=user_id)
            exchange_product = ExchangeProduct.objects.get(id=exchange_product_id)

            if not getattr(exchange_product, 'is_active', True):
                    return {"error": "El producto seleccionado no está activo."}, False
            
            if user.balance < exchange_product.price:
                    return {"error": "Balance insuficiente para adquirir este producto."}, False
            
            transaction = Transaction.objects.create(
                amount=exchange_product.price,
                description=f"Canje de producto: {exchange_product.name}",
                date=timezone.now(),
                user_id=user.id,
                transaction_type_id=3
            )

            exchange = serializer.save(date=timezone.now(), transaction_id=transaction.id, exchange_status_id=1)

            user.balance -= exchange_product.price
            user.save()

            serializer_list = ExchangeListSerializer(exchange).data
            return serializer_list, True
        
        except User.DoesNotExist:
            return {"error": "El usuario especificado no existe."}, False
        except ExchangeProduct.DoesNotExist:
            return {"error": "El producto especificado no existe."}, False
        except Exception as e:
            # Cualquier otro fallo imprevisto cancelará los cambios en el balance gracias a transaction.atomic
            return {"error": f"Error inesperado en el servidor: {str(e)}"}, False
        
    @staticmethod
    def edit_exchange(data, id):
        try:
            exchange_old = Exchange.objects.get(id=id)
            serializer = ExchangeEditSerializer(exchange_old, data=data, partial=True)
            if serializer.is_valid():
                exchange = serializer.save()
                serializer_list = ExchangeListSerializer(exchange).data
                return serializer_list, True
            else:
                return serializer.errors, False
        except Exchange.DoesNotExist:
            return {"error": "Canje no encontrado"}, False
    
    @staticmethod
    def delete_exchange(id):
        try:
            exchange = Exchange.objects.get(id=id)
            exchange.delete()
            return True, "Eliminado con éxito"
        except Exchange.DoesNotExist:
            return False, "El canje no existe"
        except Exception as e:
            return False, str(e)
