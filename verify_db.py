from sqlalchemy import text
from Backend.database.database import init_db, engine
init_db()
with engine.connect() as conn:
    result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"))
    print([row[0] for row in result])
