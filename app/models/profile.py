from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.contrib.postgres.fields import JSONField
from django.contrib.postgres.fields import ArrayField


class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name='profile', on_delete=models.CASCADE)
    roles = ArrayField(models.CharField(max_length=100, null=True))
    attrs = JSONField(null=True)


def create_profile(sender, **kwargs):
    user = kwargs["instance"]
    if kwargs["created"]:
        profile = UserProfile(user=user)
        if profile.roles is None:
            profile.roles = []
        profile.save()

post_save.connect(create_profile, sender=User)

