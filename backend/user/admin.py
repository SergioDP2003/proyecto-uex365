from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import UserState, User
from django.contrib.auth.models import Group

# Register your models here.

class UserStateAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

class CustomUserAdmin(UserAdmin):
    # Campos que se muestran en la lista de usuarios
    list_display = ('username', 'email', 'balance', 'user_state', 'is_staff', 'is_superuser', 'is_active')
    
    # Filtros laterales
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'user_state')
    
    # Campos de búsqueda
    search_fields = ('username', 'email', 'first_name', 'last_name')
    
    # Ordenamiento por defecto
    ordering = ('username',)
    
    # Campos que se muestran en el formulario de edición (organizados por secciones)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información personal', {'fields': ('first_name', 'last_name', 'email', 'avatar_url')}),
        ('Información de cuenta', {'fields': ('balance', 'user_state')}),  # 👈 AÑADIDO: balance y user_state
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas importantes', {'fields': ('last_login', 'date_joined')}),
    )
    
    # Campos que se muestran en el formulario de creación
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'balance', 'user_state', 'is_staff', 'is_superuser'),
        }),
    )
    
    # Permitir editar estos campos directamente desde la lista
    list_editable = ('balance', 'user_state', 'is_active')  

    # Mostrar campos como links
    list_display_links = ('username',)

  
admin.site.register(User, CustomUserAdmin)
admin.site.register(UserState, UserStateAdmin)

