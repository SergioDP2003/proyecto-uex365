from rest_framework import serializers
from bet.models import BetState, BetType, Bet, SemiBet
from transaction.serializers import *
from user.serializers import *

class BetStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BetState
        fields = '__all__'

class BetTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BetType
        fields = '__all__'

class BetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bet
        fields = '__all__'

class SemiBetSerializer(serializers.ModelSerializer):
    class Meta:
        model = SemiBet
        fields = '__all__'

class BetUserSerializer(serializers.ModelSerializer):
    transaction = TransactionListSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    bet_state = BetStateSerializer(read_only=True)
    bet_type = BetTypeSerializer(read_only=True)
    class Meta:
        model = Bet
        fields = ['id', 'bet_amount', 'final_cuote', 'profit', 'creation_date', 'resolution_date',
                  'is_winner', 'transaction', 'user', 'bet_state', 'bet_type']