import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { NotionService } from './services/notionService.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const notionService = new NotionService();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'whisper-tree-notion-api' });
});

// Search Notion content
app.post('/api/search', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        error: 'Query parameter is required and must be a string',
      });
    }

    const results = await notionService.searchContent(query);

    res.json({
      success: true,
      query,
      results,
      count: results.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search Notion content',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get all FAQs
app.get('/api/faqs', async (req: Request, res: Response) => {
  try {
    const faqs = await notionService.getAllFAQs();

    res.json({
      success: true,
      faqs,
      count: faqs.length,
    });
  } catch (error) {
    console.error('FAQs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch FAQs',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get random template for inspiration
app.get('/api/template/random', async (req: Request, res: Response) => {
  try {
    const template = await notionService.getRandomTemplate();

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'No templates found',
      });
    }

    res.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error('Random template error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch random template',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Generate concept based on user input (enhanced with Notion content)
app.post('/api/concept/generate', async (req: Request, res: Response) => {
  try {
    const { userInput, messages } = req.body;

    if (!userInput || typeof userInput !== 'string') {
      return res.status(400).json({
        error: 'userInput parameter is required and must be a string',
      });
    }

    // Search Notion for relevant content
    const notionResults = await notionService.searchContent(userInput);

    // Build context from Notion results
    const context = notionResults
      .slice(0, 3) // Top 3 most relevant results
      .map(result => `[${result.type.toUpperCase()}] ${result.title}: ${result.content}`)
      .join('\n\n');

    // Generate concept using Notion content
    const concept = await generateConceptFromContext(userInput, notionResults);

    res.json({
      success: true,
      concept,
      sources: notionResults.slice(0, 3).map(r => ({
        type: r.type,
        title: r.title,
      })),
    });
  } catch (error) {
    console.error('Concept generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate concept',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Helper function to generate concept from Notion context
 * Uses ALL FAQs from Notion to find most relevant content
 */
async function generateConceptFromContext(
  userInput: string,
  notionResults: any[]
): Promise<string> {
  // Get all FAQs to search through
  const allFaqs = await notionService.getAllFAQs();

  // Search for relevant keywords in user input
  const keywords = userInput.toLowerCase().split(/\s+/).filter(word => word.length > 3);

  // Find most relevant FAQs based on keyword matching
  const scoredFaqs = allFaqs.map(faq => {
    const titleLower = faq.title.toLowerCase();
    const contentLower = faq.content.toLowerCase();

    let score = 0;
    keywords.forEach(keyword => {
      if (titleLower.includes(keyword)) score += 10;
      if (contentLower.includes(keyword)) score += 2;
    });

    return { ...faq, score };
  }).filter(faq => faq.score > 0)
    .sort((a, b) => b.score - a.score);

  // If no matches found, use first few FAQs for general inspiration
  const relevantFaqs = scoredFaqs.length > 0 ? scoredFaqs.slice(0, 2) : allFaqs.slice(0, 2);

  if (relevantFaqs.length === 0) {
    return `Based on your wish for "${userInput}", I envision a beautiful space that combines natural elegance with thoughtful design. This concept embraces the harmony between your dreams and the environment around you.`;
  }

  // Build concept using Notion content
  let concept = `Hello, I'm Paul Cameron.

Based on your wish for "${userInput}", here's what I envision for you.\n\n`;

  // Add relevant philosophy/approach from Notion
  const primaryFaq = relevantFaqs[0];

  // Extract meaningful content, ensuring complete sentences
  let snippet = primaryFaq.content.trim();

  // Find 2-4 complete paragraphs/sentences from the primary FAQ (aim for 300-600 chars)
  const sentences = snippet.match(/[^.!?]+[.!?]+(?:\s+|$)/g) || [];
  if (sentences.length > 0) {
    // Take first 2-4 sentences depending on length, ensuring they're substantive
    let selectedText = '';
    let sentenceCount = 0;
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      // Skip very short sentences (likely headers or list items)
      if (trimmedSentence.length < 30) continue;

      // Skip sentences that are likely section headers (no spaces after periods within)
      const wordsInSentence = trimmedSentence.split(/\s+/).length;
      if (wordsInSentence < 8) continue;

      if (selectedText.length + trimmedSentence.length < 600 && sentenceCount < 4) {
        selectedText += trimmedSentence + ' ';
        sentenceCount++;
      } else if (sentenceCount >= 2) {
        break; // We have at least 2 good sentences
      }
    }

    if (selectedText.trim().length > 100) {
      snippet = selectedText.trim();
    } else {
      // Fallback: use first 400 chars ending at last period
      if (snippet.length > 400) {
        const cutoff = snippet.substring(0, 400);
        const lastPeriod = cutoff.lastIndexOf('.');
        if (lastPeriod > 150) {
          snippet = snippet.substring(0, lastPeriod + 1);
        }
      }
    }
  } else {
    // Fallback to period-based cutoff if regex fails
    if (snippet.length > 400) {
      const cutoff = snippet.substring(0, 400);
      const lastPeriod = cutoff.lastIndexOf('.');
      if (lastPeriod > 150) {
        snippet = snippet.substring(0, lastPeriod + 1);
      }
    }
  }

  concept += `${snippet}\n\n`;

  concept += `This concept combines Treehouse Life's philosophy of elevated play and biophilic design with your unique vision. Let's explore how we can bring this dream to life in your space.`;

  return concept;
}

// Start server
const server = app.listen(port, () => {
  console.log(`🌲 Whisper Tree Notion API running on port ${port}`);
  console.log(`📝 Notion integration: ${process.env.NOTION_API_KEY ? 'Configured' : 'Not configured'}`);
  console.log(`🌍 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  notionService.stopAutoRefresh();
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  notionService.stopAutoRefresh();
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
