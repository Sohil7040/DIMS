import numpy as np
from typing import List, Dict, Tuple
from documents.models import Document

try:
    from sentence_transformers import SentenceTransformer
    from sklearn.metrics.pairwise import cosine_similarity
except ImportError:
    print("Warning: sentence-transformers or sklearn not available")


class SemanticSearchEngine:
    def __init__(self):
        self.model = None
        self._initialize_model()
    
    def _initialize_model(self):
        """Initialize the sentence transformer model"""
        try:
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            print(f"Warning: Could not initialize sentence transformer: {e}")
    
    def search(self, query: str, accessible_doc_ids: List[int], top_k: int = 10) -> List[Dict]:
        """Perform semantic search"""
        if not self.model:
            return self._fallback_search(query, accessible_doc_ids, top_k)
        
        try:
            # Get documents with embeddings
            documents = Document.objects.filter(
                id__in=accessible_doc_ids,
                embeddings__isnull=False
            ).exclude(embeddings=[])
            
            if not documents.exists():
                return self._fallback_search(query, accessible_doc_ids, top_k)
            
            # Generate query embedding
            query_embedding = self.model.encode([query])
            
            # Calculate similarities
            similarities = []
            for doc in documents:
                if doc.embeddings:
                    doc_embedding = np.array(doc.embeddings).reshape(1, -1)
                    similarity = cosine_similarity(query_embedding, doc_embedding)[0][0]
                    similarities.append({
                        'document': doc,
                        'similarity': similarity
                    })
            
            # Sort by similarity
            similarities.sort(key=lambda x: x['similarity'], reverse=True)
            
            # Format results
            results = []
            for item in similarities[:top_k]:
                doc = item['document']
                results.append({
                    'id': doc.id,
                    'title': doc.title,
                    'filename': doc.filename,
                    'category': doc.get_category_display(),
                    'author': doc.author,
                    'summary': doc.summary[:200] + '...' if len(doc.summary) > 200 else doc.summary,
                    'uploaded_at': doc.uploaded_at.strftime('%Y-%m-%d %H:%M'),
                    'similarity': round(item['similarity'], 3),
                    'url': f'/documents/view/{doc.id}/'
                })
            
            return results
            
        except Exception as e:
            print(f"Error in semantic search: {e}")
            return self._fallback_search(query, accessible_doc_ids, top_k)
    
    def _fallback_search(self, query: str, accessible_doc_ids: List[int], top_k: int) -> List[Dict]:
        """Fallback to simple text search"""
        from django.db.models import Q
        
        documents = Document.objects.filter(
            id__in=accessible_doc_ids
        ).filter(
            Q(title__icontains=query) |
            Q(content_text__icontains=query) |
            Q(summary__icontains=query)
        )[:top_k]
        
        results = []
        for doc in documents:
            results.append({
                'id': doc.id,
                'title': doc.title,
                'filename': doc.filename,
                'category': doc.get_category_display(),
                'author': doc.author,
                'summary': doc.summary[:200] + '...' if len(doc.summary) > 200 else doc.summary,
                'uploaded_at': doc.uploaded_at.strftime('%Y-%m-%d %H:%M'),
                'similarity': 0.5,  # Default similarity
                'url': f'/documents/view/{doc.id}/'
            })
        
        return results