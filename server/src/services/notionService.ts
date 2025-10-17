import { Client } from '@notionhq/client';

export interface NotionSearchResult {
  type: 'faq' | 'template' | 'knowledge';
  title: string;
  content: string;
  relevance?: number;
}

export class NotionService {
  private client: Client;
  private faqDatabaseId: string;
  private templatesDatabaseId: string;
  private knowledgeDatabaseId: string;

  // Cache for FAQs - refreshed automatically in background
  private faqCache: NotionSearchResult[] | null = null;
  private faqCacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly REFRESH_INTERVAL = 4 * 60 * 1000; // Refresh every 4 minutes (before expiry)
  private refreshTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.client = new Client({
      auth: process.env.NOTION_API_KEY,
    });

    this.faqDatabaseId = process.env.NOTION_DATABASE_FAQ_ID || '';
    this.templatesDatabaseId = process.env.NOTION_DATABASE_TEMPLATES_ID || '';
    this.knowledgeDatabaseId = process.env.NOTION_DATABASE_KNOWLEDGE_ID || '';

    // Pre-load FAQs on startup and start auto-refresh
    this.warmUpCache();
  }

  /**
   * Pre-load cache on startup and start automatic refresh
   */
  private async warmUpCache() {
    console.log('🔥 Warming up Notion cache...');
    await this.refreshCache();
    console.log('✅ Cache warmed up with', this.faqCache?.length || 0, 'FAQs');

    // Start automatic background refresh
    this.startAutoRefresh();
  }

  /**
   * Start automatic cache refresh in background
   */
  private startAutoRefresh() {
    // Clear any existing timer
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    // Set up recurring refresh
    this.refreshTimer = setInterval(async () => {
      console.log('🔄 Auto-refreshing Notion cache...');
      await this.refreshCache();
      console.log('✅ Cache refreshed with', this.faqCache?.length || 0, 'FAQs');
    }, this.REFRESH_INTERVAL);

    console.log(`⏰ Auto-refresh enabled (every ${this.REFRESH_INTERVAL / 1000 / 60} minutes)`);
  }

  /**
   * Refresh cache (used by both warmup and auto-refresh)
   */
  private async refreshCache() {
    try {
      await this.fetchAllFAQs();
    } catch (error) {
      console.error('Error refreshing cache:', error);
      // Keep using existing cache if refresh fails
    }
  }

  /**
   * Stop auto-refresh (for graceful shutdown)
   */
  public stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
      console.log('⏹️  Auto-refresh stopped');
    }
  }

  /**
   * Search across all Notion databases for relevant content
   */
  async searchContent(query: string): Promise<NotionSearchResult[]> {
    const results: NotionSearchResult[] = [];

    try {
      // Search in parallel across all databases
      const [faqResults, templateResults, knowledgeResults] = await Promise.all([
        this.searchDatabase(this.faqDatabaseId, query, 'faq'),
        this.searchDatabase(this.templatesDatabaseId, query, 'template'),
        this.searchDatabase(this.knowledgeDatabaseId, query, 'knowledge'),
      ]);

      results.push(...faqResults, ...templateResults, ...knowledgeResults);

      // Sort by relevance if available
      return results.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
    } catch (error) {
      console.error('Error searching Notion content:', error);
      throw error;
    }
  }

  /**
   * Search a specific database
   */
  private async searchDatabase(
    databaseId: string,
    query: string,
    type: 'faq' | 'template' | 'knowledge'
  ): Promise<NotionSearchResult[]> {
    if (!databaseId) {
      console.warn(`Database ID not configured for type: ${type}`);
      return [];
    }

    try {
      const response = await this.client.databases.query({
        database_id: databaseId,
        filter: {
          or: [
            {
              property: 'Name',
              title: {
                contains: query,
              },
            },
            // Add more filter conditions as needed based on your Notion schema
          ],
        },
        page_size: 10,
      });

      const results: NotionSearchResult[] = [];

      for (const page of response.results) {
        if ('properties' in page) {
          const title = this.extractTitle(page.properties);
          const content = await this.extractPageContent(page.id);

          results.push({
            type,
            title,
            content,
            relevance: this.calculateRelevance(query, title, content),
          });
        }
      }

      return results;
    } catch (error) {
      console.error(`Error searching ${type} database:`, error);
      return [];
    }
  }

  /**
   * Extract title from page properties
   */
  private extractTitle(properties: any): string {
    // Try common title property names
    const titleProps = ['Name', 'Title', 'Question'];

    for (const prop of titleProps) {
      if (properties[prop]?.title?.[0]?.plain_text) {
        return properties[prop].title[0].plain_text;
      }
    }

    return 'Untitled';
  }

  /**
   * Extract content from a Notion page
   */
  private async extractPageContent(pageId: string): Promise<string> {
    try {
      const blocks = await this.client.blocks.children.list({
        block_id: pageId,
        page_size: 100,
      });

      let content = '';

      for (const block of blocks.results) {
        if ('type' in block) {
          content += this.extractBlockText(block) + '\n';
        }
      }

      return content.trim();
    } catch (error) {
      console.error('Error extracting page content:', error);
      return '';
    }
  }

  /**
   * Extract text from a block
   */
  private extractBlockText(block: any): string {
    const type = block.type;

    if (!block[type]) return '';

    const richText = block[type].rich_text || block[type].text;

    if (Array.isArray(richText)) {
      return richText.map((text: any) => text.plain_text || '').join('');
    }

    return '';
  }

  /**
   * Calculate relevance score for search results
   */
  private calculateRelevance(query: string, title: string, content: string): number {
    const queryLower = query.toLowerCase();
    const titleLower = title.toLowerCase();
    const contentLower = content.toLowerCase();

    let score = 0;

    // Exact title match
    if (titleLower === queryLower) score += 100;
    // Title contains query
    else if (titleLower.includes(queryLower)) score += 50;

    // Count query word occurrences in content
    const queryWords = queryLower.split(/\s+/);
    queryWords.forEach(word => {
      const titleMatches = (titleLower.match(new RegExp(word, 'g')) || []).length;
      const contentMatches = (contentLower.match(new RegExp(word, 'g')) || []).length;
      score += titleMatches * 10 + contentMatches * 2;
    });

    return score;
  }

  /**
   * Get a random template suggestion (for inspiration)
   */
  async getRandomTemplate(): Promise<NotionSearchResult | null> {
    if (!this.templatesDatabaseId) return null;

    try {
      const response = await this.client.databases.query({
        database_id: this.templatesDatabaseId,
        page_size: 1,
      });

      if (response.results.length === 0) return null;

      const page = response.results[0];
      if ('properties' in page) {
        const title = this.extractTitle(page.properties);
        const content = await this.extractPageContent(page.id);

        return {
          type: 'template',
          title,
          content,
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting random template:', error);
      return null;
    }
  }

  /**
   * Get all FAQs (returns cached data for performance)
   */
  async getAllFAQs(): Promise<NotionSearchResult[]> {
    // Always return cached data (refreshed automatically in background)
    if (this.faqCache) {
      return this.faqCache;
    }

    // If cache not yet loaded, fetch now
    await this.fetchAllFAQs();
    return this.faqCache || [];
  }

  /**
   * Fetch all FAQs from Notion (updates cache)
   */
  private async fetchAllFAQs(): Promise<void> {
    if (!this.faqDatabaseId) {
      this.faqCache = [];
      return;
    }

    try {
      const response = await this.client.databases.query({
        database_id: this.faqDatabaseId,
      });

      const results: NotionSearchResult[] = [];

      for (const page of response.results) {
        if ('properties' in page) {
          const title = this.extractTitle(page.properties);
          const content = await this.extractPageContent(page.id);

          results.push({
            type: 'faq',
            title,
            content,
          });
        }
      }

      // Update cache
      this.faqCache = results;
      this.faqCacheExpiry = Date.now() + this.CACHE_DURATION;
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      // Keep existing cache if available
      if (!this.faqCache) {
        this.faqCache = [];
      }
    }
  }
}
