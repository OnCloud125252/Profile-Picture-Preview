# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
A Next.js 15.5.2 application that allows users to upload profile pictures and preview how they appear across different social media platforms (Discord, Facebook, GitHub, Instagram, LinkedIn, Slack, Twitter, WhatsApp).

## Development Commands

```bash
# Install dependencies
bun install

# Run development server with Turbopack
bun dev

# Build for production with Turbopack
bun build

# Start production server
bun start

# Lint code with Biome
bun lint

# Format code with Biome
bun format
```

## Architecture & Key Patterns

### Component Structure
- **Client Components**: Main app uses "use client" directive for interactive features
- **Preview Components**: Each platform has its own preview component in `src/components/previews/`
- **UI Components**: Using shadcn/ui components in `src/components/ui/` with New York style variant
- **State Management**: Local React state with useState, no global state management
- **Custom Hooks**: Image manipulation logic extracted to custom hooks (`useImageDrag`, `useImageZoom`)

### Styling Approach
- Tailwind CSS v4 with PostCSS plugin
- CSS variables for theming in `src/app/globals.css`
- Utility-first approach with `cn()` helper from `src/lib/utils.ts`
- Dark mode support via class strategy with platform-specific colors

### File Upload & Image Processing
The ImageUploader component uses:
- Drag-and-drop with FileReader API
- Client-side image compression using `@thaparoyal/image-compression`
- Base64 data URLs for image display
- Automatic upscaling to ensure minimum 2400px dimension
- Memory leak prevention with URL.revokeObjectURL

### Image Editor Features
- Canvas-based image editing with pan and zoom
- Fixed window debounce for performance optimization
- Real-time file size calculation with human-readable formatting
- Touch support for mobile devices
- Constrained positioning to prevent image gaps

## Code Style & Tools

### Biome Configuration
- 2-space indentation
- Double quotes for strings
- Semicolons required
- 80-character line width
- Trailing commas enabled

### TypeScript
- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Check all TypeScript errors before committing

## Coding Standards

### Naming Conventions

#### Variables & Functions
- **Variables**: camelCase (e.g., `imageElement`, `compressionOptions`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_CANVAS_SIZE`, `MAX_SCALE`)
- **Functions**: camelCase with descriptive verbs (e.g., `handleFileUpload`, `calculateImageFileSize`)
- **Boolean variables**: Start with is/has/should (e.g., `isLoading`, `hasPendingUpdate`, `shouldCompress`)
- **Event handlers**: Start with "handle" (e.g., `handleMouseDown`, `handleDragStart`)
- **Callbacks**: Start with "on" when passed as props (e.g., `onImageEdit`, `onReupload`)

#### React Components & Hooks
- **Components**: PascalCase (e.g., `ImageEditor`, `PreviewCard`)
- **Custom Hooks**: Start with "use" in camelCase (e.g., `useImageDrag`, `useMobileDetector`)
- **Component props interfaces**: ComponentName + "Props" (e.g., `ImageEditorProps`)

#### Types & Interfaces
- **Interfaces**: PascalCase, prefer singular nouns (e.g., `Dimensions`, `Position`)
- **Type aliases**: PascalCase (e.g., `ImageFormat`, `ScaleRange`)
- **Enums**: PascalCase for name, UPPER_SNAKE_CASE for values

### File & Directory Naming

#### Files
- **Components**: kebab-case.tsx (e.g., `image-editor.tsx`, `preview-card.tsx`)
- **Hooks**: kebab-case.ts with "use-" prefix (e.g., `use-image-drag.ts`)
- **Utilities**: kebab-case.ts (e.g., `image-utils.ts`, `format-helpers.ts`)
- **Types**: kebab-case.types.ts (e.g., `image.types.ts`)
- **Constants**: kebab-case.constants.ts (e.g., `platform.constants.ts`)

#### Directories
- Always use kebab-case (e.g., `components/`, `hooks/`, `lib/`)
- Group related components in subdirectories (e.g., `components/upload/`, `components/previews/`)

### Code Organization

#### Component Structure
1. Interface/Type definitions
2. Constants
3. Component function
4. Helper functions (prefer extracting to hooks or utils)
5. Export statement

#### Comments & Documentation
- Use JSDoc only for complex functions
- Inline comments only for non-obvious logic
- Prefer self-documenting code over comments
- Non-essential comments should be removed

### Best Practices

#### React Patterns
- Prefer function components with hooks
- Use `useCallback` for functions passed to child components
- Use `useMemo` for expensive computations
- Extract complex logic to custom hooks
- Keep components focused and single-purpose

#### Performance
- Use `requestAnimationFrame` for animations and canvas operations
- Implement debouncing for expensive operations
- Clean up resources (timers, RAF, object URLs) in cleanup functions
- Use `React.memo` sparingly and only when proven necessary

#### Error Handling
- Always handle edge cases (null checks, empty states)
- Provide meaningful error messages
- Use try-catch for async operations
- Gracefully degrade functionality when features unavailable

## Important Notes

1. **No Testing Framework**: Currently no tests exist. When adding tests, check with user for preferred framework.

2. **Client-Side Only**: This is a purely client-side application with no API routes or server components beyond the root layout.

3. **Image Handling**: All image processing happens client-side using FileReader API and data URLs.

4. **Component Conventions**: When adding new preview components, follow the existing pattern in `src/components/previews/` with consistent prop interfaces.

5. **Turbopack**: Both dev and build scripts use Turbopack for faster bundling.