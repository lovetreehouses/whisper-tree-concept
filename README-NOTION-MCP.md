# Setting Up Notion MCP Integration

## What is MCP?

Model Context Protocol (MCP) is a standardized way for Claude to connect to external data sources and tools. The Notion MCP server allows Claude Desktop to directly access your Notion workspace.

## Setup Complete! ✅

I've created the Claude Desktop configuration file at:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

With the following configuration:
```json
{
  "mcpServers": {
    "Notion": {
      "url": "https://mcp.notion.com/mcp"
    }
  }
}
```

## Next Steps

### 1. Restart Claude Desktop

**Important**: You must restart Claude Desktop for the MCP configuration to take effect.

1. Quit Claude Desktop completely (Cmd+Q)
2. Reopen Claude Desktop
3. The Notion MCP server will initialize on startup

### 2. Authenticate with Notion

When you first use the Notion MCP server:

1. Start a conversation in Claude Desktop
2. Ask Claude to access your Notion workspace
3. You'll be prompted to authenticate via OAuth
4. Grant Claude access to your Notion workspace
5. The connection will be saved for future sessions

### 3. Test the Connection

After restarting Claude Desktop, try asking:

```
"Can you list my Notion databases?"
"Search my Notion for information about treehouses"
"Show me pages in my FAQ database"
```

## How This Works with Your Web App

You now have **two ways** to access Notion:

### Option A: Claude Desktop (MCP) - For Development & Planning
- **Use when**: Chatting with Claude Desktop to plan features, debug, or get help
- **Access**: Direct access to your Notion workspace via MCP
- **Benefits**:
  - No API key management needed
  - Real-time access to all your Notion content
  - Can read/write/update Notion pages
  - OAuth-based authentication

### Option B: Express Backend - For Your Web App
- **Use when**: Running your React web application
- **Access**: REST API endpoints that query Notion
- **Benefits**:
  - Works in production
  - Can be deployed to hosting services
  - Controlled access for end users
  - Custom business logic and caching

## Using Both Together

**Best workflow**:

1. **Development with Claude Desktop**:
   - Use MCP to explore your Notion content
   - Ask Claude to help structure your databases
   - Get suggestions based on real Notion data
   - Test queries and see results instantly

2. **Production with Express Backend**:
   - Use the `/server` backend for your web app
   - Configure with API keys (not OAuth)
   - Deploy to production hosting
   - Serve your React frontend

## Verifying MCP Setup

After restarting Claude Desktop, you should see:

1. A **hammer icon** (🔨) in the input box - indicates MCP tools are available
2. Notion tools in the available tools list
3. Prompts for authentication when first accessing Notion

## Troubleshooting

### "MCP server not connecting"
- Make sure you completely quit and restarted Claude Desktop
- Check the config file exists: `cat ~/Library/Application\ Support/Claude/claude_desktop_config.json`
- Ensure the JSON is valid (no syntax errors)

### "Authentication failed"
- Make sure you're logged into Notion in your browser
- Try disconnecting and reconnecting the integration
- Check that your Notion workspace has the proper permissions

### "Can't find databases"
- Ensure pages/databases are not in trash
- Check that the integration has access to the pages
- Try sharing specific pages with the integration

## What You Can Do with Notion MCP

Once configured, you can ask Claude to:

- **Search**: "Find all pages about treehouse designs"
- **Read**: "Show me the content of the FAQ about pricing"
- **Create**: "Create a new page in my Knowledge Base about oak trees"
- **Update**: "Add a FAQ about building permits"
- **Query**: "What templates do I have for garden offices?"
- **Analyze**: "Summarize all my treehouse project notes"

## MCP vs Direct API

| Feature | Notion MCP (Claude Desktop) | Express Backend (Web App) |
|---------|----------------------------|---------------------------|
| Authentication | OAuth (user-based) | API Key (integration-based) |
| Use Case | Development, Planning | Production Web App |
| Access Control | Your personal access | Programmatic access |
| Deployment | Local only | Can deploy anywhere |
| Real-time | Yes | Yes |
| Rate Limits | Notion's standard limits | Notion's standard limits |

## Next: Enhancing the Express Backend

Now that you have MCP access for development, you can:

1. Use Claude Desktop to explore your Notion structure
2. Refine the database schemas based on what works
3. Test queries and see what data is useful
4. Update the Express backend with insights from MCP testing

Want help with any of these steps? Just ask!
