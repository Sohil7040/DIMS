from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.forms import UserCreationForm
from .forms import UserProfileForm


def register(request):
    """User registration"""
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Account created successfully!')
            return redirect('documents:dashboard')
    else:
        form = UserCreationForm()
    
    return render(request, 'auth/register.html', {'form': form})


@login_required
def profile(request):
    """User profile page"""
    user_profile = request.user.userprofile
    
    if request.method == 'POST':
        form = UserProfileForm(request.POST, instance=user_profile)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated successfully!')
            return redirect('auth_app:profile')
    else:
        form = UserProfileForm(instance=user_profile)
    
    # Get user stats
    from documents.models import Document, AccessLog
    stats = {
        'uploaded_docs': Document.objects.filter(uploaded_by=request.user).count(),
        'total_views': AccessLog.objects.filter(user=request.user, action='view').count(),
        'total_downloads': AccessLog.objects.filter(user=request.user, action='download').count(),
        'total_searches': AccessLog.objects.filter(user=request.user, action='search').count(),
    }
    
    context = {
        'form': form,
        'user_profile': user_profile,
        'stats': stats,
    }
    
    return render(request, 'auth/profile.html', context)