# Component Template

## Using the Template

To create a new component:

1. Copy the entire `_template` folder
2. Rename the folder to your component name (e.g., `header`, `footer`, `card`)
3. Rename all files:
   - `_template.component.ts` → `your-component.component.ts`
   - `_template.component.html` → `your-component.component.html`
   - `_template.component.scss` → `your-component.component.scss`
4. Replace all occurrences in code:
   - `Template` → `YourComponent` (PascalCase)
   - `template` → `your-component` (kebab-case)
   - `app-template` → `app-your-component` (selector)
5. Update the component class name, selector, and file references

## Using Angular CLI (Recommended)

Alternatively, use Angular CLI:

```powershell
cd frontend
ng generate component components/your-component-name
```

Then copy the structure from the template.

## Component Structure

- **TypeScript (.ts)**: Component logic, properties, methods
- **HTML (.html)**: Component template
- **SCSS (.scss)**: Component styles

## Component Communication

- **@Input()**: Receive data from parent
- **@Output()**: Emit events to parent
- **Services**: Share data across components

## Example

```typescript
// Parent component
<app-header [title]="pageTitle" (menuClick)="handleMenuClick($event)"></app-header>

// Child component (header)
@Input() title: string;
@Output() menuClick = new EventEmitter();
```

