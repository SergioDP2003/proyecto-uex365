from rest_framework import serializers
from bet.serializers import *

class OptionsInCartSerializer(serializers.Serializer):
    event_id = serializers.IntegerField()
    event_name = serializers.CharField()
    option_id = serializers.IntegerField()
    option_name = serializers.CharField()
    cuote = serializers.FloatField()

class AddToCartSerializer(serializers.Serializer):
    option_id = serializers.IntegerField()

class AddOptionToBetSerializer(serializers.Serializer):
    bet_cart_id = serializers.CharField()
    option_id = serializers.IntegerField()

class CartItemSerializer(serializers.Serializer):
    bet_cart_id = serializers.CharField()
    bet_type = BetTypeSerializer()
    final_cuote = serializers.FloatField()
    options = OptionsInCartSerializer(many=True)

class RemoveOptionSerializer(serializers.Serializer):
    bet_cart_id = serializers.CharField()
    option_id = serializers.IntegerField()

class BetCheckoutSerializer(serializers.Serializer):
    bet_cart_id = serializers.CharField()
    bet_amount = serializers.FloatField(min_value=1)

class CheckoutSerializer(serializers.Serializer):
    bets = BetCheckoutSerializer(many=True)

