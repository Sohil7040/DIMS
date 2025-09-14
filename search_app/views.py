from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.core.paginator import Paginator
from django.http import JsonResponse
import json

from documents.models import Document, AccessLog
from documents.forms import DocumentSearchForm
from .utils import SemanticSearchEngine


search_engine = SemanticSearchEngine()


@login_required
def search_documents(request):
    """Traditional keyword search"""
    user_profile = request.user.userprofile
    allowed_categories = user_profile.allowed_categories
    
    # Base queryset
    documents = Document.objects.filter(
        Q(uploaded_by=request.user) |
        Q(is_public=True) |
        Q(category__in=allowed_categories) if allowed_categories else Q(is_public=True)
    ).distinct()
    
    form = DocumentSearchForm(request.GET or None)
    query = ""
    
    if form.is_valid():
        query = form.cleaned_data.get('query', '')
        category = form.cleaned_data.get('category')
        author = form.cleaned_data.get('author')
        date_from = form.cleaned_data.get('date_from')
        date_to = form.cleaned_data.get('date_to')
        
        if query:
            documents = documents.filter(
                Q(title__icontains=query) |
                Q(content_text__icontains=query) |
                Q(summary__icontains=query) |
                Q(author__icontains=query)
            )
            
            # Log search
            AccessLog.objects.create(
                user=request.user,
                action='search',
                search_query=query,
                ip_address=get_client_ip(request)
            )
        
        if category:
            documents = documents.filter(category=category)
        
        if author:
            documents = documents.filter(author__icontains=author)
        
        if date_from:
            documents = documents.filter(uploaded_at__date__gte=date_from)
        
        if date_to:
            documents = documents.filter(uploaded_at__date__lte=date_to)
    
    # Pagination
    paginator = Paginator(documents, 10)
    page_number = request.GET.get('page')
    documents = paginator.get_page(page_number)
    
    context = {
        'documents': documents,
        'form': form,
        'query': query,
        'search_type': 'keyword'
    }
    
    return render(request, 'search/search.html', context)


@login_required
def semantic_search(request):
    """Semantic search using embeddings"""
    if request.method == 'POST':
        data = json.loads(request.body)
        query = data.get('query', '')
        
        if query:
            user_profile = request.user.userprofile
            allowed_categories = user_profile.allowed_categories
            
            # Get user's accessible documents
            accessible_doc_ids = Document.objects.filter(
                Q(uploaded_by=request.user) |
                Q(is_public=True) |
                Q(category__in=allowed_categories) if allowed_categories else Q(is_public=True)
            ).values_list('id', flat=True)
            
            # Perform semantic search
            results = search_engine.search(query, list(accessible_doc_ids))
            
            # Log search
            AccessLog.objects.create(
                user=request.user,
                action='search',
                search_query=query,
                ip_address=get_client_ip(request)
            )
            
            return JsonResponse({'results': results})
    
    return JsonResponse({'error': 'Invalid request'})


def get_client_ip(request):
    """Get client IP address"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip