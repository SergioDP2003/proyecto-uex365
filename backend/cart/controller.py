import uuid
from datetime import datetime
from bet.models import Bet, SemiBet, BetType
from event.models import Option
from transaction.models import Transaction

class CartController:

    SESSION_KEY = "bet_carrito"

    @staticmethod
    def get_cart(session):
        return session.get(CartController.SESSION_KEY, [])

    @staticmethod
    def save_cart(session, cart):
        session[CartController.SESSION_KEY] = cart
        session.modified = True

    @staticmethod
    def get_cart_enriched(session):

        cart = CartController.get_cart(session)

        enriched = []

        for bet in cart:

            # 🔹 obtener bet_type
            bet_type = BetType.objects.get(id=bet["bet_type_id"])

            bet_type_data = {
                "id": bet_type.id,
                "name": bet_type.name
            }

            enriched_options = []

            for opt in bet["options"]:

                # 🔹 traer option + event en una query eficiente
                option = Option.objects.get(id=opt["option_id"])

                enriched_options.append({
                    "event_id": option.event.id,
                    "event_name": option.event.name,
                    "option_id": option.id,
                    "option_name": option.name,
                    "cuote": float(option.cuote)
                })

            enriched.append({
                "bet_cart_id": bet["bet_cart_id"],
                "bet_type": bet_type_data,
                "final_cuote": bet["final_cuote"],
                "options": enriched_options
            })

        return enriched
    
    @staticmethod
    def add_item(session, option_id):

        cart = CartController.get_cart(session)

        option = Option.objects.get(id=option_id)

        bet = {
            "bet_cart_id": str(uuid.uuid4()),
            "bet_type_id": 1,
            "final_cuote": float(option.cuote),
            "options": [
                {
                    "event_id": option.event.id,
                    "option_id": option.id
                }
            ]
        }

        cart.append(bet)
        CartController.save_cart(session, cart)
        print("SESSION ID:", session.session_key)
        print("CART RAW:", session.get("bet_carrito"))

        return cart

    @staticmethod
    def clear(session):
        session[CartController.SESSION_KEY] = []
        session.modified = True

    @staticmethod
    def add_option_to_bet(session, bet_cart_id, option_id):

        cart = CartController.get_cart(session)

        option = Option.objects.get(id=option_id)

        # 🔍 buscar apuesta por ID
        bet = next((b for b in cart if b["bet_cart_id"] == bet_cart_id), None)

        if not bet:
            raise ValueError("Bet no encontrada")

        if any(int(existing.get("option_id")) == int(option.id) for existing in bet["options"]):
            raise ValueError("No puedes añadir la misma opción dos veces dentro de la misma apuesta")

        # añadir opción
        bet["options"].append({
            "event_id": option.event.id,
            "option_id": option.id,
        })

        # recalcular cuota. option.cuote puede venir como Decimal, así que
        # se convierte a float para no romper la petición al añadir al carrito.
        actual_cuote = float(bet["final_cuote"]) * float(option.cuote)

        bet["final_cuote"] = actual_cuote
        bet["bet_type_id"] = 2

        CartController.save_cart(session, cart)

        return cart
    
    @staticmethod
    def remove_option_from_bet(session, bet_cart_id, option_id):

        cart = CartController.get_cart(session)

        bet = next((b for b in cart if b["bet_cart_id"] == bet_cart_id), None)

        if not bet:
            raise ValueError("Bet no encontrada")

        # eliminar opción
        bet["options"] = [
            opt for opt in bet["options"] if int(opt["option_id"]) != int(option_id)
        ]

        # 🔥 CASO: sin opciones → eliminar apuesta completa
        if len(bet["options"]) == 0:
            cart = [b for b in cart if b["bet_cart_id"] != bet_cart_id]
            CartController.save_cart(session, cart)
            return cart

        # 🔥 recalcular cuota
        total_cuote = 1
        for opt in bet["options"]:
            option = Option.objects.get(id=opt["option_id"])
            total_cuote *= float(option.cuote)

        bet["final_cuote"] = total_cuote

        # 🔥 actualizar tipo
        bet["bet_type_id"] = 2 if len(bet["options"]) > 1 else 1

        CartController.save_cart(session, cart)

        return cart

    @staticmethod
    def checkout(session, bets, user):

        cart = CartController.get_cart(session)

        created_bets = []

        # 🔥 indexar carrito por bet_cart_id para acceso rápido
        cart_map = {
            bet["bet_cart_id"]: bet
            for bet in cart
        }

        for bet_data in bets:

            bet_cart_id = bet_data["bet_cart_id"]
            bet_amount = bet_data["bet_amount"]

            # 🔥 obtener apuesta del carrito
            cart_bet = cart_map.get(bet_cart_id)

            if not cart_bet:
                continue  # o lanzar error si prefieres

            # 🔹 calcular cuota total
            total_cuote = cart_bet["final_cuote"]

            # 🔹 profit
            profit = total_cuote * bet_amount

            # 🔹 Transaction
            transaction = Transaction.objects.create(
                amount=bet_amount,
                description=f"Apuesta creada (cuota {total_cuote})",
                date=datetime.now(),
                user_id=user.id,
                transaction_type_id=1
            )

            user.balance = user.balance - bet_amount
            user.save()

            # 🔹 Bet
            bet = Bet.objects.create(
                bet_amount=bet_amount,
                final_cuote=total_cuote,
                profit=profit,
                is_winner=None,
                creation_date=datetime.now(),
                user_id=user.id,
                transaction_id=transaction.id,
                bet_state_id=1,
                bet_type_id=cart_bet["bet_type_id"]
            )

            # 🔹 SemiBets
            for opt in cart_bet["options"]:
                SemiBet.objects.create(
                    bet_id=bet.id,
                    option_id=opt["option_id"]
                )

            created_bets.append(bet.id)

        # 🔥 limpiar carrito
        session[CartController.SESSION_KEY] = []
        session.modified = True

        return created_bets
    
    @staticmethod
    def clean_expired_cart_items(session):
        """
        Revisa el carrito de la sesión y elimina las apuestas u opciones
        cuyos eventos ya no estén en estado Abierto (ID: 2).
        """
        cart = CartController.get_cart(session)
        if not cart:
            return False

        from event.models import Event
        cart_modified = False
        valid_bets = []

        # Como 'cart' es una LISTA de apuestas, la recorremos de forma normal
        for bet in cart:
            valid_options = []
            
            for opt in bet.get("options", []):
                try:
                    # Buscamos el evento usando la clave real de tu JSON: opt["option_id"]
                    event = Event.objects.get(option__id=opt["option_id"])
                    
                    # Si el evento sigue abierto (Estado 2), la opción se queda
                    if event.event_state_id == 2:
                        valid_options.append(opt)
                    else:
                        cart_modified = True
                except Event.DoesNotExist:
                    # Si borran el evento de la base de datos, se limpia del carrito
                    cart_modified = True

            # Evaluamos qué hacemos con la apuesta según las opciones válidas que le queden
            if len(valid_options) > 0:
                # Si le quedan opciones, actualizamos la apuesta
                bet["options"] = valid_options
                
                # RECALCULAR CUOTA (Por si era combinada y expiró un evento)
                total_cuote = 1.0
                for opt in valid_options:
                    from event.models import Option
                    option = Option.objects.get(id=opt["option_id"])
                    total_cuote *= float(option.cuote)
                
                bet["final_cuote"] = total_cuote
                bet["bet_type_id"] = 2 if len(valid_options) > 1 else 1
                
                # Guardamos la apuesta en la nueva lista limpia
                valid_bets.append(bet)
            else:
                # Si no le quedan opciones válidas, la apuesta completa se descarta
                cart_modified = True

        # Si se modificó algo, guardamos los cambios usando tus propios métodos
        if cart_modified:
            CartController.save_cart(session, valid_bets)

        return cart_modified