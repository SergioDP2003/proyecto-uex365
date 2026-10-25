from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated

from .controller import CartController

# ------------------------- ENDPOINT GET CARRITO ----------------------------------

class CartView(APIView):

    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]  # 🔥 importante

    @extend_schema(responses=CartItemSerializer(many=True))
    def get(self, request):
        CartController.clean_expired_cart_items(request.session)
        cart = CartController.get_cart_enriched(request.session)
        return Response(cart)

# ------------------------- ENDPOINT APUESTA SIMPLE -------------------------------

class AddToCartView(APIView):

    permission_classes = [IsAuthenticated]  # 🔥 importante

    @extend_schema(request=AddToCartSerializer)
    def post(self, request):
        CartController.clean_expired_cart_items(request.session)
        option_id = request.data.get("option_id")

        if not option_id:
            return Response({"error": "option_id requerido"}, status=400)

        cart = CartController.add_item(request.session, option_id)

        return Response(cart, status=201)

# ----------------------------- ENDPOINT LIMPIAR CARRITO ----------------------------

class ClearCartView(APIView):

    permission_classes = [IsAuthenticated]  # 🔥 importante

    @extend_schema(responses=dict)
    def delete(self, request):
        CartController.clean_expired_cart_items(request.session)
        CartController.clear(request.session)
        return Response({"message": "Carrito vaciado"})
    
# ---------------------------- ENDPOINT APUESTA COMBINADA ---------------------------
    
class AddOptionToBetView(APIView):

    permission_classes = [IsAuthenticated]  # 🔥 importante

    @extend_schema(request=AddOptionToBetSerializer)
    def post(self, request):
        CartController.clean_expired_cart_items(request.session)
        serializer = AddOptionToBetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        try:
            cart = CartController.add_option_to_bet(
                session=request.session,
                bet_cart_id=data["bet_cart_id"],
                option_id=data["option_id"],
            )
        except ValueError as e:
            return Response({"error": str(e)}, status=400)

        return Response(cart)
    
# ----------------------------- ENDPOINT ELIMINAR OPCION --------------------------------
    
class RemoveOptionFromBetView(APIView):

    permission_classes = [IsAuthenticated]  # 🔥 importante

    def delete(self, request, bet_cart_id, option_id):
        CartController.clean_expired_cart_items(request.session)
        try:
            cart = CartController.remove_option_from_bet(
                session=request.session,
                bet_cart_id=bet_cart_id,
                option_id=option_id
            )
        except ValueError as e:
            return Response({"error": str(e)}, status=400)

        return Response(cart)
    
# ------------------------------ ENDPOINT VALIDAR APUESTAS ----------------------------------

class CheckoutView(APIView):

    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=CheckoutSerializer,
        responses={"200": {"type": "object"}}
    )
    def post(self, request):
        CartController.clean_expired_cart_items(request.session)
        serializer = CheckoutSerializer(data=request.data)
        if not serializer.is_valid():
            print("❌ SERIALIZER ERRORS:", serializer.errors)
            return Response(serializer.errors, status=400)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        bets = data["bets"]

        # 🔥 1. calcular total apostado
        total_bet = sum(b["bet_amount"] for b in bets)

        # 🔥 2. validar balance usuario
        if total_bet > request.user.balance:
            return Response(
                {
                    "error": "Balance insuficiente",
                    "required": total_bet,
                    "balance": request.user.balance
                },
                status=400
            )

        # 🔥 3. ejecutar checkout en controller
        bet_ids = CartController.checkout(
            request.session,
            bets,
            request.user
        )

        return Response({
            "message": "Apuestas realizadas correctamente",
            "bets_created": bet_ids,
            "total_bet": total_bet
        })