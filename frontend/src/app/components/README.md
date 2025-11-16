# Components Directory

## Purpose

This directory contains reusable Angular components that can be used across multiple pages.

## Structure

- Each component has its own folder with .ts, .html, and .scss files
- Components are self-contained and reusable
- Components communicate via @Input and @Output decorators

## Usage

- Create components for UI elements used in multiple places
- Examples: header, footer, card, button, modal, form inputs
- Use Angular CLI: `ng generate component components/component-name`

## Example Structure

```
components/
  header/
    header.component.ts
    header.component.html
    header.component.scss
  card/
    card.component.ts
    card.component.html
    card.component.scss
```

