import os
import sys
import django
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile

# Add the project directory to the Python path
sys.path.insert(0, os.path.dirname(__file__))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'document_ai.settings')
django.setup()

from documents.models import Document
from documents.utils import DocumentProcessor, HAS_SKLEARN, HAS_SPACY, HAS_TRANSFORMERS


class AIFeaturesTestCase(TestCase):
    def setUp(self):
        """Set up test data"""
        self.sample_text = """
        This is a sample document about artificial intelligence and machine learning.
        AI is transforming the way we work and live. Machine learning algorithms can
        analyze large amounts of data to make predictions. Natural language processing
        helps computers understand human language. Deep learning models are becoming
        increasingly sophisticated. The future of technology looks bright with these
        advancements in AI and ML.
        """

        # Create a test document
        self.test_file = SimpleUploadedFile(
            "test.txt",
            self.sample_text.encode('utf-8'),
            content_type="text/plain"
        )

    def test_document_creation_with_ai_fields(self):
        """Test that documents can be created with new AI fields"""
        doc = Document.objects.create(
            title="Test AI Document",
            filename="test.txt",
            original_filename="test.txt",
            file=self.test_file,
            uploaded_by_id=1,  # Assuming admin user exists
            content_text=self.sample_text
        )

        # Check that new fields exist and are initialized
        self.assertEqual(doc.keywords, [])
        self.assertEqual(doc.topics, [])
        self.assertEqual(doc.sentiment, "")

        doc.delete()

    def test_keyword_extraction(self):
        """Test keyword extraction functionality"""
        processor = DocumentProcessor()

        keywords = processor.extract_keywords(self.sample_text)

        # Check that keywords are extracted
        self.assertIsInstance(keywords, list)
        if HAS_SKLEARN or HAS_SPACY:
            self.assertGreater(len(keywords), 0)
            # Check that keywords are strings
            for keyword in keywords:
                self.assertIsInstance(keyword, str)

    def test_topic_extraction(self):
        """Test topic extraction functionality"""
        processor = DocumentProcessor()

        topics = processor.extract_topics(self.sample_text)

        # Check that topics are extracted
        self.assertIsInstance(topics, list)
        if HAS_SPACY:
            # Should extract some topics if spaCy is available
            self.assertGreater(len(topics), 0)
            for topic in topics:
                self.assertIsInstance(topic, str)

    def test_sentiment_analysis(self):
        """Test sentiment analysis functionality"""
        processor = DocumentProcessor()

        sentiment = processor.analyze_sentiment(self.sample_text)

        # Check that sentiment is a string
        self.assertIsInstance(sentiment, str)
        # Should be one of the expected values
        self.assertIn(sentiment.lower(), ['positive', 'negative', 'neutral'])

    def test_ai_processing_pipeline(self):
        """Test the complete AI processing pipeline"""
        processor = DocumentProcessor()

        # Test individual components
        summary = processor.generate_summary(self.sample_text)
        keywords = processor.extract_keywords(self.sample_text)
        topics = processor.extract_topics(self.sample_text)
        sentiment = processor.analyze_sentiment(self.sample_text)

        # Verify outputs
        self.assertIsInstance(summary, str)
        self.assertIsInstance(keywords, list)
        self.assertIsInstance(topics, list)
        self.assertIsInstance(sentiment, str)

        # Summary should not be empty
        self.assertGreater(len(summary), 0)

    def test_fallback_functionality(self):
        """Test that fallback methods work when dependencies are missing"""
        processor = DocumentProcessor()

        # Test with short text that might trigger fallbacks
        short_text = "This is a short document."

        keywords = processor.extract_keywords(short_text)
        topics = processor.extract_topics(short_text)
        sentiment = processor.analyze_sentiment(short_text)

        # Should still return valid results
        self.assertIsInstance(keywords, list)
        self.assertIsInstance(topics, list)
        self.assertIsInstance(sentiment, str)


if __name__ == '__main__':
    # Run the tests
    import unittest
    unittest.main()
