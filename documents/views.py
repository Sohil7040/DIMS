from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import HttpResponse, Http404
from django.core.paginator import Paginator
from django.db.models import Q
from django.conf import settings
import os
import mimetypes

from .models import Document, AccessLog
from .forms import DocumentUploadForm, DocumentSearchForm
from .utils import process_document


@login_required
def dashboard(request):
    """Main dashboard view"""
    user_profile = request.user.userprofile
    allowed_categories = user_profile.allowed_categories
    
    # Get user's recent documents
    recent_docs = Document.objects.filter(
        uploaded_by=request.user
    )[:5]
    
    # Get accessible documents based on role
    if allowed_categories:
        accessible_docs = Document.objects.filter(
            Q(category__in=allowed_categories) | Q(is_public=True)
        ).exclude(uploaded_by=request.user)[:5]
    else:
        accessible_docs = Document.objects.filter(is_public=True)[:5]
    
    # Get statistics
    stats = {
        'total_uploaded': Document.objects.filter(uploaded_by=request.user).count(),
        'total_accessible': accessible_docs.count(),
        'categories_count': len(allowed_categories) if allowed_categories else 0,
    }
    
    context = {
        'recent_docs': recent_docs,
        'accessible_docs': accessible_docs,
        'stats': stats,
        'user_profile': user_profile,
    }
    
    return render(request, 'documents/dashboard.html', context)


@login_required
def upload_document(request):
    """Handle document upload"""
    if not request.user.userprofile.can_upload:
        messages.error(request, "You don't have permission to upload documents.")
        return redirect('documents:dashboard')
    
    if request.method == 'POST':
        form = DocumentUploadForm(request.POST, request.FILES, user=request.user)
        if form.is_valid():
            document = form.save(commit=False)
            document.uploaded_by = request.user
            document.original_filename = document.file.name
            document.filename = document.file.name
            document.file_size = document.file.size
            document.file_type = os.path.splitext(document.file.name)[1].lower()
            
            # Save first to get an ID
            document.save()
            
            # Process the document asynchronously
            try:
                process_document(document)
                messages.success(request, f"Document '{document.filename}' uploaded and processed successfully!")
                
                # Log the upload
                AccessLog.objects.create(
                    user=request.user,
                    document=document,
                    action='upload',
                    ip_address=get_client_ip(request)
                )
                
            except Exception as e:
                messages.warning(request, f"Document uploaded but processing failed: {str(e)}")
            
            return redirect('documents:view', document_id=document.id)
    else:
        form = DocumentUploadForm(user=request.user)
    
    return render(request, 'documents/upload.html', {'form': form})


@login_required
def view_document(request, document_id):
    """View document details"""
    document = get_object_or_404(Document, id=document_id)
    
    # Check permissions
    user_profile = request.user.userprofile
    allowed_categories = user_profile.allowed_categories
    
    if (document.uploaded_by != request.user and 
        not document.is_public and 
        document.category not in allowed_categories):
        raise Http404("Document not found")
    
    # Log the view
    AccessLog.objects.create(
        user=request.user,
        document=document,
        action='view',
        ip_address=get_client_ip(request)
    )
    
    return render(request, 'documents/view.html', {'document': document})


@login_required
def download_document(request, document_id):
    """Download document file"""
    document = get_object_or_404(Document, id=document_id)
    
    # Check permissions
    user_profile = request.user.userprofile
    allowed_categories = user_profile.allowed_categories
    
    if (document.uploaded_by != request.user and 
        not document.is_public and 
        document.category not in allowed_categories):
        raise Http404("Document not found")
    
    # Log the download
    AccessLog.objects.create(
        user=request.user,
        document=document,
        action='download',
        ip_address=get_client_ip(request)
    )
    
    file_path = document.file.path
    if os.path.exists(file_path):
        with open(file_path, 'rb') as fh:
            content_type, _ = mimetypes.guess_type(file_path)
            response = HttpResponse(fh.read(), content_type=content_type)
            response['Content-Disposition'] = f'attachment; filename="{document.original_filename}"'
            return response
    
    raise Http404("File not found")


@login_required
def document_list(request):
    """List all accessible documents with search and filters"""
    user_profile = request.user.userprofile
    allowed_categories = user_profile.allowed_categories
    
    # Base queryset - user's documents + accessible ones
    documents = Document.objects.filter(
        Q(uploaded_by=request.user) |
        Q(is_public=True) |
        Q(category__in=allowed_categories) if allowed_categories else Q(is_public=True)
    ).distinct()
    
    # Handle search and filters
    form = DocumentSearchForm(request.GET or None)
    if form.is_valid():
        query = form.cleaned_data.get('query')
        category = form.cleaned_data.get('category')
        author = form.cleaned_data.get('author')
        date_from = form.cleaned_data.get('date_from')
        date_to = form.cleaned_data.get('date_to')
        
        if query:
            documents = documents.filter(
                Q(title__icontains=query) |
                Q(content_text__icontains=query) |
                Q(summary__icontains=query)
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
        'user_profile': user_profile,
    }
    
    return render(request, 'documents/list.html', context)


def get_client_ip(request):
    """Get client IP address"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip