from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    BetStateViewSet,
    BetTypeViewSet,
    BetViewSet,
    SemiBetViewSet
)


# Creating a new router object.
routerBet = DefaultRouter()
# Registering the viewset to the router.
routerBet.register(prefix="bet_state", basename="bet_state", viewset=BetStateViewSet)

routerBet.register(prefix="bet_type", basename="bet_type", viewset=BetTypeViewSet)

routerBet.register(prefix="bet", basename="bet", viewset=BetViewSet)

routerBet.register(prefix="semibet", basename="semibet", viewset=SemiBetViewSet)