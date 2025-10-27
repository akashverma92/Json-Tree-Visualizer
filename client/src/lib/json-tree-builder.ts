import { TreeNode, TreeEdge, NodeType } from "@shared/schema";

export interface JsonTreeBuilderResult {
  nodes: TreeNode[];
  edges: TreeEdge[];
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;
const HORIZONTAL_SPACING = 100;
const VERTICAL_SPACING = 100;

function getNodeType(value: any): NodeType {
  if (value === null || value === undefined) {
    return "primitive";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  if (typeof value === "object") {
    return "object";
  }
  return "primitive";
}

function formatValue(value: any): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "boolean") return value.toString();
  if (typeof value === "number") return value.toString();
  return String(value);
}

function getLabel(key: string | number, value: any, nodeType: NodeType): string {
  if (nodeType === "object") {
    const keys = Object.keys(value);
    return `${key} {${keys.length}}`;
  }
  if (nodeType === "array") {
    return `${key} [${value.length}]`;
  }
  return `${key}: ${formatValue(value)}`;
}

interface LayoutNode {
  id: string;
  width: number;
  children: LayoutNode[];
}

function calculateSubtreeWidth(node: LayoutNode): number {
  if (node.children.length === 0) {
    return NODE_WIDTH;
  }
  
  const childrenWidth = node.children.reduce((sum, child) => {
    return sum + calculateSubtreeWidth(child);
  }, 0);
  
  const spacingWidth = (node.children.length - 1) * HORIZONTAL_SPACING;
  return Math.max(NODE_WIDTH, childrenWidth + spacingWidth);
}

function layoutTree(
  layoutNode: LayoutNode,
  nodes: TreeNode[],
  x: number,
  y: number,
  parentX?: number
): void {
  const node = nodes.find(n => n.id === layoutNode.id);
  if (!node) return;

  if (layoutNode.children.length === 0) {
    node.position = { x, y };
    return;
  }

  const subtreeWidth = calculateSubtreeWidth(layoutNode);
  const childrenTotalWidth = layoutNode.children.reduce((sum, child) => {
    return sum + calculateSubtreeWidth(child);
  }, 0);
  const totalSpacing = (layoutNode.children.length - 1) * HORIZONTAL_SPACING;
  
  let currentX = x - subtreeWidth / 2 + calculateSubtreeWidth(layoutNode.children[0]) / 2;
  
  layoutNode.children.forEach((child, index) => {
    const childWidth = calculateSubtreeWidth(child);
    layoutTree(child, nodes, currentX, y + VERTICAL_SPACING);
    currentX += childWidth + HORIZONTAL_SPACING;
  });

  const firstChildX = nodes.find(n => n.id === layoutNode.children[0].id)?.position.x || x;
  const lastChildX = nodes.find(n => n.id === layoutNode.children[layoutNode.children.length - 1].id)?.position.x || x;
  const centerX = (firstChildX + lastChildX) / 2;
  
  node.position = { x: centerX, y };
}

export function buildJsonTree(json: any): JsonTreeBuilderResult {
  const nodes: TreeNode[] = [];
  const edges: TreeEdge[] = [];
  const layoutNodes: Map<string, LayoutNode> = new Map();
  let nodeIdCounter = 0;

  function traverse(
    obj: any,
    key: string | number,
    path: string,
    parentId: string | null = null
  ): string {
    const nodeId = `node-${nodeIdCounter++}`;
    const nodeType = getNodeType(obj);
    const label = getLabel(key, obj, nodeType);

    nodes.push({
      id: nodeId,
      type: nodeType,
      data: {
        label,
        value: obj,
        path,
        isHighlighted: false,
      },
      position: { x: 0, y: 0 },
    });

    const layoutNode: LayoutNode = {
      id: nodeId,
      width: NODE_WIDTH,
      children: [],
    };
    layoutNodes.set(nodeId, layoutNode);

    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: "smoothstep",
      });

      const parentLayoutNode = layoutNodes.get(parentId);
      if (parentLayoutNode) {
        parentLayoutNode.children.push(layoutNode);
      }
    }

    if (nodeType === "object" && obj !== null) {
      Object.entries(obj).forEach(([k, v]) => {
        const childPath = path === "$" ? `$.${k}` : `${path}.${k}`;
        traverse(v, k, childPath, nodeId);
      });
    } else if (nodeType === "array" && Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const childPath = `${path}[${index}]`;
        traverse(item, index, childPath, nodeId);
      });
    }

    return nodeId;
  }

  const rootId = traverse(json, "root", "$", null);
  const rootLayoutNode = layoutNodes.get(rootId);
  
  if (rootLayoutNode) {
    layoutTree(rootLayoutNode, nodes, 0, 0);
  }

  return { nodes, edges };
}

export function normalizeJsonPath(path: string): string {
  let normalized = path.trim();
  
  if (!normalized.startsWith("$")) {
    normalized = "$." + normalized;
  }
  
  normalized = normalized.replace(/\[(\d+)\]/g, "[$1]");
  normalized = normalized.replace(/\.+/g, ".");
  normalized = normalized.replace(/\.\[/g, "[");
  
  return normalized;
}

export function findNodeByPath(nodes: TreeNode[], searchPath: string): TreeNode | null {
  const normalizedSearch = normalizeJsonPath(searchPath);
  
  for (const node of nodes) {
    const normalizedNodePath = normalizeJsonPath(node.data.path);
    
    if (normalizedNodePath === normalizedSearch) {
      return node;
    }
    
    if (normalizedNodePath.endsWith(normalizedSearch) || 
        normalizedSearch.endsWith(normalizedNodePath)) {
      return node;
    }
  }
  
  const searchLower = normalizedSearch.toLowerCase();
  for (const node of nodes) {
    if (normalizeJsonPath(node.data.path).toLowerCase().includes(searchLower)) {
      return node;
    }
  }
  
  return null;
}
