# Notion Integration Guide

This guide explains how to set up the Notion API integration for the Whisper Tree chat interface.

## Overview

The backend server connects to your Notion workspace to provide intelligent, context-aware responses in the chat interface. It can search across three types of databases:

1. **FAQs** - Frequently asked questions and answers
2. **Design Templates** - Pre-designed concepts and ideas
3. **Knowledge Base** - General information about materials, techniques, pricing, etc.

## Setup Steps

### 1. Create a Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Name it something like "Whisper Tree Chat"
4. Select the workspace you want to connect
5. Set capabilities:
   - ✅ Read content
   - ✅ Read comments (optional)
   - ✅ No user information needed
6. Click **"Submit"** to create the integration
7. Copy the **Internal Integration Token** (starts with `secret_`)

### 2. Create Notion Databases

You need to create three databases in your Notion workspace:

#### FAQ Database
- **Property: Name** (Title) - The question
- **Property: Answer** (Text) - The answer content
- Add your FAQs as pages in this database

#### Templates Database
- **Property: Name** (Title) - Template name
- **Property: Description** (Text) - Template description
- Add design templates/concepts as pages

#### Knowledge Base Database
- **Property: Name** (Title) - Topic/article title
- **Property: Content** (Text) - The knowledge content
- Add knowledge articles as pages

### 3. Share Databases with Integration

For each database you created:

1. Open the database in Notion
2. Click the **"..."** menu (top right)
3. Click **"Connect to"**
4. Select your integration ("Whisper Tree Chat")
5. The database is now accessible to your integration

### 4. Get Database IDs

For each database, you need to get its ID:

1. Open the database in Notion
2. Look at the URL in your browser
3. The database ID is the 32-character code after your workspace name

Example URL:
```
https://www.notion.so/myworkspace/12345678901234567890123456789012?v=...
                                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                 This is your database ID
```

### 5. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cd server
   cp .env.example .env
   ```

2. Edit `server/.env` and add your credentials:
   ```env
   # Notion API Configuration
   NOTION_API_KEY=secret_your_integration_token_here
   NOTION_DATABASE_FAQ_ID=your_faq_database_id_here
   NOTION_DATABASE_TEMPLATES_ID=your_templates_database_id_here
   NOTION_DATABASE_KNOWLEDGE_ID=your_knowledge_database_id_here

   # Server Configuration
   PORT=3001
   NODE_ENV=development

   # CORS Configuration (your frontend URL)
   FRONTEND_URL=http://localhost:8080
   ```

### 6. Start the Backend Server

```bash
cd server
npm run dev
```

The server will start on port 3001 and connect to your Notion workspace.

### 7. Start the Frontend

In a separate terminal:

```bash
npm run dev
```

The frontend will run on port 8080 and connect to the backend automatically.

## Testing the Integration

1. Open your browser to `http://localhost:8080`
2. Navigate through to the chat interface
3. Type a message related to content in your Notion databases
4. The system will search Notion and generate a response using that content

## API Endpoints

The backend server provides these endpoints:

- `GET /health` - Health check
- `POST /api/search` - Search all databases
  ```json
  { "query": "search term" }
  ```
- `GET /api/faqs` - Get all FAQs
- `GET /api/template/random` - Get a random template
- `POST /api/concept/generate` - Generate concept from user input
  ```json
  {
    "userInput": "I want a treehouse office",
    "messages": []
  }
  ```

## Troubleshooting

### "Notion integration not configured"
- Make sure you've set `NOTION_API_KEY` in your `.env` file
- Restart the server after adding environment variables

### "Failed to search database"
- Verify database IDs are correct (32 characters, no spaces)
- Make sure you've shared each database with your integration
- Check that your integration has Read Content permission

### "CORS error"
- Ensure `FRONTEND_URL` in `.env` matches your frontend URL
- If using a different port, update the URL accordingly

### "Backend not responding"
- Check that the backend server is running on port 3001
- Look for errors in the server terminal
- Verify the frontend is calling `http://localhost:3001/api/...`

## Database Schema Tips

### FAQ Database
Structure your FAQs like:
- **Question**: "How much does a treehouse cost?"
- **Answer**: "Treehouse costs vary from $10k to $100k+ depending on size, materials, and complexity..."

### Templates Database
Add rich content pages with:
- Images and inspiration
- Material lists
- Design descriptions
- Example dimensions

### Knowledge Base
Organize information by topic:
- Materials and sourcing
- Building techniques
- Legal requirements
- Sustainability practices

## Advanced Features

### Custom Search Logic

The `notionService.ts` file includes:
- Relevance scoring based on keyword matching
- Multi-database parallel search
- Content extraction from Notion blocks

You can customize the search behavior by modifying:
- `calculateRelevance()` - Adjust scoring algorithm
- `searchDatabase()` - Modify filter conditions
- `extractPageContent()` - Change what content is extracted

### Integrating with LLMs

The current implementation provides a basic concept generator. To enhance it:

1. Install an LLM SDK (OpenAI, Anthropic, etc.):
   ```bash
   npm install openai
   ```

2. Update `generateConceptFromContext()` in `server/src/index.ts`:
   ```typescript
   import OpenAI from 'openai';

   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

   async function generateConceptFromContext(
     userInput: string,
     notionResults: any[]
   ): Promise<string> {
     const context = notionResults
       .map(r => `${r.title}: ${r.content}`)
       .join('\n\n');

     const completion = await openai.chat.completions.create({
       model: "gpt-4",
       messages: [
         {
           role: "system",
           content: "You are Paul Cameron, a treehouse and garden designer. Use the following knowledge base to inform your responses:\n\n" + context
         },
         {
           role: "user",
           content: userInput
         }
       ]
     });

     return completion.choices[0].message.content || '';
   }
   ```

## Production Deployment

For production deployment:

1. Use environment variables for all secrets
2. Deploy backend to a service like:
   - Heroku
   - Railway
   - AWS/Google Cloud/Azure
   - DigitalOcean
3. Update `FRONTEND_URL` to your production frontend URL
4. Update the fetch URL in `ChatInterface.tsx` to your production backend URL
5. Consider rate limiting and caching for API calls
6. Enable HTTPS for secure communication

## Security Notes

- Never commit `.env` files to version control
- Keep your Notion integration token secret
- Use environment variables for all sensitive data
- In production, implement proper authentication
- Consider rate limiting on your API endpoints
