from datetime import datetime, timezone

from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand
from django.db import transaction

from bet.models import BetState, BetType
from event.models import Event, EventCategory, EventState, Option
from exchange.models import ExchangeProduct, ExchangeStatus
from transaction.models import TransactionType
from user.models import UserState

# ------------------ Catálogos ------------------------
# Los IDs están fijados en la lógica del backend (controllers), por eso se
# crean con su pk exacta. No cambiar sin revisar el código que los usa.

EVENT_STATES = {
    1: "Borrador",
    2: "Abierto",
    3: "Cerrado",
    4: "Resuelto",
    5: "Cancelado",
}

BET_STATES = {
    1: "En Curso",
    2: "Calculada",
    3: "Pagada",
    4: "Cancelada",
}

BET_TYPES = {
    1: "Simple",
    2: "Combinada",
}

TRANSACTION_TYPES = {
    1: "Apuesta",
    2: "Ganancia",
    3: "Canje",
    4: "Ajuste de Admin",
    5: "Evento Cancelado",
}

EXCHANGE_STATUSES = {
    1: "Completado",
    2: "Error",
}

USER_STATES = {
    1: "Activo",
    2: "Bloqueado",
}

# El grupo con id=1 se considera administrador (ver user/views.py y event/views.py)
ADMIN_GROUP = {1: "Administradores"}

CATEGORIES = ["Académico", "Deportivo", "Campus", "Tecnología", "Cultura"]

# ------------------ Datos de ejemplo ------------------------
# closing_date: (mes, día) de 2050. Fecha lejana a propósito: los eventos
# no se cierran solos, el cierre lo hace un administrador desde el panel.

CLOSING_YEAR = 2050

EVENTS = [
    {
        "name": "Aprobados en Cálculo I",
        "description": "¿Superará el 60% de aprobados el primer parcial de Cálculo I?",
        "category": "Académico",
        "state": 2,
        "closing_date": (1, 20),
        "options": [("Sí", 1.85), ("No", 1.95)],
    },
    {
        "name": "Nota media de los TFG",
        "description": "¿Será mayor de 7.5 la nota media de los TFG defendidos este curso?",
        "category": "Académico",
        "state": 2,
        "closing_date": (7, 15),
        "options": [("Mayor de 7.5", 2.10), ("7.5 o menos", 1.70)],
    },
    {
        "name": "Revisión de examen con cambio de nota",
        "description": "¿Cambiará alguna nota tras la revisión del examen de Bases de Datos?",
        "category": "Académico",
        "state": 2,
        "closing_date": (2, 10),
        "options": [("Sí, sube alguna", 1.60), ("Ninguna cambia", 2.30)],
    },
    {
        "name": "Final del torneo de fútbol sala",
        "description": "¿Quién ganará la final del torneo universitario de fútbol sala?",
        "category": "Deportivo",
        "state": 2,
        "closing_date": (4, 25),
        "options": [("Informática", 1.90), ("Empate", 3.10), ("Industriales", 2.80)],
    },
    {
        "name": "Carrera solidaria del campus",
        "description": "¿Se superarán los 500 participantes en la carrera solidaria?",
        "category": "Deportivo",
        "state": 2,
        "closing_date": (10, 18),
        "options": [("Más de 500", 2.20), ("500 o menos", 1.65)],
    },
    {
        "name": "Croissants agotados antes de las 10:30",
        "description": "¿Se acabarán los croissants de la cafetería antes de las 10:30 el lunes?",
        "category": "Campus",
        "state": 2,
        "closing_date": (3, 7),
        "options": [("Sí", 3.00), ("No", 1.40)],
    },
    {
        "name": "Wifi caído en semana de exámenes",
        "description": "¿Habrá alguna caída general del wifi del campus durante la semana de exámenes?",
        "category": "Tecnología",
        "state": 2,
        "closing_date": (6, 12),
        "options": [("Sí", 1.75), ("No", 2.05)],
    },
    {
        "name": "Asistencia al concierto de fin de curso",
        "description": "¿Cuántas personas asistirán al concierto de fin de curso?",
        "category": "Cultura",
        "state": 2,
        "closing_date": (6, 26),
        "options": [("Menos de 300", 2.50), ("Entre 300 y 600", 1.80), ("Más de 600", 3.40)],
    },
    {
        # Evento en borrador: sirve para probar "Abrir evento" desde el panel de admin
        "name": "Hackathon de primavera",
        "description": "¿Ganará un equipo de primer curso el hackathon de primavera?",
        "category": "Tecnología",
        "state": 1,
        "closing_date": (5, 30),
        "options": [("Sí", 4.00), ("No", 1.25)],
    },
    {
        # Evento cerrado: sirve para probar "Resolver evento" desde el panel de admin
        "name": "Cola del comedor el viernes",
        "description": "¿Superó la cola del comedor los 20 minutos el viernes a mediodía?",
        "category": "Campus",
        "state": 3,
        "closing_date": (11, 5),
        "options": [("Sí", 1.55), ("No", 2.45)],
    },
]

