from .models import Bet, SemiBet
from rest_framework.exceptions import PermissionDenied


def get_bet_queryset_for_request(request):
	"""Return bets visible for the authenticated user."""
	user = request.user
	if not user.is_authenticated:
		return Bet.objects.none()
	if user.is_superuser or user.is_staff:
		return Bet.objects.all()
	return Bet.objects.filter(user=user)


def get_semibet_queryset_for_request(request):
	"""Return semibets visible for the authenticated user."""
	user = request.user
	if not user.is_authenticated:
		return SemiBet.objects.none()
	if user.is_superuser or user.is_staff:
		return SemiBet.objects.all()
	return SemiBet.objects.filter(bet__user=user)


def save_bet_for_request_user(serializer, request):
	"""Ensure normal users can only create bets for themselves."""
	user = request.user
	if user.is_authenticated and not (user.is_superuser or user.is_staff):
		serializer.save(user=user)
		return
	serializer.save()

def get_bets_by_user_id(user_id, request):
    """Return bets of a specific user, validating permissions."""
    user = request.user

    if not user.is_authenticated:
        return Bet.objects.none()
    
    return Bet.objects.filter(user_id=user.id)
