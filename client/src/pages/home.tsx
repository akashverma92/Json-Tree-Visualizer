import { useState } from "react";
import { JsonInputPanel } from "@/components/json-input-panel";
import { TreeVisualizer } from "@/components/tree-visualizer";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [jsonData, setJsonData] = useState<any>(null);

  const handleVisualize = (json: any) => {
    setJsonData(json);
  };

  const handleClear = () => {
    setJsonData(null);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between px-6 py-3 border-b bg-background">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold" data-testid="text-app-title">
              JSON Tree Visualizer
            </h1>
            <p className="text-sm text-muted-foreground">
              Interactive hierarchical tree structure viewer
            </p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-[400px] xl:w-[480px] flex-shrink-0 overflow-auto border-b lg:border-b-0 lg:border-r max-h-[40vh] lg:max-h-none">
          <JsonInputPanel onVisualize={handleVisualize} onClear={handleClear} />
        </div>

        <div className="flex-1 overflow-hidden">
          <TreeVisualizer jsonData={jsonData} />
        </div>
      </div>
    </div>
  );
}
