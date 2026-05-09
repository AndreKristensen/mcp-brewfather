"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function CopyPromptCard({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card size="sm" className="group/prompt">
      <CardContent className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground italic">
          &ldquo;{prompt}&rdquo;
        </p>
        <button
          onClick={handleCopy}
          aria-label="Copy prompt"
          className="shrink-0 mt-0.5 text-muted-foreground/30 opacity-0 group-hover/prompt:opacity-100 hover:!text-foreground transition-all"
        >
          {copied ? (
            <Check className="size-3.5 text-green-500" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </CardContent>
    </Card>
  );
}
