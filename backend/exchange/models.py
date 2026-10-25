from django.db import models
from user.models import User
from transaction.models import Transaction

# Create your models here.

class ExchangeStatus(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class ExchangeProduct(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.FloatField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Exchange(models.Model):
    date = models.DateTimeField(auto_now_add=True)

    exchange_product = models.ForeignKey(ExchangeProduct, on_delete=models.CASCADE)
    exchange_status = models.ForeignKey(ExchangeStatus, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    transaction = models.ForeignKey(Transaction, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"Exchange {self.id}"