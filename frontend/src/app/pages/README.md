# Pages Directory

## Purpose

This directory contains page-level components that represent different views or routes in the application.

## Structure

- Each page is a component with its own folder
- Pages are typically associated with routes
- Pages can use components from the components directory

## Usage

- Create one page component per route
- Pages compose smaller components together
- Use Angular CLI: `ng generate component pages/page-name`

## Example Structure

```
pages/
  home/
    home.component.ts
    home.component.html
    home.component.scss
  login/
    login.component.ts
    login.component.html
    login.component.scss
  dashboard/
    dashboard.component.ts
    dashboard.component.html
    dashboard.component.scss
```

