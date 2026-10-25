from django.contrib import admin
from .models import BetState, BetType, Bet, SemiBet

# Register your models here.
admin.site.register(BetState)
admin.site.register(BetType)
admin.site.register(Bet)
admin.site.register(SemiBet)