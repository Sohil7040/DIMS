from django import forms
from .models import Document
from django.conf import settings


class DocumentUploadForm(forms.ModelForm):
    class Meta:
        model = Document
        fields = ['file', 'title', 'category', 'is_public']
        widgets = {
            'file': forms.FileInput(attrs={
                'class': 'form-control',
                'accept': '.pdf,.docx,.txt'
            }),
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Leave blank to auto-extract from document'
            }),
            'category': forms.Select(attrs={
                'class': 'form-control'
            }),
            'is_public': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            })
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        
        # Filter categories based on user role
        if user and hasattr(user, 'userprofile'):
            allowed_categories = user.userprofile.allowed_categories
            if allowed_categories:
                choices = [('', '-- Auto-classify --')]
                choices.extend([
                    (cat, label) for cat, label in settings.DOCUMENT_CATEGORIES 
                    if cat in allowed_categories
                ])
                self.fields['category'].choices = choices

    def clean_file(self):
        file = self.cleaned_data.get('file')
        if file:
            # Check file extension
            allowed_extensions = ['.pdf', '.docx', '.txt']
            file_extension = file.name.lower().split('.')[-1]
            if f'.{file_extension}' not in allowed_extensions:
                raise forms.ValidationError(
                    f"File type not supported. Allowed types: {', '.join(allowed_extensions)}"
                )
            
            # Check file size (50MB limit)
            if file.size > 50 * 1024 * 1024:
                raise forms.ValidationError("File size cannot exceed 50MB")
        
        return file


class DocumentSearchForm(forms.Form):
    query = forms.CharField(
        max_length=500,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Search documents...',
            'autocomplete': 'off'
        })
    )
    category = forms.ChoiceField(
        choices=[('', 'All Categories')] + settings.DOCUMENT_CATEGORIES,
        required=False,
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    author = forms.CharField(
        max_length=255,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Filter by author...'
        })
    )
    date_from = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date'
        })
    )
    date_to = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date'
        })
    )