EXCHANGE_PRODUCTS = [
    ("Café en la cafetería", "Un café de máquina o de barra en la cafetería de la facultad.", 50, True),
    ("Pack de pegatinas UEx365", "Cinco pegatinas oficiales para el portátil.", 80, True),
    ("Taza UEx365", "Taza de cerámica con el logo para sobrevivir a la época de exámenes.", 250, True),
    ("Camiseta UEx365", "Camiseta de algodón con el logo, disponible en varias tallas.", 600, True),
    ("Sudadera UEx365", "Sudadera con capucha edición limitada.", 1200, True),
    ("Apuntes encuadernados", "Encuadernación gratuita de tus apuntes en reprografía.", 150, False),
]


class Command(BaseCommand):
    help = "Rellena la base de datos con los catálogos necesarios y datos de ejemplo (eventos y productos). No crea usuarios."

    @transaction.atomic
    def handle(self, *args, **options):
        self.seed_catalog(EventState, EVENT_STATES)
        self.seed_catalog(BetState, BET_STATES)
        self.seed_catalog(BetType, BET_TYPES)
        self.seed_catalog(TransactionType, TRANSACTION_TYPES)
        self.seed_catalog(ExchangeStatus, EXCHANGE_STATUSES)
        self.seed_catalog(UserState, USER_STATES)
        self.seed_catalog(Group, ADMIN_GROUP)
        self.stdout.write("Catálogos de estados y tipos listos.")

        categories = {}
        for name in CATEGORIES:
            categories[name], _ = EventCategory.objects.get_or_create(name=name)

        created_events = 0
        for data in EVENTS:
            # Los eventos que ya existen no se tocan, para no romper apuestas hechas sobre ellos
            if Event.objects.filter(name=data["name"]).exists():
                continue
            event = Event.objects.create(
                name=data["name"],
                description=data["description"],
                closing_date=datetime(CLOSING_YEAR, *data["closing_date"], 20, 0, tzinfo=timezone.utc),
                event_state_id=data["state"],
                event_category=categories[data["category"]],
            )
            for option_name, cuote in data["options"]:
                Option.objects.create(event=event, name=option_name, cuote=cuote)
            created_events += 1

        created_products = 0
        for name, description, price, is_active in EXCHANGE_PRODUCTS:
            _, created = ExchangeProduct.objects.get_or_create(
                name=name,
                defaults={"description": description, "price": price, "is_active": is_active},
            )
            created_products += created

        self.stdout.write(self.style.SUCCESS(
            f"Seed completado -> categorías={len(categories)}, "
            f"eventos nuevos={created_events}, productos nuevos={created_products}"
        ))

    @staticmethod
    def seed_catalog(model, values):
        for pk, name in values.items():
            model.objects.update_or_create(pk=pk, defaults={"name": name})
