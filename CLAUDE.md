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

### Styling Approach
- Tailwind CSS v4 with PostCSS plugin
- CSS variables for theming in `src/app/globals.css`
- Utility-first approach with `cn()` helper from `src/lib/utils.ts`
- Dark mode support via class strategy

### File Upload Pattern
The ImageUploader component uses:
- Drag-and-drop with FileReader API
- Client-side image processing
- Base64 data URLs for image display
- No server-side image handling

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

## Important Notes

1. **No Testing Framework**: Currently no tests exist. When adding tests, check with user for preferred framework.

2. **Client-Side Only**: This is a purely client-side application with no API routes or server components beyond the root layout.

3. **Image Handling**: All image processing happens client-side using FileReader API and data URLs.

4. **Component Conventions**: When adding new preview components, follow the existing pattern in `src/components/previews/` with consistent prop interfaces.

5. **Turbopack**: Both dev and build scripts use Turbopack for faster bundling.