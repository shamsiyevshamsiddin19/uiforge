# UIForge — FastAPI Component Studio & Live Telemetry

**UIForge** — FastAPI va zamonaviy web-komponentlar arxitekturasini o'rganish uchun mo'ljallangan interaktiv platforma. OpenAI minimalist dizayn tizimi asosida yaratilgan.

## Asosiy Imkoniyatlar
- **Interactive UI Components:** Sof va zamonaviy dropdown, qidiruv va boshqa interaktiv komponentlar.
- **Live Backend Telemetry:** Real vaqtda bajarilgan SQL so'rovlari, Pydantic validatsiya natijalari, HTTP holati va server kechikishi (`latency ms`).
- **Clean Architecture:** FastAPI Router, Pydantic Schemas, SQLAlchemy ORM va PostgreSQL integratsiyasi.
- **Dark & Light Mode:** OLED Black va High-Contrast Light mavzulari.

## Texnologiyalar
- **Backend:** FastAPI, Python 3.12, SQLAlchemy, Pydantic, PostgreSQL
- **Frontend:** Vanilla HTML5, CSS3 (OpenAI Design System), JavaScript (ES Modules)

## Ishga Tushirish (Quick Start)

### 1. Virtual Muhit va Bog'liqliklar
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Serverni Ishga Tushirish
```bash
uvicorn app.main:app --reload --port 8000
```
Brauzeringizda oching: `http://127.0.0.1:8000/`
