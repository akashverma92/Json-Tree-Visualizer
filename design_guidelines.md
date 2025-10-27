# Design Guidelines: JSON Tree Visualizer

## Design Approach

**System Selected:** Material Design 3 / Developer Tool Aesthetic

This is a utility-focused application for developers, requiring clarity, efficiency, and information density. The design draws inspiration from modern developer tools like VS Code, Chrome DevTools, and Linear's clean interface principles, adapted for data visualization needs.

## Layout Architecture

### Primary Layout Structure
Split-panel workspace design:
- Left Panel (Input Section): 35-40% width on desktop, collapsible on mobile
- Right Panel (Visualization Canvas): 60-65% width, full-screen on mobile
- Top Navigation Bar: Fixed height (56px-64px)
- Use `flex` layout with resizable divider between panels

### Viewport Management
- Application fills full viewport height (100vh)
- No scrolling on main canvas - React Flow handles internal panning
- Input panel scrolls independently when content overflows
- Mobile: Stack panels vertically with tab-based switching

### Spacing System
Use Tailwind spacing primitives: **2, 3, 4, 6, 8, 12, 16**
- Component padding: p-4 to p-6
- Section gaps: gap-4 to gap-6
- Button spacing: px-4 py-2 to px-6 py-3
- Canvas margins: Minimal (p-2 for controls overlay)

## Typography Hierarchy

### Font Families
- **Primary UI Text:** Inter or Roboto (via Google Fonts CDN)
- **Code/JSON Display:** JetBrains Mono or Fira Code (monospace)

### Type Scale
- **Page Title/Branding:** text-2xl font-bold (24px)
- **Section Headers:** text-lg font-semibold (18px)
- **Body Text:** text-base (16px)
- **Labels/Controls:** text-sm font-medium (14px)
- **JSON Code:** text-sm font-mono (14px monospace)
- **Helper Text:** text-xs (12px)

### Text Treatment
- Maintain consistent line-height: leading-relaxed (1.625) for readability
- Use font-medium for emphasis, font-bold sparingly
- Code blocks: Add subtle background treatment, rounded corners (rounded-md)

## Component Library

### Navigation Bar
**Structure:**
- App title/logo (left-aligned)
- Mode toggle button (Dark/Light) - positioned right
- Minimal padding (px-6 py-3)
- Subtle border bottom

### Input Panel Components

**JSON Text Area:**
- Full-width with monospace font
- Minimum height: 300px, resizable
- Border with rounded corners (rounded-lg)
- Focus state with enhanced border treatment
- Placeholder: Sample JSON with formatting (indented)

**Control Buttons:**
- Primary action (Visualize): Larger, prominent styling (px-6 py-2.5)
- Secondary actions (Clear/Reset): Standard size (px-4 py-2)
- Button group: gap-3 spacing, flex-wrap for responsive
- Use icon + text combinations

**Validation Message:**
- Alert-style component below textarea
- Icon + message layout
- Distinct treatment for error vs success states
- Rounded corners (rounded-md), padding (px-4 py-3)

**Search Bar:**
- Prominent placement above tree visualization
- Icon prefix (search/magnifying glass from Heroicons)
- Full-width input with rounded corners (rounded-lg)
- Clear button (X) when text present
- Match counter display: "2 of 5 matches" inline with search

### Visualization Canvas

**React Flow Container:**
- Full panel width/height
- No visible borders - seamless integration
- Controls positioned as floating overlays

**Zoom Controls:**
- Floating button group (bottom-right or top-right)
- Vertical stack: Zoom In (+), Fit View (⊡), Zoom Out (-)
- Rounded container (rounded-lg) with subtle shadow
- Icon-only buttons (w-10 h-10)
- Fixed positioning with margin (m-4)

**Node Information Tooltip:**
- Appears on hover near cursor
- Small rounded container (rounded-md)
- Max-width constraint (max-w-xs)
- Path display: Monospace font, truncate if needed
- Value preview: Truncated with ellipsis

### Tree Node Design

**Node Structure (All Types):**
- Rectangular containers with rounded corners (rounded-md)
- Consistent padding (px-4 py-2)
- Border treatment (2px border)
- Min-width for small nodes (min-w-[100px])

**Type Differentiation (Referenced in assignment):**
- Objects: Blue-family border/accent
- Arrays: Green-family border/accent
- Primitives: Orange-family border/accent
- Use border + subtle background tint for distinction

