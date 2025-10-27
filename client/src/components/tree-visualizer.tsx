import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Search, Download, ZoomIn, ZoomOut, Maximize2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { JsonNode } from "./json-node";
import { buildJsonTree, findNodeByPath } from "@/lib/json-tree-builder";
import { toPng } from "html-to-image";
import { useToast } from "@/hooks/use-toast";

const nodeTypes = {
  object: JsonNode,
  array: JsonNode,
  primitive: JsonNode,
};

interface TreeVisualizerContentProps {
  jsonData: any | null;
}

function TreeVisualizerContent({ jsonData }: TreeVisualizerContentProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const { fitView, getViewport, setCenter } = useReactFlow();
  const { toast } = useToast();

  useEffect(() => {
    if (jsonData) {
      const { nodes: treeNodes, edges: treeEdges } = buildJsonTree(jsonData);
      setNodes(treeNodes as Node[]);
      setEdges(treeEdges as Edge[]);
      
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 400 });
      }, 50);
    }
  }, [jsonData, setNodes, setEdges, fitView]);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: { ...node.data, isHighlighted: false },
        }))
      );
      setSearchResult(null);
      return;
    }

    const foundNode = findNodeByPath(nodes, searchQuery);

    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isHighlighted: node.id === foundNode?.id,
        },
      }))
    );

    if (foundNode) {
      setSearchResult("Match found");
      setCenter(foundNode.position.x, foundNode.position.y, {
        zoom: 1.2,
        duration: 600,
      });
    } else {
      setSearchResult("No match found");
    }
  }, [searchQuery, nodes, setNodes, setCenter]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, handleSearch]);

  const handleDownload = async () => {
    const element = document.querySelector(".react-flow") as HTMLElement;
    if (!element) return;

    try {
      const dataUrl = await toPng(element, {
        backgroundColor: getComputedStyle(document.documentElement)
          .getPropertyValue("--background")
          .trim()
          ? `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--background")})`
          : "#ffffff",
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `json-tree-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: "Tree downloaded!",
        description: "Your JSON tree has been saved as an image.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download the tree visualization.",
        variant: "destructive",
      });
    }
  };

  const handleZoomIn = () => {
    const { zoom, x, y } = getViewport();
    setCenter(x, y, {
      zoom: Math.min(zoom * 1.2, 2),
      duration: 200,
    });
  };

  const handleZoomOut = () => {
    const { zoom, x, y } = getViewport();
    setCenter(x, y, {
      zoom: Math.max(zoom * 0.8, 0.1),
      duration: 200,
    });
  };

  const handleFitView = () => {
    fitView({ padding: 0.2, duration: 400 });
  };

  if (!jsonData) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/20">
        <div className="text-center space-y-3 p-8">
          <div className="text-muted-foreground">
            <svg
              className="w-24 h-24 mx-auto mb-4 opacity-40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">No JSON to visualize</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Enter JSON data in the input panel and click "Visualize Tree" to see the hierarchical structure
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b bg-background">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by path (e.g., $.user.address.city, items[0].name)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10 pr-4"
            data-testid="input-search"
          />
        </div>
        {searchResult && (
          <div
            className={`text-sm font-medium px-3 py-1.5 rounded-md ${
              searchResult === "Match found"
                ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300"
                : "bg-destructive/10 text-destructive"
            }`}
            data-testid="text-search-result"
          >
            {searchResult}
          </div>
        )}
      </div>

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={2}
          defaultEdgeOptions={{
            type: "smoothstep",
            animated: false,
            style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <MiniMap
            nodeColor={(node) => {
              switch (node.type) {
                case "object":
                  return "hsl(var(--node-object))";
                case "array":
                  return "hsl(var(--node-array))";
                case "primitive":
                  return "hsl(var(--node-primitive))";
                default:
                  return "hsl(var(--card))";
              }
            }}
            className="!bg-background !border-border"
          />
        </ReactFlow>

        <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-card border rounded-lg shadow-lg p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            data-testid="button-zoom-in"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFitView}
            data-testid="button-fit-view"
            title="Fit View"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            data-testid="button-zoom-out"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <div className="border-t my-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            data-testid="button-download"
            title="Download as Image"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function TreeVisualizer({ jsonData }: TreeVisualizerContentProps) {
  return (
    <ReactFlowProvider>
      <TreeVisualizerContent jsonData={jsonData} />
    </ReactFlowProvider>
  );
}
