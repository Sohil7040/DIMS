from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
import os


class Document(models.Model):
    CATEGORY_CHOICES = settings.DOCUMENT_CATEGORIES

    title = models.CharField(max_length=500, blank=True)
    filename = models.CharField(max_length=255)
    original_filename = models.CharField(max_length=255)
    file = models.FileField(upload_to='documents/%Y/%m/%d/')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, blank=True)
    category_confidence = models.FloatField(default=0.0)
    
    # Metadata
    author = models.CharField(max_length=255, blank=True)
    extracted_date = models.DateField(null=True, blank=True)
    file_size = models.BigIntegerField(default=0)
    file_type = models.CharField(max_length=10)
    
    # Content
    content_text = models.TextField(blank=True)
    summary = models.TextField(blank=True)
    entities = models.JSONField(default=dict, blank=True)
    keywords = models.JSONField(default=list, blank=True)
    topics = models.JSONField(default=list, blank=True)
    sentiment = models.CharField(max_length=20, blank=True)

    # Embeddings for semantic search
    embeddings = models.JSONField(default=list, blank=True)
    
    # Upload info
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Access control
    is_public = models.BooleanField(default=False)
    allowed_roles = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ['-uploaded_at']
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['uploaded_by']),
            models.Index(fields=['uploaded_at']),
        ]

    def __str__(self):
        return self.title or self.filename

    @property
    def file_extension(self):
        return os.path.splitext(self.filename)[1].lower()

    def get_file_size_display(self):
        """Return human readable file size"""
        size = self.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"


class AccessLog(models.Model):
    ACTION_CHOICES = [
        ('upload', 'Upload'),
        ('view', 'View'),
        ('download', 'Download'),
        ('search', 'Search'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, null=True, blank=True)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    search_query = models.CharField(max_length=500, blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        if self.document:
            return f"{self.user.username} - {self.action} - {self.document.title}"
        return f"{self.user.username} - {self.action}"



