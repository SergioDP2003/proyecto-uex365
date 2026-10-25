import uuid
from datetime import datetime
from django.utils import timezone
from .models import Event
from bet.models import Bet
from user.models import User
from transaction.models import Transaction
from .serializers import *

# ------------------ Controller EVENT ------------------------

class EventController:

    @staticmethod
    def get_events():
        events = Event.objects.all()
        serializer_list = EventListSerializer(events, many=True).data
        return serializer_list
    
    @staticmethod
    def get_one_event(id):
        try:
            event = Event.objects.get(id=id)
            serializer_list = EventListSerializer(event).data
            return serializer_list
        except Event.DoesNotExist:
            return {"error": "Evento no encontrado"}
    
    @staticmethod
    def create_event(data):
        actual_date = datetime.now()
        serializer = EventCreateSerializer(data=data)
        if serializer.is_valid(): 
            event = serializer.save(creation_date=actual_date, event_state_id=1)
            serializer_list = EventListSerializer(event).data
            return serializer_list, True
        else:
            return serializer.errors, False
        
    @staticmethod
    def edit_event(data, id):
        try:
            event_old = Event.objects.get(id=id)
            serializer = EventEditSerializer(event_old, data=data, partial=True)
            if serializer.is_valid():
                event = serializer.save()
                serializer_list = EventListSerializer(event).data
                return serializer_list, True
            else:
                return serializer.errors, False
        except Event.DoesNotExist:
            return {"error": "Evento no encontrado"}, False
    
    @staticmethod
    def delete_event(id):
        try:
            event = Event.objects.get(id=id)
            event.delete()
            return True, "Eliminado con éxito"
        except Event.DoesNotExist:
            return False, "El evento no existe"
        except Exception as e:
            return False, str(e)

    @staticmethod
    def get_available_events(category=None, search=None):
        try:
            events = Event.objects.filter(event_state=2)
            serializer_list = EventListSerializer(events, many=True).data
            return serializer_list
        except Event.DoesNotExist:
            return {"error": "Eventos no encontrado"}
        
    @staticmethod
    def get_event_detail(id):
        try:
            event = Event.objects.get(id=id)
            serializer_list = EventDetailSerializer(event).data
            return serializer_list
        except Event.DoesNotExist:
            return {"error": "Evento no encontrado"}
        
    @staticmethod
    def open_event(id):
        try:
            event = Event.objects.get(id=id)
            options_count = event.option_set.count()

            if event.event_state_id != 1:
                return {
                    "error": f"No se puede abrir el evento. El estado actual no lo permite."
                }

            if options_count < 2:
                return {
                    "error": f"No se puede abrir el evento. Se requieren al menos 2 opciones y este evento solo tiene {options_count}."
                }

            event.event_state_id = 2  
            event.save()

            serializer_list = EventListSerializer(event).data
            return serializer_list

        except Event.DoesNotExist:
            return {"error": "El evento no existe"}
        except Exception as e:
            return {"error": f"Ocurrió un error inesperado: {str(e)}"}
        
    @staticmethod
    def force_close_event(id):
        try:
            event = Event.objects.get(id=id)
            if event.event_state_id != 2:
                return {
                    "error": f"No se puede cerrar el evento. El estado actual no lo permite."
                }
            event.event_state_id = 3 
            event.closing_date = datetime.now()
            event.save()
            serializer_list = EventListSerializer(event).data
            return serializer_list

        except Event.DoesNotExist:
            return {"error": "El evento no existe"}
        except Exception as e:
            return {"error": f"Ocurrió un error inesperado: {str(e)}"}
        
    @staticmethod
    def resolve_event(id, winner_options_id):
        try:

            event = Event.objects.get(id=id)

            if event.event_state_id != 3:
                return {
                    "error": f"No se puede resolver el evento. El estado actual no lo permite."
                }

            event.event_state_id = 4
            event.resolution_date = timezone.now()
            event.save()

            options = event.option_set.all()
            for opt in options:
                opt.is_winner = (opt.id in winner_options_id)
                opt.save()

            bets = Bet.objects.filter(semibet__option__event=event, bet_state_id=1).distinct()
            print(bets)
            for bet in bets:
                # 2. Accedemos a las semibets de esta apuesta específica (Bet 7)
                # Nota: Ajusta 'semibet_set' si definiste un related_name diferente
                apuestas_individuales = bet.semibet_set.all() 

                # 3. Verificamos si todos los eventos en esa apuesta están cerrados (Estado 4)
                # (Por si el usuario hizo una combinada con partidos de mañana)
                if all(sb.option.event.event_state_id == 4 for sb in apuestas_individuales):
                    
                    # 4. Calculamos si la apuesta es ganadora
                    # Será True solo si TODAS las opciones elegidas son ganadoras
                    es_ganadora = all(sb.option.is_winner for sb in apuestas_individuales)
                    
                    bet.is_winner = es_ganadora
                    bet.bet_state_id = 2  # Estado: "Calculada / Lista para pagar"
                    bet.resolution_date = timezone.now()
                    bet.save()
                    
                    print(f"Apuesta {bet.id} evaluada. ¿Ganadora?: {es_ganadora}")
            
            winning_bets = Bet.objects.filter(bet_state_id=2, is_winner=True)
            print(winning_bets)
            for w_bet in winning_bets:
                    print(w_bet.user_id)
                    user = User.objects.get(id=w_bet.user_id)
                    print(user.id)
                    prize = w_bet.bet_amount * w_bet.final_cuote
                    print(prize)

                    # Crear Transacción de ingreso
                    Transaction.objects.create(
                        user_id=w_bet.user_id,
                        amount=prize,
                        transaction_type_id=2, # O el tipo que manejes
                        description=f"Premio apuesta #{w_bet.id} - Evento: {event.name}"
                    )

                    # Actualizar Balance del Usuario (Sumar premio)
                    user.balance += prize
                    user.save()

                    # Finalizar apuesta (bet_state=3 -> Pagada/Cerrada)
                    w_bet.bet_state_id = 3
                    w_bet.save()

            return {"message": "Evento y apuestas resueltas con éxito"}

        except Event.DoesNotExist:
            return {"error": "Evento no encontrado"}
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def cancel_event(id):
        try:
            event = Event.objects.get(id=id)

            if (event.event_state_id == 1) or (event.event_state_id == 4):
                return {
                    "error": f"No se puede cancelar el evento. El estado actual no lo permite."
                }

            event.event_state_id = 5
            event.save()

            bets = Bet.objects.filter(semibet__option__event=event).exclude(bet_state_id__in=[2, 3]).distinct()
            for bet in bets:
                bet.bet_state_id=4
                bet.save()

                Transaction.objects.create(
                    user_id=bet.user_id,
                    amount=bet.bet_amount,
                    transaction_type_id=5, # O el tipo que manejes
                    description=f"Devolucion apuesta #{bet.id} - Evento Cancelado: {event.name}"
                )

                user = User.objects.get(id=bet.user_id)
                user.balance += bet.bet_amount
                user.save()

            return {"message": "Evento cancelado y apuestas devueltas con éxito"}
        except Event.DoesNotExist:
            return {"error": "Evento no encontrado"}
        except Exception as e:
            return {"error": str(e)}

