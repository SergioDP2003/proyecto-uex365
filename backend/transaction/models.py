from django.db import models
from user.models import User

# Create your models here.

class TransactionType(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Transaction(models.Model):
    amount = models.FloatField()
    description = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    transaction_type = models.ForeignKey(TransactionType, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.amount} - {self.user}"