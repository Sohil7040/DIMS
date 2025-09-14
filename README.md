# AI-Powered Document Classification and Intelligent Indexing

A Django web application that provides intelligent document management with AI-powered classification, metadata extraction, and semantic search capabilities.

## Features

### Core Functionality
- **Document Upload & Storage**: Support for PDF, DOCX, and TXT files with local storage
- **AI-Powered Classification**: Automatic categorization into Finance, HR, Legal, Contracts, Technical Reports, and Invoices
- **Metadata Extraction**: Automatic extraction of title, author, date, and named entities
- **Intelligent Summarization**: Extractive summarization using TF-IDF
- **Semantic Search**: Advanced search using sentence embeddings and cosine similarity
- **Role-Based Access Control**: Department-based document access permissions
- **Activity Logging**: Complete audit trail of user actions

### User Interface
- **Responsive Dashboard**: Clean, modern interface with document statistics
- **Drag & Drop Upload**: Intuitive file upload with progress tracking
- **Advanced Search**: Both keyword and semantic search capabilities
- **Document Viewer**: Rich document preview with metadata and entities
- **User Management**: Profile management with role assignments

## Technology Stack

- **Backend**: Django 4.2, SQLite
- **AI/ML**: Hugging Face Transformers, SentenceTransformers, spaCy, scikit-learn
- **Frontend**: Django Templates, Bootstrap 5, JavaScript
- **File Processing**: PyPDF2, python-docx
- **Search**: FAISS for vector similarity search

## Installation & Setup

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### 1. Clone and Setup Environment

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy English model
python -m spacy download en_core_web_sm
```

### 2. Database Setup

```bash
# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create seed data (users and sample content)
python seed_data.py
```

### 3. Run the Application

```bash
# Start development server
python manage.py runserver
```

Visit `http://localhost:8000` to access the application.

## User Accounts

The seed data creates these test accounts:

| Username | Password | Role | Access |
|----------|----------|------|--------|
| admin | admin123 | Admin | All documents |
| john_finance | finance123 | Finance | Finance & Invoices |
| sarah_hr | hr123 | HR | HR documents only |
| mike_legal | legal123 | Legal | Legal & Contracts |
| emma_tech | tech123 | Technical | Technical Reports |

## Project Structure

```
document_ai/
├── document_ai/          # Main project settings
├── documents/            # Document management app
│   ├── models.py        # Document, AccessLog, UserProfile models
│   ├── views.py         # Upload, view, list document views
│   ├── utils.py         # AI processing utilities
│   └── forms.py         # Upload and search forms
├── search_app/           # Search functionality
│   ├── views.py         # Search views (keyword & semantic)
│   └── utils.py         # Semantic search engine
├── auth_app/            # Authentication app
├── templates/           # HTML templates
│   ├── base.html        # Base template
│   ├── documents/       # Document templates
│   ├── search/          # Search templates
│   └── auth/            # Authentication templates
├── media/               # Uploaded documents storage
└── requirements.txt     # Python dependencies
```

## AI Processing Pipeline

When a document is uploaded, the system:

1. **Text Extraction**: Extracts text from PDF, DOCX, or TXT files
2. **Classification**: Uses rule-based classification (expandable to ML models)
3. **Metadata Extraction**: 
   - Title from first meaningful line
   - Author from patterns like "Author:", "By:", or email addresses
   - Date using regex patterns
4. **Entity Recognition**: Extracts persons, organizations, money, locations using spaCy
5. **Summarization**: Creates extractive summary using TF-IDF sentence scoring
6. **Embeddings**: Generates sentence embeddings for semantic search

## Key Features Detail

### Role-Based Access Control
- Users are assigned roles (admin, finance, hr, legal, technical)
- Each role has access to specific document categories
- Public documents are accessible to all users
- Complete activity logging for security auditing

### Semantic Search
- Uses SentenceTransformers for embedding generation
- Cosine similarity for document ranking
- Fallback to keyword search if embeddings unavailable
- Real-time search with AJAX interface

### Document Classification
- Rule-based classification using keyword matching
- Easily extensible to use ML models (Hugging Face integration ready)
- Confidence scoring for classifications
- Manual override capability

## API Endpoints

- `/documents/` - Dashboard and document management
- `/search/` - Keyword search
- `/search/semantic/` - Semantic search API
- `/auth/` - User authentication
- `/admin/` - Django admin interface

## Development Notes

### Extending Classification
To add ML-based classification, modify `documents/utils.py`:

```python
def classify_document(self, text: str) -> Tuple[str, float]:
    if not self.classifier:
        return self._rule_based_classification(text)
    
    # Use Hugging Face classifier
    results = self.classifier(text[:512])
    # Process results and map to categories
```

### Adding New Document Types
1. Update file validation in `documents/forms.py`
2. Add extraction method in `documents/utils.py`
3. Update `ALLOWED_EXTENSIONS` in settings

### Customizing Categories
Modify `DOCUMENT_CATEGORIES` and `USER_ROLES` in `settings.py`:

```python
DOCUMENT_CATEGORIES = [
    ('your_category', 'Your Category'),
    # ... existing categories
]

USER_ROLES = {
    'your_role': ['your_category', 'other_category'],
    # ... existing roles
}
```

## Production Deployment

### Security Settings
- Change `SECRET_KEY` in settings.py
- Set `DEBUG = False`
- Configure `ALLOWED_HOSTS`
- Use PostgreSQL instead of SQLite
- Set up proper file storage (AWS S3, etc.)

### Performance Optimization
- Use Redis for caching
- Implement async processing for document analysis
- Add database indexing for search fields
- Use CDN for static files

### Monitoring
- Add logging configuration
- Implement health checks
- Monitor AI model performance
- Track storage usage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License.