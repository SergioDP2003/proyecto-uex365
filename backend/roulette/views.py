from django.shortcuts import render
import random
from datetime import timedelta
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class RouletteSpinView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        # 🔒 limitar a 1 tirada cada X tiempo (ej: 24h)
        last_spin = user.roulettespin_set.order_by("-created_at").first()

        if last_spin:
            if timezone.now() - last_spin.created_at < timedelta(hours=24):
                return Response(
                    {"error": "Ya has girado hoy"},
                    status=400
                )

        # 🎯 premio
        reward = random.randint(1, 10)

        # 💰 sumar balance
        user.balance += reward
        user.save()

        # 📝 guardar tirada
        user.roulettespin_set.create(reward=reward)

        return Response({
            "reward": reward
        })