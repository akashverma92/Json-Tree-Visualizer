import { z } from "zod";

// JSON Tree Node Types
export type NodeType = "object" | "array" | "primitive";

// Tree Node for React Flow
export interface TreeNode {
  id: string;
  type: NodeType;
  data: {
    label: string;
    value: any;
    path: string;
    isHighlighted?: boolean;
  };
  position: { x: number; y: number };
}

// Tree Edge for React Flow
export interface TreeEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

// JSON Validation Schema
export const jsonInputSchema = z.string().min(1, "JSON input cannot be empty");

export type JsonInputType = z.infer<typeof jsonInputSchema>;

// Sample JSON for placeholder
export const SAMPLE_JSON = {
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "address": {
      "street": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "zipCode": "94102"
    },
    "isActive": true
  },
  "items": [
    {
      "id": 101,
      "name": "Laptop",
      "price": 1299.99,
      "inStock": true
    },
    {
      "id": 102,
      "name": "Mouse",
      "price": 29.99,
      "inStock": false
    },
    {
      "id": 103,
      "name": "Keyboard",
      "price": 89.99,
      "inStock": true
    }
  ],
  "metadata": {
    "version": "1.0.0",
    "lastUpdated": "2025-10-27T10:00:00Z",
    "tags": ["demo", "sample", "json"]
  }
};
