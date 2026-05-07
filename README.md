# Intro - Incident Log Dashboard

Incident Log Dashboard is a full stack app for logging, browsing, filtering, and analyzing operational incidents such as outages, security events, and bug reports. The repo contains a React + TypeScript frontend and a FastAPI + PostgreSQL backend.

## Tech Stack

| Layer | Technology |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| State / Data Fetching | TanStack React Query |
| Charts | Recharts |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| ORM / Migrations | SQLAlchemy, Alembic |

## Repository Structure

Secureyes/
├── frontend/           React + TypeScript app
├── backend/            FastAPI app, database models, migrations
├── docker-compose.yml  Run full app in one command (pre: docker)
└── README.md           Full project setup guide

## Prerequisites

Install these before starting:
- Node.js 20 or newer
- Python 3.11 or newer
- PostgreSQL 14 or newer
- Docker?

# If you have Docker Desktop running in your system:
- Just follow below steps only
    - Run `docker compose up --build` from \Secureyes root dir
    - Wait for the containers to finish starting, then 
        - Open: Frontend: http://localhost:5173
                Backend : http://localhost:8000/health

- No local setup required if all is good and working

# Local Setup Overview

Run the backend first, then run the frontend.
- Backend API: `http://localhost:8000`
- Frontend app: `http://localhost:5173`
- Swagger docs: `http://localhost:8000/docs`

## 1. Clone and Open the Project

git clone repo-url
cd Secureyes

## 2. Set Up PostgreSQL
Create a local PostgreSQL database and make sure the PostgreSQL service is running.

Suggested local database values used by this project:

- Database name: `incident_dashboard`
- Username: `incident_user`
- Password: `incident_password`
- Port: `5432`

Example SQL:

```sql
CREATE USER incident_user WITH PASSWORD 'incident_password';
CREATE DATABASE incident_dashboard OWNER incident_user;
```

If you already have your own PostgreSQL user and database, that is fine too. Just use your own connection string in the backend `.env` file in the next step.

## 3. Backend Setup

Open a terminal in the repo root and run:

cd backend
python -m venv .venv

### Activate the backend virtual environment
.\.venv\Scripts\Activate.ps1

### Install backend dependencies
pip install -r requirements.txt

### Configure backend environment variables
Create `.env` file (backend root)

Default value inside `.env`:

DATABASE_URL=postgresql+psycopg://incident_user:incident_password@localhost:5432/incident_dashboard (`for local development only`)

### Run database migrations
alembic upgrade head

### Start the backend server
uvicorn app.main:app --reload


## 4. Frontend Setup

Open a second terminal in the repo root and run:
cd frontend
npm install

### Start the frontend dev server
npm run dev

The frontend is already configured to proxy `/api` requests to the backend running on port `8000`.

## 5. Open the App

Once both servers are running:

- Open `http://localhost:5173`
- Navigate to the dashboard and incidents pages
- Use `http://localhost:8000/docs` to test backend endpoints directly or use postman (you can use postman JSON file at backend root dir `postman_collection.json`)

API Summary
- `GET /health`
- `GET /api/v1/incidents`
- `POST /api/v1/incidents`
- `GET /api/v1/incidents/{id}`
- `PUT /api/v1/incidents/{id}`
- `DELETE /api/v1/incidents/{id}`
- `GET /api/v1/stats`

## Common Run Commands
### Backend
cd backend
.\.venv\Scripts\Activate.ps1
alembic upgrade head
uvicorn app.main:app --reload

### Frontend
cd frontend
npm install
npm run dev

## Notes for New Developers
- Start PostgreSQL first
- Start the backend second
- Start the frontend last
- Keep backend and frontend running in separate terminals
- If backend models change, run a new Alembic migration before testing
