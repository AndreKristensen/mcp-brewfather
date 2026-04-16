import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FlaskConical, Package, BookOpen, GitFork } from "lucide-react";

const batchTools = [
  { name: "List batches", description: "Filter by status: Planning, Fermenting, Conditioning, and more" },
  { name: "Get batch", description: "Full details — gravities, volumes, efficiency, all ingredients" },
  { name: "Update batch", description: "Record OG/FG, pH, volumes, or move to a new status" },
  { name: "Latest reading", description: "Most recent sensor reading from iSpindel, Tilt, or manual entry" },
  { name: "All readings", description: "Full chronological gravity and temperature history" },
  { name: "Brew tracker", description: "Current brew day stage and step completion status" },
];

const inventoryTools = [
  { name: "List inventory", description: "Browse fermentables, hops, yeasts, and misc ingredients" },
  { name: "Get item", description: "Stock amount, cost, origin, and brewing characteristics" },
  { name: "Update stock", description: "Set exact amounts or adjust by delta (e.g. deduct used hops)" },
];

const recipeTools = [
  { name: "List recipes", description: "Name, style, batch size, and estimated OG/FG/ABV/IBU" },
  { name: "Get recipe", description: "Full ingredient list, mash steps, fermentation profile, water profile" },
];

const examplePrompts = [
  "What batches am I currently fermenting?",
  "Show me the gravity readings for my Hazy IPA batch",
  "Move my Stout to Conditioning and record an FG of 1.012",
  "How much Citra hops do I have in stock?",
  "What's in my Pale Ale recipe — all ingredients and hop schedule?",
  "Deduct 100g of Centennial hops from my inventory",
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-muted text-foreground">
      <main className="flex flex-col flex-1 w-full max-w-4xl mx-auto px-6 pb-24">

        {/* Hero */}
        <section className="flex flex-col items-center text-center py-28 gap-6">
          <Badge variant="secondary">11 MCP Tools</Badge>
          <h1 className="text-5xl font-bold tracking-tight leading-tight">
            Brewfather MCP
          </h1>
          <p className="text-xl text-muted-foreground max-w-md">
            Your brewery, inside Claude.
          </p>
          <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
            An open-source MCP server that connects Claude to your Brewfather account.
            Ask questions about your batches, track fermentation, manage inventory, and
            explore recipes — all in natural language.
          </p>
          <div className="flex flex-col items-center gap-3">
            <Button size="lg" asChild>
              <a
                href="https://github.com/AndreKristensen/mcp-brewfather"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitFork data-icon="inline-start" />
                View on GitHub
              </a>
            </Button>
            <p className="text-sm text-muted-foreground">
              A hobby project — clone it and host your own
            </p>
          </div>
        </section>

        <Separator />

        {/* Capabilities */}
        <section className="py-16 flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              What Claude can do with your brewery
            </h2>
            <p className="text-muted-foreground">
              Three tool categories, covering the full Brewfather workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {/* Batches */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="size-4 text-muted-foreground" />
                    <CardTitle>Batches</CardTitle>
                  </div>
                  <Badge variant="outline">6 tools</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-3">
                  {batchTools.map((tool) => (
                    <li key={tool.name} className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">{tool.name}</span>
                      <span className="text-xs text-muted-foreground">{tool.description}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="size-4 text-muted-foreground" />
                    <CardTitle>Inventory</CardTitle>
                  </div>
                  <Badge variant="outline">3 tools</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-3">
                  {inventoryTools.map((tool) => (
                    <li key={tool.name} className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">{tool.name}</span>
                      <span className="text-xs text-muted-foreground">{tool.description}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Recipes */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-4 text-muted-foreground" />
                    <CardTitle>Recipes</CardTitle>
                  </div>
                  <Badge variant="outline">2 tools</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-3">
                  {recipeTools.map((tool) => (
                    <li key={tool.name} className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">{tool.name}</span>
                      <span className="text-xs text-muted-foreground">{tool.description}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Example prompts */}
        <section className="py-16 flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Just ask Claude
            </h2>
            <p className="text-muted-foreground">
              A few things you can say once the server is connected.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {examplePrompts.map((prompt) => (
              <Card key={prompt} size="sm">
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">&ldquo;{prompt}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Footer */}
        <footer className="py-10 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Open source · MIT License ·{" "}
            <a
              href="https://github.com/AndreKristensen/mcp-brewfather"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Clone it on GitHub and self-host
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
