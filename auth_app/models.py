from django.db import models
from django.contrib.auth.models import User
from django.conf import settings


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=50, default='user')
    department = models.CharField(max_length=100, blank=True)
    can_upload = models.BooleanField(default=True)
    storage_quota_mb = models.IntegerField(default=1000)  # 1GB default

    def __str__(self):
        return f"{self.user.username} - {self.role}"

    @property
    def allowed_categories(self):
        """Get categories this user can access based on role"""
        return settings.USER_ROLES.get(self.role, [])
