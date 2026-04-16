# Brewfather MCP Server

An MCP (Model Context Protocol) server for the [Brewfather](https://brewfather.app) homebrewing platform. Exposes your Brewfather data — batches, recipes, and inventory — as tools that Claude and other AI assistants can use directly.

## Tools

| Tool | Description |
|---|---|
| `brewfather_list_batches` | List batches with optional status filter |
| `brewfather_get_batch` | Full detail for a single batch |
| `brewfather_update_batch` | Update batch fields (status, notes, measurements, etc.) |
| `brewfather_get_last_reading` | Latest sensor reading for a batch |
| `brewfather_get_readings` | Historical sensor readings for a batch |
| `brewfather_get_brew_tracker` | Brew day stage progress |
| `brewfather_list_recipes` | List recipes |
| `brewfather_get_recipe` | Full recipe detail |
| `brewfather_list_inventory` | List inventory (fermentables, hops, miscs, or yeasts) |
| `brewfather_get_inventory_item` | Detail for a single inventory item |
| `brewfather_update_inventory_item` | Update inventory stock level |

---

## Setup: Claude.ai Remote Connector (Vercel)

The server uses standard OAuth 2.1 with PKCE. You authorize once through a login form — Claude handles token refresh automatically after that.

### 1. Deploy to Vercel

Connect this repo to [Vercel](https://vercel.com) and deploy. No build configuration needed — Vercel detects Next.js automatically.

### 2. Set environment variables

In your Vercel project go to **Settings → Environment Variables** and add:

| Variable | Value |
|---|---|
| `MCP_AUTH_TOKEN` | A strong random secret (see below) |
| `BREWFATHER_USER_ID` | Found in **Brewfather → Settings → API** |
| `BREWFATHER_API_KEY` | Found in **Brewfather → Settings → API** |

Generate the token:
```bash
openssl rand -hex 32
```

Redeploy after adding the variables.

### 3. Add the connector in Claude.ai

1. Go to **Claude.ai → Settings → Connectors**
2. Click **Add custom connector**
3. Enter the URL: `https://your-project.vercel.app/api/mcp`
4. Save

### 4. Authorize

When you first use the connector, Claude will open an authorization page on your Vercel deployment. Enter your **Server Token** (the `MCP_AUTH_TOKEN` value from step 2) and click **Authorize**.

Claude receives an access token (valid 1 hour) and a refresh token (valid 30 days). You won't need to re-authorize until the refresh token expires.

### How the auth works

- The server implements OAuth 2.1 + PKCE — the same standard Claude.ai uses for all remote connectors
- Tokens are HMAC-SHA256 signed with your `MCP_AUTH_TOKEN`; no database is needed (fully stateless)
- The Server Token gate ensures only you can authorize, even if someone finds your deployment URL

---

## Setup: Claude Desktop (Local / stdio)

Use this if you prefer running the server locally instead of on Vercel.

### 1. Build

```bash
pnpm install
pnpm build:mcp
```

### 2. Configure Claude Desktop

Add to your `claude_desktop_config.json`:

**Linux:** `~/.config/Claude/claude_desktop_config.json`
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "brewfather": {
      "command": "node",
      "args": ["/absolute/path/to/bf-mcp/dist/server.js"],
      "env": {
        "BREWFATHER_USER_ID": "your_user_id",
        "BREWFATHER_API_KEY": "your_api_key"
      }
    }
  }
}
```

Restart Claude Desktop. The hammer icon in the chat input confirms the tools are loaded.

---

## Development

```bash
pnpm dev          # Next.js dev server (http://localhost:3000)
pnpm dev:mcp      # MCP stdio server with hot reload (tsx watch)
pnpm build        # Next.js production build
pnpm build:mcp    # Compile stdio server to dist/
```
