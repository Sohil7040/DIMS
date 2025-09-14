from django.contrib import admin
from .models import Document, AccessLog


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'filename', 'category', 'uploaded_by', 'uploaded_at', 'file_size']
    list_filter = ['category', 'uploaded_at', 'file_type']
    search_fields = ['title', 'filename', 'content_text']
    readonly_fields = ['uploaded_at', 'updated_at', 'file_size', 'embeddings']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'filename', 'original_filename', 'file')
        }),
        ('Classification', {
            'fields': ('category', 'category_confidence')
        }),
        ('Metadata', {
            'fields': ('author', 'extracted_date', 'file_size', 'file_type')
        }),
        ('Content', {
            'fields': ('content_text', 'summary', 'entities'),
            'classes': ('collapse',)
        }),
        ('Access Control', {
            'fields': ('uploaded_by', 'is_public', 'allowed_roles')
        }),
        ('Timestamps', {
            'fields': ('uploaded_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )


@admin.register(AccessLog)
class AccessLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'document', 'timestamp', 'ip_address']
    list_filter = ['action', 'timestamp']
    search_fields = ['user__username', 'document__title', 'search_query']
    readonly_fields = ['timestamp']
