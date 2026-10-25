from django.contrib import admin
from .models import TransactionType, Transaction

# Register your models here.

admin.site.register(Transaction)
admin.site.register(TransactionType)