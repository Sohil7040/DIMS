# TODO - Improve AI Overview Section

## Completed Tasks:
- [x] Created comprehensive README.md for the DIMS project covering both Document AI system and Venue Booking system

## Remaining Steps:
1. Review and finalize the new fields in documents/models.py for keywords, topics, and sentiment.
2. Verify and enhance the AI extraction methods in documents/utils.py:
   - extract_keywords()
   - extract_topics()
   - analyze_sentiment()
   - Ensure conditional imports and graceful handling of missing dependencies.
3. Update templates/documents/view.html:
   - Enhance AI Insights section to display keywords, topics, and sentiment distinctly from content preview.
4. Update requirements.txt to include missing dependencies:
   - scikit-learn
   - sentence-transformers
   - spacy
   - transformers
5. Add or update tests in test_ai_features.py or other relevant test files to verify:
   - AI insights extraction correctness.
   - Proper display of AI insights in the document view.
6. Test the entire flow:
   - Upload document.
   - AI processing for keywords, topics, sentiment.
   - Display in document detail view.
7. Provide instructions for installing dependencies and handling missing packages gracefully.

## Notes:
- Handle missing dependencies gracefully with flags HAS_SKLEARN, HAS_SENTENCE_TRANSFORMERS, etc.
- Ensure AI insights provide distinct and valuable information compared to content preview.
