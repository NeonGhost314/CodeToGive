# Athena Project - Hackathon Quick Start

## Overview

Full-stack monorepo with Flask backend and Angular frontend, optimized for team collaboration.

## Project Structure

```
CodeToGive/
├── backend/          # Flask API (Python)
│   ├── routes/       # API route definitions
│   ├── models/       # Database models
│   ├── services/     # Business logic
│   └── config/       # Configuration files
├── frontend/         # Angular app (TypeScript)
│   └── src/app/
│       ├── components/  # Reusable components
│       ├── pages/       # Page-level components
│       └── shared/      # Shared utilities and types
└── .gitignore
```

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

### Automated Setup (Recommended)

```powershell
# One-time setup - installs all dependencies
.\setup.ps1

# Configure environment
cd backend
copy .flaskenv.example .flaskenv
cd ..

# Start both servers
.\start-dev.ps1
```

Or start separately:
```powershell
# Terminal 1 - Backend
.\start-backend.ps1

# Terminal 2 - Frontend
.\start-frontend.ps1
```

**Servers:**
- Backend: http://127.0.0.1:5000
- Frontend: http://localhost:4200

### Manual Setup

#### Backend Setup

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
# Copy .flaskenv.example to .flaskenv and configure
flask run
```

Backend runs on: http://127.0.0.1:5000

#### Frontend Setup

```powershell
cd frontend
npm install
npm run dev  # Uses proxy configuration
```

Frontend runs on: http://localhost:4200

## Development Workflow

### Backend Development

- Add new routes in `backend/routes/` directory
- Create one file per feature domain (e.g., `auth.py`, `users.py`)
- Register blueprints in `app.py`
- Add business logic in `backend/services/`
- Define database models in `backend/models/`

### Frontend Development

- Create reusable components in `frontend/src/app/components/`
- Create page components in `frontend/src/app/pages/`
- Add shared utilities in `frontend/src/app/shared/`
- Use Angular CLI: `ng generate component components/name`

## Directory Structure Guide

### Backend

- `routes/` - API endpoints organized by feature
- `models/` - Database models using SQLAlchemy
- `services/` - Business logic and reusable functions
- `config/` - Application configuration and settings

### Frontend

- `components/` - Reusable UI components
- `pages/` - Page-level components for routes
- `shared/` - Interfaces, utilities, and constants
- `services/` - HTTP services for API calls

## Team Collaboration

- Each developer can work on separate route files or components
- Use feature branches for new functionality
- Keep routes thin, move logic to services
- Follow the existing structure for consistency

## API Endpoints

- `GET /api/test` - Test endpoint to verify connection

## Environment Variables

Backend uses `.flaskenv` for configuration (not committed to git).

1. Copy `backend/.flaskenv.example` to `backend/.flaskenv`
2. Configure the variables as needed
3. Default values work for local development

## Testing

Backend: Run Flask in debug mode for auto-reload
Frontend: Angular dev server supports hot-reload

## Additional Resources

- **[QUICKSTART.md](QUICKSTART.md)** - setup guide

## Troubleshooting

- If CORS errors occur, ensure backend is running on port 5000
- If proxy errors occur, check `proxy.conf.json` configuration
- Ensure virtual environment is activated for backend
- Ensure Node modules are installed for frontend
- Run `.\setup.ps1` if you encounter dependency issues

