# Quick Start Guide

## ✅ Everything is Set Up!

Your Whisper Tree app now has a full Notion integration with both frontend and backend running.

## 🚀 Running the Application

### Option 1: Run Both Servers Together (Recommended)

```bash
npm run dev:all
```

This starts:
- **Frontend** (Vite) on http://localhost:8080 - cyan output
- **Backend** (Express) on http://localhost:3001 - magenta output

### Option 2: Run Servers Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run dev:server
```

## 📁 Current Status

### ✅ Completed Setup
- [x] Express backend server with TypeScript
- [x] Notion SDK integration
- [x] RESTful API endpoints
- [x] CORS configured for frontend
- [x] ChatInterface updated to use backend
- [x] Environment variables configured
- [x] Both servers running

### 🔧 Backend Server (Port 3001)
- Status: **Running** ✅
- Health Check: http://localhost:3001/health
- Notion Integration: **Not configured** (placeholder .env created)

### 💻 Frontend (Port 8080)
- Status: **Running** ✅
- URL: http://localhost:8080
- API Connection: Configured to call http://localhost:3001

## 📝 Next Steps to Complete Notion Integration

### 1. Get Notion Credentials

Follow these steps to connect to your Notion workspace:

**A. Create Notion Integration**
1. Go to https://www.notion.so/my-integrations
2. Click **"+ New integration"**
3. Name: "Whisper Tree Chat"
4. Select your workspace
5. Capabilities: Check "Read content"
6. Click **Submit**
7. Copy the **Internal Integration Token**

**B. Create Notion Databases**

Create 3 databases in your Notion workspace:

1. **FAQ Database**
   - Property: "Name" (Title type)
   - Add FAQ pages (questions in title, answers in content)

2. **Templates Database**
   - Property: "Name" (Title type)
   - Add design template pages

3. **Knowledge Base Database**
   - Property: "Name" (Title type)
   - Add knowledge articles

**C. Share Databases with Integration**

For each database:
1. Open the database
2. Click **"..."** menu (top right)
3. Click **"Connect to"**
4. Select "Whisper Tree Chat"

**D. Get Database IDs**

For each database:
1. Open in Notion
2. Copy the URL
3. Extract the 32-character ID from the URL

Example:
```
https://www.notion.so/workspace/abc123def456...?v=...
                                ^^^^^^^^^^^^^^
                                This is the database ID
```

### 2. Update Environment Variables

Edit `server/.env`:

```bash
# Add your credentials here
NOTION_API_KEY=secret_your_token_here
NOTION_DATABASE_FAQ_ID=your_32_character_id_here
NOTION_DATABASE_TEMPLATES_ID=your_32_character_id_here
NOTION_DATABASE_KNOWLEDGE_ID=your_32_character_id_here
```

### 3. Restart Backend

After adding credentials:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev:all
```

You should see:
```
📝 Notion integration: Configured ✅
```

## 🧪 Testing the Integration

Once Notion is configured:

1. **Test Health Endpoint**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Test Search**
   ```bash
   curl -X POST http://localhost:3001/api/search \
     -H "Content-Type: application/json" \
     -d '{"query":"treehouse"}'
   ```

3. **Test in App**
   - Open http://localhost:8080
   - Navigate to the chat interface
   - Type a message related to your Notion content
   - The system will search Notion and generate a response

## 📚 API Endpoints

All endpoints run on `http://localhost:3001`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/search` | POST | Search all databases |
| `/api/faqs` | GET | Get all FAQs |
| `/api/template/random` | GET | Get random template |
| `/api/concept/generate` | POST | Generate concept from user input |

## 🎨 Frontend Features

The ChatInterface (`src/components/ChatInterface.tsx`) now:
- Calls backend API for concept generation
- Uses Notion content in responses
- Falls back to basic responses if backend unavailable
- Shows user-friendly error messages

## 📖 Documentation

- `README-NOTION.md` - Complete Notion setup guide
- `README-NOTION-MCP.md` - MCP integration guide (for Claude Desktop)
- `server/README.md` - Backend server documentation

## 🔧 Troubleshooting

### Backend not starting
```bash
cd server
npm install
npm run dev
```

### Frontend can't connect to backend
- Check backend is running on port 3001
- Verify CORS settings in `server/.env`
- Check browser console for errors

### Notion integration not working
- Verify `.env` has correct credentials
- Check databases are shared with integration
- Look at server console for error messages

### Port already in use
```bash
# Check what's using the port
lsof -i :3001
lsof -i :8080

# Kill the process
kill -9 <PID>
```

## 🚀 Production Deployment

When ready to deploy:

1. **Backend**: Deploy to Railway, Heroku, or similar
2. **Frontend**: Build and deploy to Vercel, Netlify, etc.
3. **Update URLs**: Change `FRONTEND_URL` and API endpoint URLs
4. **Secure credentials**: Use environment variables in hosting platform

## 💡 Tips

- Use `npm run dev:all` for best developer experience
- Check server logs in magenta (backend) for debugging
- Keep Notion databases organized for better search results
- Add more content to Notion for richer chat responses

## 🎯 Current App Flow

1. **Landing Page** → User arrives
2. **Chat Interface** → User shares wishes
3. **Backend API** → Searches Notion for relevant content
4. **Concept Generation** → Creates personalized concept
5. **Concept Reveal** → Shows design with CTAs
6. **Complete** → Book, request brochure, or video chat

---

**Everything is ready to go! Just add your Notion credentials and start chatting!**
