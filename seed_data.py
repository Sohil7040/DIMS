#!/usr/bin/env python
"""
Script to create initial data for the Document AI system.
Run this after setting up the database: python seed_data.py
"""

import os
import sys
import django
from django.contrib.auth.models import User

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'document_ai.settings')
django.setup()

from documents.models import UserProfile
from django.conf import settings


def create_users():
    """Create sample users with different roles"""
    users_data = [
        {
            'username': 'admin',
            'email': 'admin@documentai.com',
            'password': 'admin123',
            'first_name': 'Admin',
            'last_name': 'User',
            'role': 'admin',
            'department': 'IT',
            'is_staff': True,
            'is_superuser': True
        },
        {
            'username': 'john_finance',
            'email': 'john@finance.com',
            'password': 'finance123',
            'first_name': 'John',
            'last_name': 'Smith',
            'role': 'finance',
            'department': 'Finance'
        },
        {
            'username': 'sarah_hr',
            'email': 'sarah@hr.com',
            'password': 'hr123',
            'first_name': 'Sarah',
            'last_name': 'Johnson',
            'role': 'hr',
            'department': 'Human Resources'
        },
        {
            'username': 'mike_legal',
            'email': 'mike@legal.com',
            'password': 'legal123',
            'first_name': 'Mike',
            'last_name': 'Davis',
            'role': 'legal',
            'department': 'Legal'
        },
        {
            'username': 'emma_tech',
            'email': 'emma@tech.com',
            'password': 'tech123',
            'first_name': 'Emma',
            'last_name': 'Wilson',
            'role': 'technical',
            'department': 'Engineering'
        }
    ]
    
    for user_data in users_data:
        username = user_data['username']
        if User.objects.filter(username=username).exists():
            print(f"User {username} already exists, skipping...")
            continue
            
        # Create user
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data['email'],
            password=user_data['password'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name']
        )
        
        if user_data.get('is_staff'):
            user.is_staff = True
        if user_data.get('is_superuser'):
            user.is_superuser = True
        user.save()
        
        # Update user profile
        profile = user.userprofile
        profile.role = user_data['role']
        profile.department = user_data['department']
        profile.save()
        
        print(f"Created user: {username} ({user_data['role']})")


def create_sample_documents():
    """Create sample document data"""
    # This would create sample documents, but since we can't create actual files
    # in this environment, we'll just print instructions
    print("\nSample documents can be created by:")
    print("1. Log in to the system")
    print("2. Upload sample PDF, DOCX, or TXT files")
    print("3. The system will automatically process and classify them")


def main():
    print("Setting up Document AI seed data...")
    print("=" * 50)
    
    create_users()
    create_sample_documents()
    
    print("\n" + "=" * 50)
    print("Seed data setup complete!")
    print("\nYou can now login with:")
    print("- Admin: admin / admin123 (full access)")
    print("- Finance: john_finance / finance123")
    print("- HR: sarah_hr / hr123")
    print("- Legal: mike_legal / legal123")
    print("- Technical: emma_tech / tech123")


if __name__ == '__main__':
    main()