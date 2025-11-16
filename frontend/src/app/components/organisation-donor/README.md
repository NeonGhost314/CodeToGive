# Organisation Donor Component

This component provides information about corporate sponsorship opportunities with Shield of Athena.

## Purpose

The `OrganisationDonorComponent` is designed to encourage corporate donations and sponsorships by providing:

- Information about becoming a sponsor
- Access to sponsorship forms
- Contact information for inquiries

## Features

- **Title Section**: "Become a sponsor"
- **Description**: Explains the sponsorship program and how corporations can get involved
- **Sponsorship Form**: Downloadable PDF form (`Sponsorship_Forms_ENFR_2025.pdf`)
- **Contact Information**:
  - Phone: 514-274-8117 (clickable to call)
  - Email: EVENEMENT@BOUCLIERDATHENA.COM (clickable to compose email)

## Usage

```html
<app-organisation-donor></app-organisation-donor>
```

## Location

Currently integrated into the donation page (`donation-page.component.html`) in the left column, below the "Make a donation" section.

## Styling

The component features:
- Responsive design with mobile optimization
- Gradient background for visual appeal
- Interactive buttons with hover effects
- Clean typography and spacing
- Accessible color contrast

## Files

- `organisation-donor.component.ts` - Component logic
- `organisation-donor.component.html` - Template
- `organisation-donor.component.scss` - Styling
- `README.md` - This documentation

## Dependencies

- Angular CommonModule
- Assets: `Sponsorship_Forms_ENFR_2025.pdf`