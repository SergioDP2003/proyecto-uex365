from django.db.models import Avg, Count, Q, Sum
from django.db.models.functions import Coalesce

from bet.models import Bet
from transaction.models import Transaction

from .models import User


def get_regular_users_queryset():
	"""Return users that can participate in the public ranking."""
	return User.objects.filter(is_staff=False, is_superuser=False).exclude(groups__id=1).distinct()


def get_resolved_bets(queryset):
	"""Only bets already resolved should affect win rate and profit."""
	return queryset.filter(is_winner__isnull=False)


def calculate_net_profit(queryset):
	"""Net profit in points: prizes won minus the points staked in resolved bets."""
	resolved = get_resolved_bets(queryset)
	won_prizes = resolved.filter(is_winner=True).aggregate(total=Coalesce(Sum("profit"), 0.0))["total"] or 0.0
	resolved_wagered = resolved.aggregate(total=Coalesce(Sum("bet_amount"), 0.0))["total"] or 0.0
	return won_prizes - resolved_wagered


def get_user_queryset_for_request(request):
	"""Return users visible for the authenticated user."""
	user = request.user
	if not user.is_authenticated:
		return User.objects.none()
	if user.is_superuser or user.is_staff:
		return User.objects.all()
	return User.objects.filter(pk=user.pk)


def get_user_stats_for_request(request):
	"""Build aggregated betting and transaction statistics for the current user."""
	user = request.user
	bets = Bet.objects.filter(user=user)
	transactions = Transaction.objects.filter(user=user)

	total_bets = bets.count()
	resolved_bets = get_resolved_bets(bets)
	resolved_total = resolved_bets.count()
	wins = resolved_bets.filter(is_winner=True).count()
	losses = resolved_bets.filter(is_winner=False).count()
	pending = bets.filter(is_winner__isnull=True).count()

	total_wagered = bets.aggregate(total=Coalesce(Sum("bet_amount"), 0.0))["total"]
	total_profit = calculate_net_profit(bets)
	average_bet = bets.aggregate(total=Coalesce(Avg("bet_amount"), 0.0))["total"]

	total_transactions = transactions.count()
	total_transactions_amount = transactions.aggregate(total=Coalesce(Sum("amount"), 0.0))["total"]

	transactions_by_type = list(
		transactions.values("transaction_type__id", "transaction_type__name")
		.annotate(total=Count("id"), amount=Coalesce(Sum("amount"), 0.0))
		.order_by("transaction_type__name")
	)

	bet_distribution = {
		"wins": wins,
		"losses": losses,
		"pending": pending,
	}

	win_rate = (wins / resolved_total * 100) if resolved_total else 0.0
	loss_rate = (losses / resolved_total * 100) if resolved_total else 0.0
	pending_rate = (pending / total_bets * 100) if total_bets else 0.0

	return {
		"user_id": user.id,
		"username": user.username,
		"balance": user.balance,
		"bets": {
			"total": total_bets,
			"wins": wins,
			"losses": losses,
			"pending": pending,
			"win_rate": round(win_rate, 2),
			"loss_rate": round(loss_rate, 2),
			"pending_rate": round(pending_rate, 2),
			"total_wagered": total_wagered,
			"total_profit": total_profit,
			"net_benefit": total_profit,
			"average_bet": average_bet,
			"distribution": bet_distribution,
		},
		"transactions": {
			"total": total_transactions,
			"total_amount": total_transactions_amount,
			"by_type": transactions_by_type,
		},
	}


def get_global_ranking_for_request(request, limit=10):
	"""Build a global ranking of non-admin users ordered by real resolved net profit."""
	visible_users = get_regular_users_queryset()
	try:
		limit = int(limit)
	except (TypeError, ValueError):
		limit = 10
	limit = max(1, min(limit, 100))

	ranking = []
	for user in visible_users:
		bets = Bet.objects.filter(user=user)
		resolved_bets = get_resolved_bets(bets)
		total_bets = bets.count()
		resolved_total = resolved_bets.count()
		wins = resolved_bets.filter(is_winner=True).count()
		losses = resolved_bets.filter(is_winner=False).count()
		pending = bets.filter(is_winner__isnull=True).count()
		total_profit = calculate_net_profit(bets)
		win_rate = (wins / resolved_total * 100) if resolved_total else 0.0
		total_wagered = bets.aggregate(total=Coalesce(Sum("bet_amount"), 0.0))["total"] or 0.0
		average_bet = bets.aggregate(total=Coalesce(Avg("bet_amount"), 0.0))["total"] or 0.0

		ranking.append({
			"position": 0,
			"user_id": user.id,
			"username": user.username,
			"first_name": user.first_name,
			"last_name": user.last_name,
			"avatar_url": user.avatar_url,
			"balance": user.balance,
			"bets": {
				"total": total_bets,
				"resolved": resolved_total,
				"wins": wins,
				"losses": losses,
				"pending": pending,
				"win_rate": round(win_rate, 2),
				"total_wagered": total_wagered,
				"total_profit": total_profit,
				"average_bet": average_bet,
			},
		})

	ranking.sort(key=lambda row: (-row["bets"]["total_profit"], -float(row["balance"] or 0), row["username"].lower()))
	ranking = ranking[:limit]
	for position, row in enumerate(ranking, start=1):
		row["position"] = position

	all_bets = Bet.objects.filter(user__in=visible_users)
	resolved_all_bets = get_resolved_bets(all_bets)
	total_users = visible_users.count()
	total_profit = calculate_net_profit(all_bets)
	average_profit = (total_profit / total_users) if total_users else 0.0

	return {
		"summary": {
			"total_users": total_users,
			"total_balance": visible_users.aggregate(total=Coalesce(Sum("balance"), 0.0))["total"],
			"average_balance": visible_users.aggregate(total=Coalesce(Avg("balance"), 0.0))["total"],
			"total_bets": all_bets.count(),
			"total_wins": resolved_all_bets.filter(is_winner=True).count(),
			"total_losses": resolved_all_bets.filter(is_winner=False).count(),
			"total_pending": all_bets.filter(is_winner__isnull=True).count(),
			"total_wagered": all_bets.aggregate(total=Coalesce(Sum("bet_amount"), 0.0))["total"],
			"total_profit": total_profit,
			"average_profit": average_profit,
		},
		"ranking": ranking,
	}
