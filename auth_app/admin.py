from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'department', 'can_upload', 'storage_quota_mb']
    list_filter = ['role', 'can_upload']
    search_fields = ['user__username', 'department']
