import { describe, it, expect } from "vitest";
import { buildJsonTree, normalizeJsonPath, findNodeByPath } from "../json-tree-builder";

describe("buildJsonTree", () => {
  it("should build a tree for empty object", () => {
    const result = buildJsonTree({});
    expect(result.nodes).toHaveLength(1);
    expect(result.nodes[0].type).toBe("object");
    expect(result.edges).toHaveLength(0);
  });

  it("should build a tree for empty array", () => {
    const result = buildJsonTree([]);
    expect(result.nodes).toHaveLength(1);
    expect(result.nodes[0].type).toBe("array");
    expect(result.edges).toHaveLength(0);
  });

  it("should build a tree for primitive values", () => {
    const primitives = [null, undefined, 42, "hello", true, false];
    primitives.forEach((value) => {
      const result = buildJsonTree(value);
      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].type).toBe("primitive");
    });
  });

  it("should build a tree for simple object", () => {
    const json = { name: "John", age: 30 };
    const result = buildJsonTree(json);
    expect(result.nodes).toHaveLength(3);
    expect(result.edges).toHaveLength(2);
  });

  it("should build a tree for simple array", () => {
    const json = [1, 2, 3];
    const result = buildJsonTree(json);
    expect(result.nodes).toHaveLength(4);
    expect(result.edges).toHaveLength(3);
  });

  it("should build a tree for nested objects", () => {
    const json = {
      user: {
        name: "John",
        address: {
          city: "NYC",
          zip: "10001",
        },
      },
    };
    const result = buildJsonTree(json);
    expect(result.nodes.length).toBeGreaterThan(5);
    const paths = result.nodes.map((n) => n.data.path);
    expect(paths).toContain("$.user.address.city");
    expect(paths).toContain("$.user.address.zip");
  });

  it("should build a tree for nested arrays", () => {
    const json = {
      items: [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ],
    };
    const result = buildJsonTree(json);
    const paths = result.nodes.map((n) => n.data.path);
    expect(paths).toContain("$.items[0].id");
    expect(paths).toContain("$.items[1].name");
  });

  it("should handle deeply nested structures", () => {
    const json = {
      a: { b: { c: { d: { e: { f: "deep" } } } } },
    };
    const result = buildJsonTree(json);
    const paths = result.nodes.map((n) => n.data.path);
    expect(paths).toContain("$.a.b.c.d.e.f");
  });

  it("should handle special characters in keys", () => {
    const json = {
      "user-name": "John",
      "email@address": "test@example.com",
      "key with spaces": "value",
    };
    const result = buildJsonTree(json);
    expect(result.nodes.length).toBeGreaterThan(3);
  });

  it("should handle mixed types in arrays", () => {
    const json = [1, "two", { three: 3 }, [4, 5], null, true];
    const result = buildJsonTree(json);
    expect(result.nodes.length).toBeGreaterThan(6);
  });

  it("should handle large datasets", () => {
    const json = {
      items: Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
      })),
    };
    const result = buildJsonTree(json);
    expect(result.nodes.length).toBeGreaterThan(300);
  });

  it("should handle unicode characters", () => {
    const json = {
      name: "日本語",
      emoji: "🚀🎉",
      special: "café",
    };
    const result = buildJsonTree(json);
    expect(result.nodes.length).toBeGreaterThan(3);
  });

  it("should handle null and undefined values", () => {
    const json = {
      nullValue: null,
      undefinedValue: undefined,
      normalValue: "test",
    };
    const result = buildJsonTree(json);
    const nullNode = result.nodes.find((n) => n.data.path === "$.nullValue");
    expect(nullNode?.type).toBe("primitive");
  });

  it("should assign correct node types", () => {
    const json = {
      obj: {},
      arr: [],
      str: "text",
      num: 42,
      bool: true,
      nil: null,
    };
    const result = buildJsonTree(json);
    const objNode = result.nodes.find((n) => n.data.path === "$.obj");
    const arrNode = result.nodes.find((n) => n.data.path === "$.arr");
    const strNode = result.nodes.find((n) => n.data.path === "$.str");

    expect(objNode?.type).toBe("object");
    expect(arrNode?.type).toBe("array");
    expect(strNode?.type).toBe("primitive");
  });
});

describe("normalizeJsonPath", () => {
  it("should add $ prefix if missing", () => {
    expect(normalizeJsonPath("user.name")).toBe("$.user.name");
    expect(normalizeJsonPath("items[0]")).toBe("$.items[0]");
  });

  it("should keep existing $ prefix", () => {
    expect(normalizeJsonPath("$.user.name")).toBe("$.user.name");
  });

  it("should normalize array brackets", () => {
    expect(normalizeJsonPath("items[0]")).toBe("$.items[0]");
    expect(normalizeJsonPath("$.items[0]")).toBe("$.items[0]");
  });

  it("should handle multiple dots", () => {
    expect(normalizeJsonPath("user..name")).toBe("$.user.name");
  });

  it("should handle mixed notation", () => {
    expect(normalizeJsonPath("user.[0].name")).toBe("$.user[0].name");
  });

  it("should trim whitespace", () => {
    expect(normalizeJsonPath("  $.user.name  ")).toBe("$.user.name");
  });
});

describe("findNodeByPath", () => {
  const json = {
    user: {
      name: "John",
      address: {
        city: "NYC",
      },
    },
    items: [{ id: 1 }, { id: 2 }],
  };
  const { nodes } = buildJsonTree(json);

  it("should find exact path match", () => {
    const node = findNodeByPath(nodes, "$.user.name");
    expect(node).toBeTruthy();
    expect(node?.data.path).toBe("$.user.name");
  });

  it("should find path without $ prefix", () => {
    const node = findNodeByPath(nodes, "user.address.city");
    expect(node).toBeTruthy();
  });

  it("should find array path", () => {
    const node = findNodeByPath(nodes, "$.items[0].id");
    expect(node).toBeTruthy();
  });

  it("should return null for non-existent path", () => {
    const node = findNodeByPath(nodes, "$.nonexistent.path");
    expect(node).toBeNull();
  });

  it("should handle case-insensitive partial matches", () => {
    const node = findNodeByPath(nodes, "USER.NAME");
    expect(node).toBeTruthy();
  });

  it("should find partial path matches", () => {
    const node = findNodeByPath(nodes, "address.city");
    expect(node).toBeTruthy();
  });
});
