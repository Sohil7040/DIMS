import { Document, DocumentCategory, DocumentMetadata, ExtractedEntity, AccessLevel } from '../types';

class DocumentProcessor {
  async processDocument(file: File, uploader: string): Promise<Document> {
    const content = await this.extractText(file);
    const category = this.classifyDocument(content, file.name);
    const metadata = this.extractMetadata(content);
    const summary = this.generateSummary(content);
    const tags = this.extractTags(content);
    const accessLevel = this.determineAccessLevel(category);

    return {
      id: this.generateId(),
      filename: file.name,
      originalName: file.name,
      category,
      uploadDate: new Date().toISOString(),
      uploader,
      metadata,
      summary,
      content,
      fileSize: file.size,
      fileType: file.type || this.getFileTypeFromName(file.name),
      tags,
      accessLevel
    };
  }

  private async extractText(file: File): Promise<string> {
    if (file.type === 'text/plain') {
      return await file.text();
    }
    
    // Simulate text extraction for other file types
    const filename = file.name.toLowerCase();
    if (filename.includes('contract')) {
      return this.generateContractContent();
    } else if (filename.includes('invoice') || filename.includes('financial')) {
      return this.generateFinancialContent();
    } else if (filename.includes('hr') || filename.includes('employee')) {
      return this.generateHRContent();
    } else if (filename.includes('technical') || filename.includes('report')) {
      return this.generateTechnicalContent();
    }
    
    return this.generateGenericContent();
  }

  private classifyDocument(content: string, filename: string): DocumentCategory {
    const lowerContent = content.toLowerCase();
    const lowerFilename = filename.toLowerCase();

    const patterns = {
      'Finance': ['invoice', 'payment', 'budget', 'financial', 'cost', 'revenue', 'accounting', 'tax'],
      'HR': ['employee', 'hiring', 'recruitment', 'performance', 'salary', 'benefits', 'policy', 'training'],
      'Legal': ['contract', 'agreement', 'legal', 'terms', 'conditions', 'compliance', 'regulation'],
      'Contracts': ['agreement', 'contract', 'vendor', 'supplier', 'partnership', 'license'],
      'Technical Reports': ['technical', 'analysis', 'research', 'development', 'engineering', 'specification'],
      'Marketing': ['campaign', 'marketing', 'brand', 'customer', 'promotion', 'advertising']
    };

    for (const [category, keywords] of Object.entries(patterns)) {
      const score = keywords.reduce((acc, keyword) => {
        const contentMatches = (lowerContent.match(new RegExp(keyword, 'g')) || []).length;
        const filenameMatches = (lowerFilename.match(new RegExp(keyword, 'g')) || []).length * 2;
        return acc + contentMatches + filenameMatches;
      }, 0);

      if (score >= 3) {
        return category as DocumentCategory;
      }
    }

    return 'Uncategorized';
  }

