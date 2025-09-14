import os
import re
from datetime import datetime
from typing import Dict, List, Tuple, Optional
import tempfile
from django.conf import settings

# Document processing imports
try:
    import PyPDF2
    HAS_PYPDF2 = True
except ImportError:
    HAS_PYPDF2 = False
    print("Warning: PyPDF2 not available")

try:
    from docx import Document as DocxDocument
    HAS_DOCX = True
except ImportError:
    HAS_DOCX = False
    print("Warning: python-docx not available")

try:
    from transformers import pipeline
    HAS_TRANSFORMERS = True
except ImportError:
    HAS_TRANSFORMERS = False
    print("Warning: transformers not available")

try:
    from sentence_transformers import SentenceTransformer
    HAS_SENTENCE_TRANSFORMERS = True
except ImportError:
    HAS_SENTENCE_TRANSFORMERS = False
    print("Warning: sentence-transformers not available")

try:
    import spacy
    HAS_SPACY = True
except ImportError:
    HAS_SPACY = False
    print("Warning: spacy not available")

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    import numpy as np
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False
    print("Warning: sklearn not available")


class DocumentProcessor:
    def __init__(self):
        self.classifier = None
        self.sentence_model = None
        self.nlp = None
        self.sentiment_analyzer = None
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize AI models"""
        try:
            # Zero-shot classifier for document classification
            if HAS_TRANSFORMERS:
                self.classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
                self.sentiment_analyzer = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment-latest")
            else:
                self.classifier = None
                self.sentiment_analyzer = None

            # Sentence transformer for embeddings
            if HAS_SENTENCE_TRANSFORMERS:
                self.sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
            else:
                self.sentence_model = None

            # spaCy for NER
            if HAS_SPACY:
                try:
                    self.nlp = spacy.load("en_core_web_sm")
                except OSError:
                    print("Warning: spaCy English model not found. Run: python -m spacy download en_core_web_sm")
                    self.nlp = None
            else:
                self.nlp = None

        except Exception as e:
            print(f"Warning: Could not initialize AI models: {e}")
    
    def extract_text_from_file(self, file_path: str, file_type: str) -> str:
        """Extract text content from different file types"""
        content = ""
        
        try:
            if file_type == '.pdf':
                content = self._extract_from_pdf(file_path)
            elif file_type == '.docx':
                content = self._extract_from_docx(file_path)
            elif file_type == '.txt':
                content = self._extract_from_txt(file_path)
            else:
                raise ValueError(f"Unsupported file type: {file_type}")
        except Exception as e:
            print(f"Error extracting text from {file_path}: {e}")
            
        return content.strip()
    
    def _extract_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF"""
        text = ""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
        except Exception as e:
            print(f"Error reading PDF: {e}")
        return text
    
    def _extract_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX"""
        text = ""
        try:
            doc = DocxDocument(file_path)
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
        except Exception as e:
            print(f"Error reading DOCX: {e}")
        return text
    
    def _extract_from_txt(self, file_path: str) -> str:
        """Extract text from TXT file"""
        text = ""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                text = file.read()
        except UnicodeDecodeError:
            try:
                with open(file_path, 'r', encoding='latin-1') as file:
                    text = file.read()
            except Exception as e:
                print(f"Error reading TXT file: {e}")
        return text
    
    def classify_document(self, text: str) -> Tuple[str, float]:
        """Classify document into predefined categories using zero-shot classification"""
        if not self.classifier:
            return self._rule_based_classification(text)
        
        try:
            candidate_labels = [label for label, _ in settings.DOCUMENT_CATEGORIES]
            result = self.classifier(text, candidate_labels)
            if result and 'labels' in result and 'scores' in result:
                top_label = result['labels'][0]
                top_score = result['scores'][0]
                return top_label, top_score
            else:
                return self._rule_based_classification(text)
        except Exception as e:
            print(f"Error in AI classification: {e}")
            return self._rule_based_classification(text)
    
    def _rule_based_classification(self, text: str) -> Tuple[str, float]:
        """Rule-based document classification"""
        text_lower = text.lower()
        
        # Finance keywords
        if any(word in text_lower for word in ['budget', 'financial', 'revenue', 'profit', 'expense', 'accounting']):
            return 'finance', 0.8
        
        # Invoice keywords
        if any(word in text_lower for word in ['invoice', 'payment', 'billing', 'amount due', 'total:']):
            return 'invoices', 0.9
        
        # Legal keywords
        if any(word in text_lower for word in ['legal', 'law', 'court', 'attorney', 'jurisdiction', 'whereas']):
            return 'legal', 0.8
        
        # Contract keywords
        if any(word in text_lower for word in ['contract', 'agreement', 'terms and conditions', 'party', 'hereby']):
            return 'contracts', 0.9
        
        # HR keywords
        if any(word in text_lower for word in ['employee', 'hr', 'human resources', 'payroll', 'benefits', 'policy']):
            return 'hr', 0.8
        
        # Technical keywords
        if any(word in text_lower for word in ['technical', 'report', 'analysis', 'research', 'methodology', 'results']):
            return 'technical_reports', 0.7
        
        return '', 0.0
    
    def extract_metadata(self, text: str) -> Dict[str, any]:
        """Extract metadata from document text"""
        metadata = {
            'title': self._extract_title(text),
            'author': self._extract_author(text),
            'date': self._extract_date(text),
            'entities': self._extract_entities(text) if self.nlp else {}
        }
        return metadata
    
    def _extract_title(self, text: str) -> str:
        """Extract title from document"""
        lines = text.strip().split('\n')
        
        # Look for first non-empty line that might be a title
        for line in lines[:5]:  # Check first 5 lines
            line = line.strip()
            if line and len(line) > 5 and len(line) < 200:
                # Check if it looks like a title (not too long, has meaningful words)
                if not re.match(r'^\d+\.|\s*page\s+\d+', line.lower()):
                    return line
        
        return ""
    
    def _extract_author(self, text: str) -> str:
        """Extract author from document"""
        # Patterns to look for
        patterns = [
            r'author[:\s]+([^\n]+)',
            r'by[:\s]+([^\n]+)',
            r'written by[:\s]+([^\n]+)',
            r'([a-zA-Z]+\.[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+)',  # Email
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                author = match.group(1).strip()
                if len(author) > 2 and len(author) < 100:
                    return author
        
        return ""
    
    def _extract_date(self, text: str) -> Optional[datetime]:
        """Extract date from document"""
        date_patterns = [
            r'\b(\d{1,2}[/-]\d{1,2}[/-]\d{4})\b',  # MM/DD/YYYY or DD/MM/YYYY
            r'\b(\d{4}[/-]\d{1,2}[/-]\d{1,2})\b',  # YYYY/MM/DD
            r'\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})\b',  # Month DD, YYYY
        ]
        
        for pattern in date_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                try:
                    date_str = match.group(1)
                    # Try different parsing formats
                    for fmt in ['%m/%d/%Y', '%d/%m/%Y', '%Y/%m/%d', '%B %d, %Y', '%b %d, %Y']:
                        try:
                            return datetime.strptime(date_str, fmt).date()
                        except ValueError:
                            continue
                except Exception:
                    continue
        
        return None
    
    def _extract_entities(self, text: str) -> Dict[str, List[str]]:
        """Extract named entities using spaCy"""
        if not self.nlp:
            return {}
        
        try:
            doc = self.nlp(text[:5000])  # Limit text for performance
            entities = {
                'persons': [],
                'organizations': [],
                'money': [],
                'locations': [],
                'dates': []
            }
            
            for ent in doc.ents:
                if ent.label_ in ['PERSON']:
                    entities['persons'].append(ent.text)
                elif ent.label_ in ['ORG']:
                    entities['organizations'].append(ent.text)
                elif ent.label_ in ['MONEY']:
                    entities['money'].append(ent.text)
                elif ent.label_ in ['GPE', 'LOC']:
                    entities['locations'].append(ent.text)
                elif ent.label_ in ['DATE']:
                    entities['dates'].append(ent.text)
            
            # Remove duplicates
            for key in entities:
                entities[key] = list(set(entities[key]))
            
            return entities
            
        except Exception as e:
            print(f"Error in entity extraction: {e}")
            return {}
    
    def generate_summary(self, text: str, num_sentences: int = 3) -> str:
        """Generate extractive summary using TF-IDF"""
        if not HAS_SKLEARN:
            # Fallback: return first few sentences
            sentences = re.split(r'[.!?]+', text)[:num_sentences]
            return '. '.join(s.strip() for s in sentences if s.strip()) + '.'

        try:
            # Split into sentences
            sentences = re.split(r'[.!?]+', text)
            sentences = [s.strip() for s in sentences if len(s.strip()) > 20]

            if len(sentences) <= num_sentences:
                return ' '.join(sentences)

            # Use TF-IDF to find important sentences
            vectorizer = TfidfVectorizer(stop_words='english', max_features=100)
            tfidf_matrix = vectorizer.fit_transform(sentences)

            # Calculate sentence scores
            sentence_scores = np.array(tfidf_matrix.sum(axis=1)).flatten()

            # Get top sentences
            top_indices = sentence_scores.argsort()[-num_sentences:][::-1]
            top_indices = sorted(top_indices)  # Keep original order

            summary_sentences = [sentences[i] for i in top_indices]
            return '. '.join(summary_sentences) + '.'

        except Exception as e:
            print(f"Error generating summary: {e}")
            # Fallback: return first few sentences
            sentences = re.split(r'[.!?]+', text)[:num_sentences]
            return '. '.join(s.strip() for s in sentences if s.strip()) + '.'
    
    def generate_embeddings(self, text: str) -> List[float]:
        """Generate embeddings for semantic search"""
        if not self.sentence_model:
            return []

        try:
            # Use first 1000 characters for embedding
            sample_text = text[:1000]
            embeddings = self.sentence_model.encode(sample_text)
            return embeddings.tolist()
        except Exception as e:
            print(f"Error generating embeddings: {e}")
            return []

    def extract_keywords(self, text: str, num_keywords: int = 10) -> List[str]:
        """Extract keywords using TF-IDF"""
        if not HAS_SKLEARN:
            return self._extract_keywords_spacy(text, num_keywords)

        try:
            # Split into sentences
            sentences = re.split(r'[.!?]+', text)
            sentences = [s.strip() for s in sentences if len(s.strip()) > 10]

            if len(sentences) < 2:
                # Fallback: extract nouns using spaCy
                return self._extract_keywords_spacy(text, num_keywords)

            # Use TF-IDF
            vectorizer = TfidfVectorizer(stop_words='english', max_features=100, ngram_range=(1, 2))
            tfidf_matrix = vectorizer.fit_transform(sentences)

            # Get feature names and scores
            feature_names = vectorizer.get_feature_names_out()
            scores = np.array(tfidf_matrix.sum(axis=0)).flatten()

            # Get top keywords
            top_indices = scores.argsort()[-num_keywords:][::-1]
            keywords = [feature_names[i] for i in top_indices]

            return keywords

        except Exception as e:
            print(f"Error extracting keywords: {e}")
            return self._extract_keywords_spacy(text, num_keywords)

    def _extract_keywords_spacy(self, text: str, num_keywords: int = 10) -> List[str]:
        """Fallback keyword extraction using spaCy"""
        if not self.nlp:
            return []

        try:
            doc = self.nlp(text[:2000])
            nouns = [token.lemma_.lower() for token in doc if token.pos_ in ['NOUN', 'PROPN'] and len(token.lemma_) > 3]
            # Count frequency
            from collections import Counter
            counter = Counter(nouns)
            keywords = [word for word, _ in counter.most_common(num_keywords)]
            return keywords
        except Exception as e:
            print(f"Error in spaCy keyword extraction: {e}")
            return []

    def extract_topics(self, text: str, num_topics: int = 5) -> List[str]:
        """Extract topics by finding common noun phrases"""
        if not self.nlp:
            return []

        try:
            doc = self.nlp(text[:3000])
            # Extract noun chunks
            topics = []
            for chunk in doc.noun_chunks:
                if len(chunk.text.split()) > 1 and len(chunk.text) > 5:
                    topics.append(chunk.text.lower())

            # Get most common topics
            from collections import Counter
            counter = Counter(topics)
            common_topics = [topic for topic, _ in counter.most_common(num_topics)]
            return common_topics

        except Exception as e:
            print(f"Error extracting topics: {e}")
            return []

    def analyze_sentiment(self, text: str) -> str:
        """Analyze sentiment of the text"""
        if not self.sentiment_analyzer:
            return "neutral"

        try:
            # Use first 500 characters for sentiment
            sample_text = text[:500]
            result = self.sentiment_analyzer(sample_text)
            if result:
                label = result[0]['label']
                # Map to simple labels
                if label in ['LABEL_2', 'positive']:
                    return "positive"
                elif label in ['LABEL_0', 'negative']:
                    return "negative"
                else:
                    return "neutral"
            return "neutral"
        except Exception as e:
            print(f"Error in sentiment analysis: {e}")
            return "neutral"


# Global processor instance
processor = DocumentProcessor()


def process_document(document):
    """Process a document: extract text, classify, extract metadata, etc."""
    try:
        # Extract text content
        file_path = document.file.path
        content = processor.extract_text_from_file(file_path, document.file_type)
        document.content_text = content
        
        # Extract title if not provided
        if not document.title:
            title = processor.extract_metadata(content).get('title', '')
            if title:
                document.title = title
            else:
                document.title = os.path.splitext(document.original_filename)[0]
        
        # Classify document if category not provided
        if not document.category:
            category, confidence = processor.classify_document(content)
            document.category = category
            document.category_confidence = confidence
        
        # Extract metadata
        metadata = processor.extract_metadata(content)
        if metadata['author']:
            document.author = metadata['author']
        if metadata['date']:
            document.extracted_date = metadata['date']
        if metadata['entities']:
            document.entities = metadata['entities']
        
        # Generate summary
        if content:
            document.summary = processor.generate_summary(content)

        # Extract keywords
        if content:
            document.keywords = processor.extract_keywords(content)

        # Extract topics
        if content:
            document.topics = processor.extract_topics(content)

        # Analyze sentiment
        if content:
            document.sentiment = processor.analyze_sentiment(content)

        # Generate embeddings for search
        if content:
            document.embeddings = processor.generate_embeddings(content)

        document.save()
        
    except Exception as e:
        print(f"Error processing document {document.id}: {e}")
        raise