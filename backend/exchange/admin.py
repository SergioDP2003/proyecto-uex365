from django.contrib import admin
from .models import ExchangeStatus, ExchangeProduct, Exchange

# Register your models here.
admin.site.register(Exchange)
admin.site.register(ExchangeProduct)
admin.site.register(ExchangeStatus)