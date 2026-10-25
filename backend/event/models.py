from django.db import models

# Create your models here.

class EventCategory(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class EventState(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Event(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()

    creation_date = models.DateTimeField(auto_now_add=True)
    closing_date = models.DateTimeField()
    resolution_date = models.DateTimeField(null=True, blank=True)

    event_state = models.ForeignKey(EventState, on_delete=models.SET_DEFAULT, default=1)
    event_category = models.ForeignKey(EventCategory, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name
    

class Option(models.Model):
    name = models.CharField(max_length=255)
    cuote = models.FloatField()
    is_winner = models.BooleanField(default=False)

    event = models.ForeignKey(Event, on_delete=models.CASCADE)

    def __str__(self):
        return self.name