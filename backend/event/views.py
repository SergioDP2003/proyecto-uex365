from django.shortcuts import render
from rest_framework import viewsets, mixins
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from rest_framework import status
from .controller import *
from .models import *
from .serializers import *
from rest_framework.permissions import BasePermission, IsAuthenticated

class IsAdminUserOrAdminGroup(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Permitir si es staff, superuser, o tiene grupo administrador
        return (request.user.is_staff or 
                request.user.is_superuser or 
                request.user.groups.filter(id=1).exists())
    
# -------------------- Views EVENT ------------------------

class EventCRUDGeneralView(APIView):

    # GET /event/
    @extend_schema(responses=EventListSerializer)
    def get(self, request):
        events = EventController.get_events()
        return Response(events, status=status.HTTP_200_OK)
    
    # POST /event/
    @extend_schema(request=EventCreateSerializer, responses=EventListSerializer)
    def post(self, request):
        event, created = EventController.create_event(request.data)
        if created:
            return Response(event, status=status.HTTP_201_CREATED)
        else:
            return Response(event, status=status.HTTP_400_BAD_REQUEST)

class EventCRUDDetailView(APIView):
    
    # GET /event/{id}/
    @extend_schema(responses=EventListSerializer)
    def get(self, request, id=None):
        event = EventController.get_one_event(id)
        return Response(event)

    # PUT /event/{id}/
    @extend_schema(request=EventEditSerializer, responses=EventListSerializer)
    def put(self, request, id):
        event, updated = EventController.edit_event(request.data,id)
        if updated:
            return Response(event, status=status.HTTP_200_OK)
        else:
            return Response(event, status=status.HTTP_400_BAD_REQUEST)
    
    # DELETE /event/{id}/
    @extend_schema()
    def delete(self, request, id):
        deleted, message = EventController.delete_event(id)
        if deleted:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return self.response({"error": message}, status=status.HTTP_404_NOT_FOUND)
        
class EventAvailableView(APIView):
    queryset = Event.objects.all()

    # GET /event/available/
    @extend_schema(responses=EventListSerializer)
    def get(self, request):
        events = EventController.get_available_events(id)
        return Response(events, status=status.HTTP_200_OK)
    
class EventDetailView(APIView):
    queryset = Event.objects.all()

    # GET /event/{id}/detail
    @extend_schema(responses=EventDetailSerializer)
    def get(self, request, id):
        event = EventController.get_event_detail(id)
        return Response(event, status=status.HTTP_200_OK)
    
class EventOpenView(APIView):
    queryset = Event.objects.all()

    # POST /events/{id}/open
    @extend_schema(responses=EventListSerializer)
    def post(self, request, id):
        event = EventController.open_event(id)
        if isinstance(event, dict) and "error" in event:
            return Response(event, status=status.HTTP_400_BAD_REQUEST)
        return Response(event, status=status.HTTP_200_OK)

class EventForceCloseView(APIView):
    queryset = Event.objects.all()

    # POST /events/{id}/force_close
    @extend_schema(responses=EventListSerializer)
    def post(self, request, id):
        event = EventController.force_close_event(id)
        if isinstance(event, dict) and "error" in event:
            return Response(event, status=status.HTTP_400_BAD_REQUEST)
        return Response(event, status=status.HTTP_200_OK)
    
class EventResolveView(APIView):

    # POST /events/{id}/resolve
    def post(self, request, id):
        winning_option_ids = request.data
        
        if not winning_option_ids:
            return Response({"error": "Debes seleccionar al menos una opción ganadora"}, 
                            status=status.HTTP_400_BAD_REQUEST)
            
        result = EventController.resolve_event(id, winning_option_ids)
        
        if "error" in result:
            print(result["error"])
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        return Response(result, status=status.HTTP_200_OK)
    
class EventCancelView(APIView):

    # POST /events/{id}/cancel
    def post(self, request, id):
            
        result = EventController.cancel_event(id)
        
        if "error" in result:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        return Response(result, status=status.HTTP_200_OK)
    
# -------------------- Views EVENT_CATEGORY ------------------------

class EventCategoryCRUDGeneralView(APIView):

    # GET /event_category/
    @extend_schema(responses=EventCategorySerializer)
    def get(self, request):
        event_categories = EventCategoryController.get_event_categories()
        return Response(event_categories, status=status.HTTP_200_OK)
    
    # POST /event_category/
    @extend_schema(request=EventCategorySerializer, responses=EventCategorySerializer)
    def post(self, request):
        event_category, created = EventCategoryController.create_event_category(request.data)
        if created:
            return Response(event_category, status=status.HTTP_201_CREATED)
        else:
            return Response(event_category, status=status.HTTP_400_BAD_REQUEST)

class EventCategoryCRUDDetailView(APIView):
    
    # GET /event_category/{id}/
    @extend_schema(responses=EventCategorySerializer)
    def get(self, request, id=None):
        event_category = EventCategoryController.get_one_event_category(id)
        return Response(event_category)

    # PUT /event_category/{id}/
    @extend_schema(request=EventCategorySerializer, responses=EventCategorySerializer)
    def put(self, request, id):
        event_category, updated = EventCategoryController.edit_event_category(request.data, id)
        if updated:
            return Response(event_category, status=status.HTTP_200_OK)
        else:
            return Response(event_category, status=status.HTTP_400_BAD_REQUEST)
    
    # DELETE /event_category/{id}/
    @extend_schema()
    def delete(self, request, id):
        deleted, message = EventCategoryController.delete_event_category(id)
        if deleted:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return self.response({"error": message}, status=status.HTTP_404_NOT_FOUND)
        
# -------------------- Views EVENT_STATE ------------------------

class EventStateCRUDGeneralView(APIView):

    # GET /event_state/
    @extend_schema(responses=EventStateSerializer)
    def get(self, request):
        event_states = EventStateController.get_event_states()
        return Response(event_states, status=status.HTTP_200_OK)
    
    # POST /event_state/
    @extend_schema(request=EventStateSerializer, responses=EventStateSerializer)
    def post(self, request):
        event_state, created = EventStateController.create_event_state(request.data)
        if created:
            return Response(event_state, status=status.HTTP_201_CREATED)
        else:
            return Response(event_state, status=status.HTTP_400_BAD_REQUEST)

class EventStateCRUDDetailView(APIView):
    
    # GET /event_state/{id}/
    @extend_schema(responses=EventStateSerializer)
    def get(self, request, id=None):
        event_state = EventStateController.get_one_event_state(id)
        return Response(event_state)

    # PUT /event_state/{id}/
    @extend_schema(request=EventStateSerializer, responses=EventStateSerializer)
    def put(self, request, id):
        event_state, updated = EventStateController.edit_event_state(request.data, id)
        if updated:
            return Response(event_state, status=status.HTTP_200_OK)
        else:
            return Response(event_state, status=status.HTTP_400_BAD_REQUEST)
    
    # DELETE /event_state/{id}/
    @extend_schema()
    def delete(self, request, id):
        deleted, message = EventStateController.delete_event_state(id)
        if deleted:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return self.response({"error": message}, status=status.HTTP_404_NOT_FOUND)
     
# -------------------- Views OPTION ------------------------

class OptionCRUDGeneralView(APIView):

    # GET /option/
    @extend_schema(responses=OptionListSerializer)
    def get(self, request):
        options = OptionController.get_options()
        return Response(options, status=status.HTTP_200_OK)
    
    # POST /option/
    @extend_schema(request=OptionCreateSerializer, responses=OptionListSerializer)
    def post(self, request):
        option, created = OptionController.create_option(request.data)
        if created:
            return Response(option, status=status.HTTP_201_CREATED)
        else:
            return Response(option, status=status.HTTP_400_BAD_REQUEST)

class OptionCRUDDetailView(APIView):
    
    # GET /option/{id}/
    @extend_schema(responses=OptionListSerializer)
    def get(self, request, id=None):
        option = OptionController.get_one_option(id)
        return Response(option)

    # PUT /option/{id}/
    @extend_schema(request=OptionEditSerializer, responses=OptionListSerializer)
    def put(self, request, id):
        option, updated = OptionController.edit_option(request.data, id)
        if updated:
            return Response(option, status=status.HTTP_200_OK)
        else:
            return Response(option, status=status.HTTP_400_BAD_REQUEST)
    
    # DELETE /option/{id}/
    @extend_schema()
    def delete(self, request, id):
        deleted, message = OptionController.delete_option(id)
        if deleted:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return self.response({"error": message}, status=status.HTTP_404_NOT_FOUND)
  