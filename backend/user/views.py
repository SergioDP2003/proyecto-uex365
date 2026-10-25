"""User views - merged from branches to resolve conflicts.

Includes: registration, login via Google, logout, profile (me),
stats and ranking endpoints, and standard ModelViewSets.
"""

import os
from django.shortcuts import render
from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import Group

from .models import UserState, User
from .serializers import *
from .controller import (
    get_global_ranking_for_request,
    get_user_queryset_for_request,
    get_user_stats_for_request,
)

from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

GOOGLE_CLIENT_ID = GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")


class UserStateViewSet(viewsets.ModelViewSet):
    queryset = UserState.objects.all()
    serializer_class = UserStateSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    
    def get_serializer_class(self):
        # self.action contiene la acción que se está ejecutando
        # 'update' corresponde al método PUT
        # 'partial_update' corresponde al método PATCH
        if self.action in ['update', 'partial_update']:
            return UserModifierSerializer  # El serializer limitado para edición
        if self.action == 'create':
            return UserCreateSerializer
            
        return UserSerializer  # El serializer completo para el resto (LIST, RETRIEVE, etc.)
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser or user.groups.filter(id=1).exists():
            return User.objects.all()
        return get_user_queryset_for_request(self.request)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.session.flush()
        return Response({"message": "Logout realizado correctamente"})


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")

        if not token:
            return Response({"error": "No se proporcionó ningún token"}, status=400)

        try:
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
            email = idinfo["email"]
            username = idinfo.get("name", email.split("@")[0])

            user, created = User.objects.get_or_create(email=email, defaults={"username": username})

            if created:
                user.set_unusable_password()
                user.save()

            refresh = RefreshToken.for_user(user)

            return Response({"access": str(refresh.access_token), "refresh": str(refresh), "success": True})

        except ValueError:
            return Response({"error": "Token de Google inválido o caducado"}, status=401)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        data = serializer.data
        user = request.user
        data["is_admin"] = user.is_staff or user.is_superuser or user.groups.filter(id=1).exists()
        return Response(data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class MeStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(get_user_stats_for_request(request))


class RankingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        limit = request.query_params.get("limit", 10)
        return Response(get_global_ranking_for_request(request, limit=limit))
