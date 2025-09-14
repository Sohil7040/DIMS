from django.urls import path
from . import views

app_name = 'search_app'

urlpatterns = [
    path('', views.search_documents, name='search'),
    path('semantic/', views.semantic_search, name='semantic'),
]