from django.db import migrations


def create_default_userstate(apps, schema_editor):
    UserState = apps.get_model('user', 'UserState')
    # Crear el UserState por defecto si no existe
    if not UserState.objects.filter(id=1).exists():
        UserState.objects.create(id=1, name='Active')


def reverse_create_default_userstate(apps, schema_editor):
    UserState = apps.get_model('user', 'UserState')
    UserState.objects.filter(id=1, name='Active').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_remove_group_module_remove_user_group_and_more'),
    ]

    operations = [
        migrations.RunPython(create_default_userstate, reverse_create_default_userstate),
    ]