# ------------------ Controller EVENT_CATEGORY ------------------------

class EventCategoryController:
    @staticmethod
    def get_event_categories():
        event_categories = EventCategory.objects.all()
        serializer_list = EventCategorySerializer(event_categories, many=True).data
        return serializer_list
    
    @staticmethod
    def get_one_event_category(id):
        try:
            event_category = EventCategory.objects.get(id=id)
            serializer_list = EventCategorySerializer(event_category).data
            return serializer_list
        except EventCategory.DoesNotExist:
            return {"error": "Categoria de evento no encontrada"}
    
    @staticmethod
    def create_event_category(data):
        serializer = EventCategorySerializer(data=data)
        if serializer.is_valid(): 
            event_category = serializer.save()
            serializer_list = EventCategorySerializer(event_category).data
            return serializer_list, True
        else:
            return serializer.errors, False
        
    @staticmethod
    def edit_event_category(data, id):
        try:
            event_category_old = EventCategory.objects.get(id=id)
            serializer = EventCategorySerializer(event_category_old, data=data, partial=True)
            if serializer.is_valid():
                event_category = serializer.save()
                serializer_list = EventCategorySerializer(event_category).data
                return serializer_list, True
            else:
                return serializer.errors, False
        except EventCategory.DoesNotExist:
            return {"error": "Categoria de evento no encontrada"}, False
    
    @staticmethod
    def delete_event_category(id):
        try:
            event_category = EventCategory.objects.get(id=id)
            event_category.delete()
            return True, "Eliminado con éxito"
        except EventCategory.DoesNotExist:
            return False, "La categoria de evento no existe"
        except Exception as e:
            return False, str(e)
        
