from django.db import models
from user.models import User
from transaction.models import Transaction
from event.models import Option

# Create your models here.

class BetState(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class BetType(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    

class Bet(models.Model):
    bet_amount = models.FloatField()
    final_cuote = models.FloatField()
    profit = models.FloatField()

    creation_date = models.DateTimeField(auto_now_add=True)
    resolution_date = models.DateTimeField(null=True, blank=True)

    is_winner = models.BooleanField(null=True)

    bet_state = models.ForeignKey(BetState, on_delete=models.SET_NULL, null=True)
    bet_type = models.ForeignKey(BetType, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    transaction = models.ForeignKey(Transaction, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"Bet {self.id}"


class SemiBet(models.Model):
    bet = models.ForeignKey(Bet, on_delete=models.CASCADE)
    option = models.ForeignKey(Option, on_delete=models.CASCADE, related_name='semibets')

    def __str__(self):
        return f"Bet {self.bet.id} - Option {self.option.id}"