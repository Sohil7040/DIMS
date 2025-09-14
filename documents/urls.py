from django.urls import path
from . import views

app_name = 'documents'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('upload/', views.upload_document, name='upload'),
    path('view/<int:document_id>/', views.view_document, name='view'),
    path('download/<int:document_id>/', views.download_document, name='download'),
    path('list/', views.document_list, name='list'),
]