# ------------------ Controller EVENT_STATE ------------------------

class EventStateController:
    @staticmethod
    def get_event_states():
        event_states = EventState.objects.all()
        serializer_list = EventStateSerializer(event_states, many=True).data
        return serializer_list
    
    @staticmethod
    def get_one_event_state(id):
        try:
            event_state = EventState.objects.get(id=id)
            serializer_list = EventStateSerializer(event_state).data
            return serializer_list
        except EventState.DoesNotExist:
            return {"error": "Estado de evento no encontrado"}
    
    @staticmethod
    def create_event_state(data):
        serializer = EventStateSerializer(data=data)
        if serializer.is_valid(): 
            event_state = serializer.save()
            serializer_list = EventStateSerializer(event_state).data
            return serializer_list, True
        else:
            return serializer.errors, False
        
    @staticmethod
    def edit_event_state(data, id):
        try:
            event_state_old = EventState.objects.get(id=id)
            serializer = EventStateSerializer(event_state_old, data=data, partial=True)
            if serializer.is_valid():
                event_state = serializer.save()
                serializer_list = EventStateSerializer(event_state).data
                return serializer_list, True
            else:
                return serializer.errors, False
        except EventState.DoesNotExist:
            return {"error": "Estado de evento no encontrado"}, False
    
    @staticmethod
    def delete_event_state(id):
        try:
            event_state = EventState.objects.get(id=id)
            event_state.delete()
            return True, "Eliminado con éxito"
        except EventState.DoesNotExist:
            return False, "El estado de evento no existe"
        except Exception as e:
            return False, str(e)
       

# ------------------ Controller OPTION ------------------------

class OptionController:
    @staticmethod
    def get_options():
        options = Option.objects.all()
        serializer_list = OptionListSerializer(options, many=True).data
        return serializer_list
    
    @staticmethod
    def get_one_option(id):
        try:
            option = Option.objects.get(id=id)
            serializer_list = OptionListSerializer(option).data
            return serializer_list
        except Option.DoesNotExist:
            return {"error": "Opción no encontrada"}
    
    @staticmethod
    def create_option(data):
        serializer = OptionCreateSerializer(data=data)
        if serializer.is_valid(): 
            option = serializer.save(is_winner=False)
            serializer_list = OptionListSerializer(option).data
            return serializer_list, True
        else:
            return serializer.errors, False
        
    @staticmethod
    def edit_option(data, id):
        try:
            option_old = Option.objects.get(id=id)
            serializer = OptionEditSerializer(option_old, data=data, partial=True)
            if serializer.is_valid():
                option = serializer.save()
                serializer_list = OptionListSerializer(option).data
                return serializer_list, True
            else:
                return serializer.errors, False
        except Option.DoesNotExist:
            return {"error": "Opción no encontrada"}, False
    
    @staticmethod
    def delete_option(id):
        try:
            option = Option.objects.get(id=id)
            option.delete()
            return True, "Eliminado con éxito"
        except Option.DoesNotExist:
            return False, "La opción no existe"
        except Exception as e:
            return False, str(e)