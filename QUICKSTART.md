# Quick Start - CodeToGive

Get up and running in 2 minutes ⚡

## First Time Setup

```powershell
# 1. Install dependencies
.\setup.ps1

# 2. Configure environment (one-time)
cd backend
copy .flaskenv.example .flaskenv
cd ..
```

## Daily Development

```powershell
# Start both servers
.\start-dev.ps1
```

Or separately:
```powershell
.\start-backend.ps1    # Terminal 1
.\start-frontend.ps1   # Terminal 2
```

## Verify

- Backend: http://127.0.0.1:5000/api/test
- Frontend: http://localhost:4200

---

**Need more details?** See [README.md](README.md) for full documentation, troubleshooting, and development workflow.
