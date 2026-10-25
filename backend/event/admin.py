from django.contrib import admin
from .models import EventCategory, EventState, Event, Option

# Register your models here.
admin.site.register(Event)
admin.site.register(EventCategory)
admin.site.register(EventState)
admin.site.register(Option)
