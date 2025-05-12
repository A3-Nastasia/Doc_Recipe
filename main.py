import uvicorn
from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import FileResponse
from starlette.staticfiles import StaticFiles

app = FastAPI()

app.mount("/static",
          StaticFiles(directory=Path(__file__).parent.absolute() / "static"),
          name="static")

@app.get("/")
def home_root():
    return FileResponse("templates/index.html")

# For autoreload without stuck
if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)