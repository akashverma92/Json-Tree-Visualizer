import { useState } from "react";
import { AlertCircle, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SAMPLE_JSON } from "@shared/schema";

interface JsonInputPanelProps {
  onVisualize: (json: any) => void;
  onClear: () => void;
}

export function JsonInputPanel({ onVisualize, onClear }: JsonInputPanelProps) {
  const [input, setInput] = useState(JSON.stringify(SAMPLE_JSON, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleVisualize = () => {
    setError(null);
    setSuccess(false);

    if (!input.trim()) {
      setError("JSON input cannot be empty");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      onVisualize(parsed);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Invalid JSON format";
      setError(errorMessage);
    }
  };

  const handleClear = () => {
    setInput("");
    setError(null);
    setSuccess(false);
    onClear();
  };

  const handleLoadSample = () => {
    setInput(JSON.stringify(SAMPLE_JSON, null, 2));
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="flex flex-col h-full p-6 gap-4 bg-background border-r">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">JSON Input</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLoadSample}
          data-testid="button-load-sample"
          className="gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Load Sample
        </Button>
      </div>

      <Textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setError(null);
          setSuccess(false);
        }}
        placeholder={JSON.stringify(SAMPLE_JSON, null, 2)}
        className="flex-1 font-mono text-sm resize-none focus-visible:ring-1"
        data-testid="textarea-json-input"
      />

      {error && (
        <Alert variant="destructive" data-testid="alert-error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100" data-testid="alert-success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>JSON parsed successfully!</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3">
        <Button
          onClick={handleVisualize}
          className="flex-1 gap-2"
          data-testid="button-visualize"
        >
          <Sparkles className="w-4 h-4" />
          Visualize Tree
        </Button>
        <Button
          variant="outline"
          onClick={handleClear}
          data-testid="button-clear"
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Clear
        </Button>
      </div>

      <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
        <p className="font-medium">Tips:</p>
        <ul className="list-disc list-inside space-y-0.5 pl-1">
          <li>Paste or type valid JSON data</li>
          <li>Click "Visualize Tree" to generate the tree</li>
          <li>Use the search bar to find specific paths</li>
          <li>Click any node to copy its JSON path</li>
        </ul>
      </div>
    </div>
  );
}
