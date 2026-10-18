from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.component import Component
from app.schemas.component import ComponentCreate, ComponentResponse

router = APIRouter()


@router.post("/", response_model=ComponentResponse, status_code=status.HTTP_201_CREATED)
def create_component(
    component_in: ComponentCreate,
    db: Session = Depends(get_db),
):
    existing = db.query(Component).filter(Component.slug == component_in.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Component with slug '{component_in.slug}' already exists."
        )

    db_component = Component(
        name=component_in.name,
        slug=component_in.slug,
        description=component_in.description,
        status=component_in.status,
    )

    db.add(db_component)
    db.commit()
    db.refresh(db_component)

    return db_component 


@router.get("/", response_model=list[ComponentResponse])
def get_components(db: Session = Depends(get_db)):
    return db.query(Component).all()


@router.get("/dropdown/options")
def get_dropdown_options():
    return [
        {"label": "Barcha komponentlar", "value": "all"},
        {"label": "Tugmalar (Buttons)", "value": "button"},
        {"label": "Kiritish maydonlari (Inputs)", "value": "input"},
    ]


@router.get("/dropdown/inspect")
def inspect_dropdown_action(
    selected_option: str = Query(default="button", description="tanlangan komponent"),
    db: Session = Depends(get_db) 
):
    if selected_option == "all":
        sql_string = "SELECT * FROM components;"
        result_data = db.query(Component).all()
    else:
        sql_string = f"SELECT * FROM components WHERE status = 'draft' AND slug ILIKE '%{selected_option}%';"
        result_data = db.query(Component).filter(Component.slug.ilike(f"%{selected_option}%")).all()

    return {
        "telemetry": {
            "http_request": {
                "method": "GET",
                "endpoint": f"/components/dropdown/inspect?selected_option={selected_option}",
                "status_code": 200,
            },
            "pydantic_validation": {
                "param_name": "selected_option",
                "received_value": selected_option,
                "expected_type": "string",
                "validation_status": "valid",
            },
            "executed_sql": sql_string,
        },
        "response_data": result_data
    }


@router.get("/{slug}", response_model=ComponentResponse)
def get_component(slug: str, db: Session = Depends(get_db)):
    component = db.query(Component).filter(Component.slug == slug).first()
    if not component:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"'{slug}' nomli komponent topilmadi",
        )
    return component
