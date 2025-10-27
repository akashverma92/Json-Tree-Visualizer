import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Box, ListOrdered, Variable, Copy, Check } from "lucide-react";
import { NodeType } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface NodeData {
  label: string;
  value: any;
  path: string;
  isHighlighted?: boolean;
}

const nodeIcons: Record<NodeType, any> = {
  object: Box,
  array: ListOrdered,
  primitive: Variable,
};

export const JsonNode = memo(({ data, type }: NodeProps<NodeData>) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const nodeType = type as NodeType;
  const Icon = nodeIcons[nodeType];
  const isHighlighted = data.isHighlighted;

  const getNodeClasses = () => {
    if (isHighlighted) {
      return "bg-node-highlight text-node-highlight-foreground border-node-highlight-border border-2";
    }
    
    switch (nodeType) {
      case "object":
        return "bg-node-object text-node-object-foreground border-node-object-border";
      case "array":
        return "bg-node-array text-node-array-foreground border-node-array-border";
      case "primitive":
        return "bg-node-primitive text-node-primitive-foreground border-node-primitive-border";
      default:
        return "bg-card text-card-foreground border-card-border";
    }
  };

  const handleCopyPath = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(data.path);
      setCopied(true);
      toast({
        title: "Path copied!",
        description: `Copied: ${data.path}`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy path to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={`
        px-4 py-3 rounded-md border shadow-sm
        min-w-[180px] max-w-[280px]
        transition-all duration-200
        ${getNodeClasses()}
        ${isHighlighted ? "shadow-lg scale-105" : "hover-elevate"}
      `}
      data-testid={`node-${nodeType}-${data.path.replace(/[^a-zA-Z0-9]/g, "-")}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-border !w-2 !h-2 !border-2 !border-background"
      />
      
      <div className="flex items-start gap-2">
        <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium break-words leading-relaxed">
            {data.label}
          </div>
          <div className="text-xs opacity-75 mt-1 font-mono truncate" title={data.path}>
            {data.path}
          </div>
        </div>
        <button
          onClick={handleCopyPath}
          className="flex-shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          data-testid={`button-copy-path-${data.path.replace(/[^a-zA-Z0-9]/g, "-")}`}
          title="Copy path"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-border !w-2 !h-2 !border-2 !border-background"
      />
    </div>
  );
});

JsonNode.displayName = "JsonNode";
