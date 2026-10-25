from rest_framework import serializers
from .models import EventCategory, EventState, Event, Option

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = '__all__'

# ----------------------- Serializers EVENT_CATEGORY -------------------------------

class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategory
        fields = '__all__'

# ----------------------- Serializers EVENT_STATE -------------------------------

class EventStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventState
        fields = '__all__'

# ----------------------- Serializers EVENT -------------------------------

class EventListSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True, source='option_set')
    event_state = EventStateSerializer(read_only=True)
    event_category = EventCategorySerializer(read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'creation_date', 'closing_date', 'resolution_date',
                   'event_category', 'event_state', 'options']

class EventCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['name', 'description', 'closing_date', 'event_category']

class EventEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['name', 'description', 'closing_date', 'event_category']

class EventDetailSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True, source='option_set')
    event_state = EventStateSerializer(read_only=True)
    event_category = EventCategorySerializer(read_only=True)

    class Meta:
        model = Event
        fields = [
            'id',
            'name',
            'description',
            'creation_date',
            'closing_date',
            'resolution_date',
            'event_state',
            'event_category',
            'options'
        ]

# ----------------------- Serializers OPTION -------------------------------

class OptionListSerializer(serializers.ModelSerializer):
    event = EventListSerializer(read_only=True)
    class Meta:
        model = Option
        fields = ['id', 'name', 'cuote', 'is_winner', 'event']

class OptionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['name', 'cuote', 'event']

class OptionEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['name', 'cuote']
        