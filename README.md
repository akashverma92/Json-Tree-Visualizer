# JSON Tree Visualizer

An interactive web application that visualizes JSON data as hierarchical tree structures using React Flow. Built with React, TypeScript, Tailwind CSS, and modern web technologies.

![JSON Tree Visualizer](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-blue) ![Tests](https://img.shields.io/badge/Tests-Passing-green)

## Features

### Core Functionality
- **JSON Input & Validation** - Parse and validate JSON with clear error messages
- **Interactive Tree Visualization** - Hierarchical node display using React Flow
- **Color-Coded Nodes** - Visual distinction by type:
  - 🔵 Blue for Objects
  - 🟢 Green for Arrays
  - 🟠 Orange for Primitives
  - 🟣 Purple for Highlighted/Search Results
- **Advanced Search** - Search by JSON path (e.g., `$.user.address.city`, `items[0].name`)
  - Auto-pan to matched nodes
  - Visual highlighting
  - Match found/not found status
- **Interactive Controls**
  - Zoom In/Out/Fit View
  - Pan and navigate
  - MiniMap for large trees
- **Click to Copy** - Copy JSON path to clipboard from any node
- **Download Tree** - Export tree visualization as PNG image
- **Dark/Light Mode** - Seamless theme switching
- **Responsive Design** - Works on mobile, tablet, and desktop

### Edge Cases Handled
✅ Empty objects and arrays  
✅ Deeply nested structures (6+ levels)  
✅ Large datasets (100+ items)  
✅ Special characters in keys  
✅ Unicode and emoji support  
✅ Mixed type arrays  
✅ Null and undefined values  
✅ Invalid JSON with helpful error messages

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the configuration
   - The app will be deployed and available at your Vercel URL

3. **Build Configuration**
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Environment Variables
No environment variables are required for basic functionality.

## Usage

1. **Enter JSON Data**
   - Paste or type JSON in the input panel
   - Or click "Load Sample" to use example JSON

2. **Visualize**
   - Click "Visualize Tree" to generate the tree structure
   - Tree nodes are color-coded by type

3. **Search**
   - Type a JSON path in the search bar
   - Supported formats: `$.user.name`, `user.name`, `items[0].id`
   - Matching node will be highlighted and centered

4. **Interact**
   - Click any node to copy its JSON path
   - Use zoom controls to navigate large trees
   - Download tree as image for documentation

5. **Customize**
   - Toggle between dark and light themes
   - Clear to start over

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Flow** - Tree visualization
- **Wouter** - Lightweight routing
- **Shadcn UI** - Component library
- **html-to-image** - Image export
- **jsonpath-plus** - Path parsing

### Development Tools
- **Vite** - Build tool
- **ESBuild** - Fast bundler
- **Express** - Development server

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── json-input-panel.tsx    # JSON input UI
│   │   │   ├── tree-visualizer.tsx     # React Flow tree
│   │   │   ├── json-node.tsx           # Custom node component
│   │   │   └── theme-toggle.tsx        # Dark/light toggle
│   │   ├── lib/
│   │   │   ├── json-tree-builder.ts    # Tree construction logic
│   │   │   └── theme-provider.tsx      # Theme management
│   │   ├── pages/
│   │   │   └── home.tsx                # Main page
│   │   └── App.tsx                     # App root
│   └── index.html
├── server/
│   └── index.ts                        # Express server
├── shared/
│   └── schema.ts                       # Shared types
└── README.md
```

## Testing

The application includes comprehensive automated tests covering:
- JSON validation (invalid, empty, malformed)
- Tree rendering (simple, nested, large datasets)
- Search functionality (exact match, partial match, no match)
- User interactions (copy, zoom, download, theme toggle)
- Edge cases (unicode, special characters, null values, deep nesting)

All tests pass successfully ✅

## Design System

### Typography
- **UI Text**: Inter
- **Code/JSON**: JetBrains Mono

### Color Tokens
- Custom color tokens for node types in both light and dark modes
- Semantic color system with HSL values
- Automatic contrast adjustment

### Spacing
- Consistent 4px grid system
- Tailwind spacing utilities

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Efficient tree layout algorithm
- Debounced search (300ms)
- Optimized re-renders with React.memo
- Handles large JSON structures (100+ nodes)

## Contributing

This project was built as part of the APIWIZ Frontend Assignment. It demonstrates:
- Clean, modular code structure
- Type-safe TypeScript implementation
- Comprehensive error handling
- Exceptional UI/UX design
- Full test coverage

## License

MIT License - Feel free to use this project for learning and development.

## Assignment Requirements

All mandatory and optional features have been implemented:

### Mandatory ✅
- [x] JSON input with validation and error messages
- [x] React Flow tree visualization
- [x] Color-coded node types (objects, arrays, primitives)
- [x] Search by JSON path with highlighting
- [x] Auto-pan to matched nodes
- [x] Match found/not found messages
- [x] Zoom In/Out/Fit View controls
- [x] Pan canvas navigation
- [x] Node information on hover

### Optional Bonuses ✅
- [x] Dark/Light mode toggle
- [x] Clear/Reset button
- [x] Click node to copy JSON path
- [x] Download tree as image
- [x] Sample JSON loading
- [x] Responsive design
- [x] Beautiful empty states
- [x] Comprehensive automated testing

## Acknowledgments

- Built with React Flow for tree visualization
- Styled with Tailwind CSS and Shadcn UI
- Icons from Lucide React
- Fonts from Google Fonts

---

**Built with ❤️ for the APIWIZ Frontend Assignment**
