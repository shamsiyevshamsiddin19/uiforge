import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.v1.endpoints import components

app = FastAPI(
    title="UIForge API",
    description="Interactive UI Components & FastAPI Live Telemetry",
    version="1.0.0",
    docs_url=None,       # Ochiq tarmoqda API sxemasi va Swagger ko'rinmasligi uchun yopildi
    redoc_url=None,      # ReDoc dokumentatsiyasini o'chiramiz
    openapi_url=None     # openapi.json faylini begonalarga ko'rsatmaslik
)

# 1. CORS sozlamalari:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Komponentlar uchun API router:
app.include_router(components.router, prefix="/components", tags=["Components"])

# 3. Frontend statik sahifalarini ulash (External CSS & JS bilan birga):
frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend"))
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
else:
    @app.get("/")
    def home():
        return {"message": "UIForge API is running! Frontend path not found."}
