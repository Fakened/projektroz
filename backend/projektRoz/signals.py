from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import FosterCareer


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        FosterCareer.objects.create(user=instance, name = instance.first_name, surname = instance.last_name, email = instance.email)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, *args, **kwargs):
    fosterCareer, created = FosterCareer.objects.get_or_create(user=instance)
    if not created:
        fosterCareer.save()