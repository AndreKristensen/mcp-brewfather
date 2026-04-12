import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { BrewfatherClient } from "./client";
import { registerBatchTools } from "./tools/batches";
import { registerRecipeTools } from "./tools/recipes";
import { registerInventoryTools } from "./tools/inventory";

const userId = process.env.BREWFATHER_USER_ID;
const apiKey = process.env.BREWFATHER_API_KEY;

if (!userId || !apiKey) {
  process.stderr.write(
    "Error: BREWFATHER_USER_ID and BREWFATHER_API_KEY environment variables are required.\n" +
      "Set them in claude_desktop_config.json under the 'env' key, or export them in your shell.\n"
  );
  process.exit(1);
}

const client = new BrewfatherClient(userId, apiKey);

const server = new McpServer({
  name: "brewfather",
  version: "0.1.0",
});

registerBatchTools(server, client);
registerRecipeTools(server, client);
registerInventoryTools(server, client);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  process.stderr.write(`Fatal error: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
