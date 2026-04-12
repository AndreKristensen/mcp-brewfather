"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRecipeTools = registerRecipeTools;
const client_1 = require("../client");
const recipes_1 = require("../schemas/recipes");
const recipe_1 = require("../transforms/recipe");
function errorText(err) {
    if (err instanceof client_1.ApiError)
        return err.toUserMessage();
    if (err instanceof Error)
        return `Error: ${err.message}`;
    return "An unexpected error occurred.";
}
function registerRecipeTools(server, client) {
    server.registerTool("brewfather_list_recipes", {
        title: "List Brewfather Recipes",
        description: "List recipes from Brewfather. Returns recipe names, style, batch size, estimated OG/FG/ABV/IBU, and type (All Grain, Extract, Partial Mash). Supports pagination and sorting.",
        inputSchema: recipes_1.ListRecipesSchema,
    }, async (args) => {
        try {
            const recipes = await client.listRecipes(args);
            return { content: [{ type: "text", text: (0, recipe_1.formatRecipeList)(recipes) }] };
        }
        catch (err) {
            return { content: [{ type: "text", text: errorText(err) }] };
        }
    });
    server.registerTool("brewfather_get_recipe", {
        title: "Get Brewfather Recipe",
        description: "Get full details for a specific recipe by ID, including all fermentables, hops, yeasts, miscellaneous ingredients, mash steps, fermentation profile, water profile, equipment, and brewing notes.",
        inputSchema: recipes_1.GetRecipeSchema,
    }, async (args) => {
        try {
            const recipe = await client.getRecipe(args.id, { include: args.include });
            return { content: [{ type: "text", text: (0, recipe_1.formatRecipeDetail)(recipe) }] };
        }
        catch (err) {
            return { content: [{ type: "text", text: errorText(err) }] };
        }
    });
}
