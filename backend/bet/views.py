from django.shortcuts import render
from rest_framework import viewsets
from bet.models import BetState, BetType, Bet, SemiBet
from rest_framework import viewsets, mixins, status            
from rest_framework.decorators import action                  
from rest_framework.response import Response
from rest_framework import viewsets, mixins
from bet.serializers import *
from .controller import (
    get_bet_queryset_for_request,
    get_semibet_queryset_for_request,
    save_bet_for_request_user,
    get_bets_by_user_id,
)

# Create your views here.

class BetStateViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = BetState.objects.all()
    serializer_class = BetStateSerializer



class BetTypeViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = BetType.objects.all()
    serializer_class = BetTypeSerializer



class BetViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = BetSerializer

    def get_queryset(self):
        return get_bet_queryset_for_request(self.request)

    def perform_create(self, serializer):
        save_bet_for_request_user(serializer, self.request)

    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[^/.]+)')
    def user_bets(self, request, user_id=None):
        """Obtiene las apuestas de un usuario y las formatea con BetUserSerializer."""
        queryset = get_bets_by_user_id(user_id, request)
        
        serializer = BetUserSerializer(queryset, many=True, context={'request': request})
        
        print(serializer.data) 

        return Response(serializer.data, status=status.HTTP_200_OK)



class SemiBetViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = SemiBetSerializer

    def get_queryset(self):
        return get_semibet_queryset_for_request(self.request)