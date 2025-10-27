# JSON Tree Visualizer

## Overview
An interactive web application that visualizes JSON data as hierarchical tree structures using React Flow. Built with React, TypeScript, Tailwind CSS, and React Flow.

## Purpose
Allow users to:
- Parse and validate JSON input
- Visualize JSON as interactive tree structures
- Search nodes by JSON path
- Copy JSON paths to clipboard
- Download tree visualizations as images
- Switch between dark and light themes

## Project Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (minimal client-side routing)
- **Styling**: Tailwind CSS with custom design tokens
- **Visualization**: React Flow (@xyflow/react)
- **State Management**: React hooks
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Shadcn UI components
- **Image Export**: html-to-image
- **Path Parsing**: jsonpath-plus

### Key Features Implemented
1. **JSON Input Panel**
   - Text area with syntax validation
   - Error messages for invalid JSON
   - Sample JSON loading
   - Clear/Reset functionality

2. **Tree Visualization**
   - Hierarchical node display using React Flow
   - Color-coded nodes by type:
     - Blue for objects
     - Green for arrays
     - Orange for primitives
     - Purple for highlighted/search results
   - Smooth animations and transitions
   - Pan and zoom controls
   - MiniMap for navigation

3. **Search Functionality**
   - JSON path search ($.user.address.city, items[0].name)
   - Real-time search with debouncing
   - Auto-pan to matched nodes
   - Visual highlighting of matches
   - Match found/not found status

4. **Interactive Features**
   - Click nodes to copy JSON path
   - Zoom In/Out/Fit View controls
   - Download tree as PNG image
   - Dark/Light mode toggle
   - Responsive design (mobile/tablet/desktop)

### Component Structure
```
client/src/
├── components/
│   ├── ui/ (Shadcn components)
│   ├── json-input-panel.tsx
│   ├── tree-visualizer.tsx
│   ├── json-node.tsx
│   └── theme-toggle.tsx
├── lib/
│   ├── json-tree-builder.ts (tree construction logic)
│   ├── theme-provider.tsx
│   └── queryClient.ts
├── pages/
│   └── home.tsx
└── App.tsx
```

### Design System
- **Typography**: Inter (UI), JetBrains Mono (code)
- **Color Palette**: Custom tokens for light/dark modes
- **Spacing**: Consistent 4px grid system
- **Border Radius**: Small (6px) for all components
- **Shadows**: Minimal, subtle elevation

## Recent Changes
- 2025-10-27: Initial implementation with all MVP features
  - Created JSON tree builder with hierarchical layout algorithm
  - Implemented React Flow visualization with custom nodes
  - Added search functionality with path normalization
  - Created responsive split-panel layout
  - Added dark/light mode support
  - Implemented download as image feature
  - Added comprehensive unit tests for tree builder

## Technical Details

### JSON Path Format
The application supports multiple path formats:
- `$.user.name` (standard JSONPath)
- `user.name` (auto-prefixes with $)
- `items[0].id` (array notation)
- `$.items[0].name` (combined)

### Tree Layout Algorithm
Uses a custom hierarchical layout algorithm that:
1. Calculates subtree widths recursively
2. Centers parent nodes over their children
3. Maintains consistent horizontal and vertical spacing
4. Handles large trees efficiently

### Node Types
- **Object**: Displays key count in label
- **Array**: Displays array length in label
- **Primitive**: Displays key-value pair in label

## Testing
Unit tests cover:
- Empty JSON (objects and arrays)
- Primitive values (null, undefined, numbers, strings, booleans)
- Nested objects and arrays
- Deeply nested structures (6+ levels)
- Special characters in keys
- Unicode and emoji support
- Large datasets (100+ items)
- Mixed types in arrays
- Path normalization edge cases
- Search functionality edge cases

## Environment
- Node.js with Express backend (serves static files)
- Vite for frontend development and bundling
- Development server runs on port 5000
