"""
WSGI config for document_ai project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'document_ai.settings')

application = get_wsgi_application()