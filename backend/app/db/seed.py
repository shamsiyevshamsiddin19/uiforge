from app.db.base import SessionLocal
from app.models.component import Component

def seed():
    db = SessionLocal()
    try:
        initial_components = [
            {"name": "Button", "slug": "button", "status": "draft", "description": "Interactive primary button component"},
            {"name": "Input", "slug": "input", "status": "draft", "description": "Standard text input component"},
        ]
        for comp_data in initial_components:
            existing = db.query(Component).filter(Component.slug == comp_data["slug"]).first()
            if not existing:
                comp = Component(**comp_data)
                db.add(comp)
        db.commit()
        print("Database seeding completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