**Node Content Layout:**
- Icon/Type indicator (left): Small icon from Heroicons
- Label (center): font-medium text
- Badge for arrays showing count: [5] in smaller text
- Primitives show value inline or truncated

**Search Highlight State:**
- Distinct border treatment (thicker, different color)
- Optional: Subtle glow/shadow effect
- Ensure high contrast for visibility

### Interactive Elements

**Buttons:**
- Primary: Larger, bold font-weight
- Secondary: Standard weight, subtle treatment
- Icon buttons: Square (w-10 h-10), centered icon
- Disabled state: Reduced opacity (opacity-50)
- Hover: Subtle scale transform (scale-105 transition)

**Clickable Nodes:**
- Cursor pointer on hover
- Subtle hover state (enhanced border or shadow)
- Active/selected state for copied path indication
- Transition: all transitions smooth (transition-all duration-200)

## Interaction Patterns

### JSON Input Flow
1. User pastes/types JSON → Real-time character count (optional)
2. Click Visualize → Loading state on button
3. Validation → Show inline error or success
4. Tree renders → Smooth transition, auto-fit view

### Search Behavior
1. Type in search bar → Debounced search (300ms)
2. First match: Highlight + auto-pan to center
3. Multiple matches: Show counter, cycle through with Enter
4. Clear search: Remove highlights, reset view

### Node Interactions
1. Hover: Show tooltip with full path + value
2. Click: Copy path to clipboard → Brief toast notification
3. No double-click behavior (keep simple)

### Download Feature
- Button in control panel or floating with zoom controls
- Click → Generate PNG/SVG of current view
- Brief loading state → Download triggers
- Success toast: "Tree downloaded as image"

## Responsive Behavior

### Desktop (lg: 1024px+)
- Side-by-side split panel layout
- All features visible simultaneously
- Resizable divider between panels

### Tablet (md: 768px - 1023px)
- Maintain split layout but reduce margins
- Zoom controls move to top-right compact position
- Reduce padding throughout (p-3 instead of p-4)

### Mobile (< 768px)
- Tab-based interface: "Input" and "Visualization" tabs
- Full-width panels, stack vertically
- Zoom controls: Compact horizontal strip at bottom
- Search bar: Sticky at top of visualization tab
- Larger touch targets (min-height: 44px for buttons)

## Additional Features

### Dark/Light Mode
- Toggle button in navigation bar (moon/sun icon)
- Persist preference in localStorage
- Smooth transition between modes (transition-colors duration-300)
- Ensure sufficient contrast for all node types in both modes

### Toast Notifications
- Top-right corner positioning (fixed, top-4 right-4)
- Auto-dismiss after 3 seconds
- Icon + message layout
- Success, error, info variants
- Slide-in animation from right

### Loading States
- Skeleton for tree on initial load
- Button spinner for Visualize action
- Subtle loading indicator for search operations

## Accessibility Considerations

- All interactive elements keyboard accessible (tab navigation)
- Focus visible states (ring treatment on focus)
- ARIA labels for icon-only buttons
- Screen reader announcements for search results
- Sufficient contrast ratios throughout
- Skip-to-content link for keyboard users

## Assets & Icons

**Icon Library:** Heroicons (via CDN)
- Navigation: menu, x-mark, sun, moon
- Actions: magnifying-glass, arrow-path (reset), clipboard-document
- Zoom: plus, minus, arrows-pointing-out
- Node types: cube (object), queue-list (array), variable (primitive)
- Status: check-circle, x-circle, information-circle

**No Images Required:** This is a pure UI application with no hero section or marketing content

## Performance Considerations

- Lazy load React Flow only when needed
- Debounce search input (300ms)
- Virtual scrolling for large JSON trees (React Flow handles this)
- Optimize re-renders: memo() for node components
- Limit tree depth visualization for extremely deep JSON (warn user)

## Edge Case Design Handling

- Empty JSON: Show placeholder state with helpful message
- Invalid JSON: Clear error message with line number if possible
- Very large JSON: Warning message + option to proceed
- No search results: Friendly "No matches found" message with suggestion
- Network errors (if loading samples): Retry UI with error state

This design creates a professional, developer-focused tool that balances functionality with clean aesthetics, ensuring usability across all device sizes while maintaining visual consistency.