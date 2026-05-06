# Backend Setup Guide

## Prerequisites

Make sure the following are installed on your local system:

- Python
- PostgreSQL

Also ensure PostgreSQL service is running locally.

---

## 1. Go to backend folder

```powershell
cd backend
```

---

## 2. Activate virtual environment

```powershell
.\.venv\Scripts\Activate.ps1
```

---

## 3. Install dependencies

```powershell
pip install -r requirements.txt
```

---

## 4. Configure environment variables

Create a `.env` file and add your PostgreSQL database URL.

Example:

```env
DATABASE_URL=postgresql+psycopg://username:password@localhost/dbname
```

---

## 5. Run database migrations

```powershell
alembic upgrade head
```

---

## 6. Run FastAPI server

```powershell
python -m uvicorn app.main:app --reload
```

---

## 7. Open Swagger API Docs

```txt
http://127.0.0.1:8000/docs
```

---

## 8. Stop server

```txt
CTRL + C
```