  private extractMetadata(content: string): DocumentMetadata {
    const lines = content.split('\n').filter(line => line.trim());
    
    // Extract title (first significant line)
    const title = lines.find(line => line.length > 5 && !line.match(/^\d+$/)) || 'Untitled Document';
    
    // Extract author
    const authorPatterns = [
      /(?:Author|By|Created by):\s*(.+)/i,
      /(.+@.+\..+)/,
      /(?:Prepared by|Written by):\s*(.+)/i
    ];
    
    let author = 'Unknown';
    for (const pattern of authorPatterns) {
      const match = content.match(pattern);
      if (match) {
        author = match[1].trim();
        break;
      }
    }

    // Extract date
    const datePattern = /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})\b/;
    const dateMatch = content.match(datePattern);
    const extractedDate = dateMatch ? dateMatch[1] : undefined;

    // Extract entities
    const entities = this.extractEntities(content);

    return {
      title: title.substring(0, 100),
      author,
      extractedDate,
      entities,
      confidence: 0.85
    };
  }

  private extractEntities(content: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];

    // Extract money amounts
    const moneyPattern = /\$[\d,]+(?:\.\d{2})?/g;
    const moneyMatches = content.match(moneyPattern) || [];
    moneyMatches.forEach(match => {
      entities.push({
        text: match,
        type: 'MONEY',
        confidence: 0.9
      });
    });

    // Extract dates
    const datePattern = /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g;
    const dateMatches = content.match(datePattern) || [];
    dateMatches.forEach(match => {
      entities.push({
        text: match,
        type: 'DATE',
        confidence: 0.8
      });
    });

    // Extract email addresses as person indicators
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emailMatches = content.match(emailPattern) || [];
    emailMatches.forEach(match => {
      entities.push({
        text: match,
        type: 'PERSON',
        confidence: 0.7
      });
    });

    return entities.slice(0, 10); // Limit to top 10 entities
  }

  private generateSummary(content: string): string {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    if (sentences.length === 0) return 'No summary available.';
    
    // Simple extractive summarization
    const wordFreq: Record<string, number> = {};
    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    
    words.forEach(word => {
      if (word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    const sentenceScores = sentences.map(sentence => {
      const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
      const score = sentenceWords.reduce((acc, word) => acc + (wordFreq[word] || 0), 0);
      return { sentence: sentence.trim(), score };
    });

    return sentenceScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.sentence)
      .join('. ') + '.';
  }

  private extractTags(content: string): string[] {
    const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCount: Record<string, number> = {};

    words.forEach(word => {
      if (word.length > 4 && !commonWords.has(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  private determineAccessLevel(category: DocumentCategory): AccessLevel[] {
    const accessMap: Record<DocumentCategory, AccessLevel[]> = {
      'Finance': ['Finance', 'Admin'],
      'HR': ['HR', 'Admin'],
      'Legal': ['Legal', 'Admin'],
      'Contracts': ['Legal', 'Admin'],
      'Technical Reports': ['All'],
      'Marketing': ['All'],
      'Operations': ['All'],
      'Uncategorized': ['All']
    };

    return accessMap[category] || ['All'];
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private getFileTypeFromName(filename: string): string {
    const ext = filename.toLowerCase().split('.').pop();
    const typeMap: Record<string, string> = {
      'pdf': 'application/pdf',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'txt': 'text/plain',
      'doc': 'application/msword'
    };
    return typeMap[ext || ''] || 'application/octet-stream';
  }

  // Mock content generators for demonstration
  private generateContractContent(): string {
    return `Service Agreement Contract
    
    This Service Agreement ("Agreement") is entered into on January 15, 2024, between TechCorp Inc. and Global Solutions Ltd.
    
    Terms and Conditions:
    1. Service Provider agrees to provide software development services
    2. Total contract value: $50,000
    3. Project duration: 6 months
    4. Payment terms: Net 30 days
    
    Both parties agree to the terms outlined herein and shall comply with all applicable regulations.
    
    Authorized by: John Smith, CEO
    Contact: john.smith@techcorp.com`;
  }

  private generateFinancialContent(): string {
    return `Financial Report Q4 2024
    
    Executive Summary:
    Total Revenue: $2,500,000
    Operating Expenses: $1,800,000
    Net Profit: $700,000
    
    Key Performance Indicators:
    - Revenue growth: 15% YoY
    - Cost reduction: 8% from previous quarter
    - Profit margin: 28%
    
    Budget allocation for next quarter includes investments in technology infrastructure and human resources.
    
    Prepared by: Sarah Johnson, CFO
    Contact: sarah.johnson@company.com`;
  }

  private generateHRContent(): string {
    return `Employee Performance Review
    
    Employee: Michael Chen
    Position: Senior Software Engineer
    Review Period: January 2024 - December 2024
    
    Performance Summary:
    - Successfully led 3 major projects
    - Exceeded productivity targets by 20%
    - Strong collaboration and mentoring skills
    - Recommended for promotion
    
    Goals for next period:
    1. Lead the new AI initiative
    2. Mentor junior developers
    3. Complete leadership training program
    
    Reviewed by: Emily Rodriguez, HR Manager
    Contact: emily.rodriguez@company.com`;
  }

  private generateTechnicalContent(): string {
    return `Technical Analysis Report - AI Implementation
    
    Project Overview:
    Implementation of machine learning algorithms for document classification and natural language processing.
    
    Technical Specifications:
    - Framework: Python with TensorFlow
    - Model Architecture: Transformer-based neural networks
    - Training Dataset: 50,000+ labeled documents
    - Accuracy Rate: 94.5%
    
    Performance Metrics:
    - Processing Speed: 100 documents/minute
    - Memory Usage: 2GB RAM
    - Response Time: <2 seconds
    
    Recommendations:
    1. Scale infrastructure for higher throughput
    2. Implement continuous learning pipeline
    3. Add multi-language support
    
    Author: Technical Team Lead
    Contact: tech@company.com`;
  }

  private generateGenericContent(): string {
    return `Business Document
    
    This document contains important business information and guidelines for operational procedures.
    
    Key Points:
    - Standard operating procedures must be followed
    - Quality assurance is paramount
    - Customer satisfaction remains our top priority
    - Compliance with industry regulations is mandatory
    
    For additional information, please contact the relevant department manager.
    
    Date: ${new Date().toLocaleDateString()}
    Document ID: ${this.generateId()}`;
  }
}

export const documentProcessor = new DocumentProcessor();