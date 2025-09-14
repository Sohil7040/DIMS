# Document AI Project Setup TODO

## Pending Tasks
- [x] Move UserProfile model from documents/models.py to auth_app/models.py
- [x] Update imports in views that reference UserProfile (no changes needed)
- [x] Create auth_app/models.py with UserProfile
- [ ] Run makemigrations for all apps (documents, search_app, auth_app)
- [ ] Run migrate
- [ ] Install spaCy English model: python -m spacy download en_core_web_sm
- [ ] Create superuser
- [ ] Create basic templates (dashboard.html, upload.html, list.html, search.html)
- [ ] Run server and test basic functionality
- [x] Test document upload and processing (classification confidence improved)
- [ ] Test search functionality
- [x] Update document classification model to use pretrained zero-shot classifier for better confidence

## Completed Tasks
- [x] Install Python dependencies from requirements.txt
- [x] Verify project structure and existing code
