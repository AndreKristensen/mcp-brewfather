"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const client_1 = require("./client");
const batches_1 = require("./tools/batches");
const recipes_1 = require("./tools/recipes");
const inventory_1 = require("./tools/inventory");
const userId = process.env.BREWFATHER_USER_ID;
const apiKey = process.env.BREWFATHER_API_KEY;
if (!userId || !apiKey) {
    process.stderr.write("Error: BREWFATHER_USER_ID and BREWFATHER_API_KEY environment variables are required.\n" +
        "Set them in claude_desktop_config.json under the 'env' key, or export them in your shell.\n");
    process.exit(1);
}
const client = new client_1.BrewfatherClient(userId, apiKey);
const server = new mcp_js_1.McpServer({
    name: "brewfather",
    version: "0.1.0",
});
(0, batches_1.registerBatchTools)(server, client);
(0, recipes_1.registerRecipeTools)(server, client);
(0, inventory_1.registerInventoryTools)(server, client);
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main().catch((err) => {
    process.stderr.write(`Fatal error: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
});
