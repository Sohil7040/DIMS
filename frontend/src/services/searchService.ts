import { Document, SearchResult, DocumentCategory } from '../types';

class SearchService {
  private stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did'
  ]);

  async search(documents: Document[], query: string, category?: DocumentCategory): Promise<SearchResult[]> {
    if (!query.trim()) return [];

    let filteredDocs = documents;
    if (category) {
      filteredDocs = documents.filter(doc => doc.category === category);
    }

    const queryTerms = this.preprocessText(query);
    const results: SearchResult[] = [];

    for (const document of filteredDocs) {
      const relevanceScore = this.calculateRelevance(document, queryTerms);
      if (relevanceScore > 0) {
        const matchedContent = this.extractMatchedContent(document, queryTerms);
        const highlightedSummary = this.highlightText(document.summary, queryTerms);
        
        results.push({
          document,
          relevanceScore,
          matchedContent,
          highlightedSummary
        });
      }
    }

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private preprocessText(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !this.stopWords.has(word));
  }

  private calculateRelevance(document: Document, queryTerms: string[]): number {
    let score = 0;
    const documentText = `
      ${document.metadata.title} 
      ${document.content} 
      ${document.summary} 
      ${document.tags.join(' ')}
      ${document.metadata.entities.map(e => e.text).join(' ')}
    `.toLowerCase();

    queryTerms.forEach(term => {
      const regex = new RegExp(term, 'gi');
      const matches = documentText.match(regex);
      if (matches) {
        // Weight different sections differently
        const titleMatches = document.metadata.title.toLowerCase().match(regex)?.length || 0;
        const summaryMatches = document.summary.toLowerCase().match(regex)?.length || 0;
        const contentMatches = document.content.toLowerCase().match(regex)?.length || 0;
        const tagMatches = document.tags.join(' ').toLowerCase().match(regex)?.length || 0;

        score += (titleMatches * 3) + (summaryMatches * 2) + (contentMatches * 1) + (tagMatches * 2);
      }
    });

    // Boost score for exact phrase matches
    const queryPhrase = queryTerms.join(' ');
    if (documentText.includes(queryPhrase)) {
      score += 5;
    }

    // Normalize score
    return Math.min(score / queryTerms.length, 100);
  }

  private extractMatchedContent(document: Document, queryTerms: string[]): string[] {
    const sentences = document.content.split(/[.!?]+/);
    const matched: string[] = [];

    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase();
      const matchCount = queryTerms.reduce((count, term) => {
        return count + (lowerSentence.includes(term) ? 1 : 0);
      }, 0);

      if (matchCount > 0) {
        matched.push(sentence.trim());
      }
    });

    return matched.slice(0, 3); // Return top 3 matching sentences
  }

  private highlightText(text: string, queryTerms: string[]): string {
    let highlighted = text;
    queryTerms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark>$1</mark>');
    });
    return highlighted;
  }
}

export const searchService = new SearchService();