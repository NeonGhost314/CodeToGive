# Frontend Directory

## Purpose

Angular single-page application frontend.

## Structure

- `src/app/` - Application source code
  - `components/` - Reusable UI components
  - `pages/` - Page-level components for routes
  - `shared/` - Shared utilities, interfaces, constants
  - `services/` - HTTP services for API communication
- `angular.json` - Angular CLI configuration
- `proxy.conf.json` - Proxy configuration for API calls
- `package.json` - Node.js dependencies

## Quick Start

```powershell
npm install
ng serve -o
```

## Adding New Features

1. Create components in `components/` for reusable UI
2. Create pages in `pages/` for route views
3. Add shared code in `shared/` directory
4. Use Angular CLI: `ng generate component components/name`

## Development Guidelines

- Use components for reusable UI elements
- Keep pages focused on composition
- Share code through shared directory
- Use services for API communication
- Follow Angular style guide
