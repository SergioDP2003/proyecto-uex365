from rest_framework import serializers
from .models import UserState, User
from django.contrib.auth.models import Group

class UserStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserState
        fields = '__all__'

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    user_state_name = serializers.CharField(source='user_state.name', read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'balance', 'avatar_url', 'user_state','user_state_name', 'groups', 'password', 'date_joined', 'is_staff', 'last_login']
        extra_kwargs = {
            'password': {'write_only': True},
            'balance': {'read_only': True},
            'user_state': {'read_only': True},
            'groups': {'read_only': True}
            }
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    

class UserModifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Solo los campos que el admin puede tocar en el formulario
        fields = [
            'username', 'email', 'first_name', 'last_name', 
            'user_state', 'is_staff'
        ]

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Solo los campos que el admin puede tocar en el formulario
        fields = [
            'username', 'password', 'email', 'first_name', 'last_name', 
            'user_state', 'is_staff'
        ]