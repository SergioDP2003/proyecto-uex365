from django.db import models
from django.contrib.auth.models import AbstractUser, Group
from django.conf import settings

# Create your models here.

class UserState(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class User(AbstractUser):
    # Hereda username, email, password, first_name, last_name y date_joined.
    
    balance = models.FloatField(default=300)
    avatar_url = models.CharField(max_length=255, null=True, blank=True)
    user_state = models.ForeignKey(UserState, on_delete=models.SET_NULL, null=True, default=1)

    def __str__(self):
        return self.username