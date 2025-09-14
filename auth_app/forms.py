from django import forms
from .models import UserProfile
from django.conf import settings


class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['role', 'department', 'can_upload', 'storage_quota_mb']
        widgets = {
            'role': forms.Select(
                choices=[(role, role.title()) for role in settings.USER_ROLES.keys()],
                attrs={'class': 'form-control'}
            ),
            'department': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., Finance, HR, Legal'
            }),
            'can_upload': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            }),
            'storage_quota_mb': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 100,
                'max': 10000
            })
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['storage_quota_mb'].help_text = "Storage quota in MB (100-10000)"