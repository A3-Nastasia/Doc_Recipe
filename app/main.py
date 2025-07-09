import os
from typing import List, Optional, Union

import uvicorn
from fastapi import FastAPI, Request, UploadFile, File, Response, status, Query
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, validator
from starlette.responses import HTMLResponse, JSONResponse
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

from doc_creating_params import DocRecipe


class Recipe(BaseModel):
    recipeName: str
    recipeIngredients: Optional[List[Ingredient]] | None
    recipeDescription: Optional[str] | None # Not required field

current_project_dir = os.path.dirname(__file__)


app = FastAPI()

templates = Jinja2Templates(directory="app/templates")

app.mount("/app/static", StaticFiles(directory="app/static"), name="app/static")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    formatted_errors = []
    for err in errors:
        loc = " -> ".join(str(x) for x in err['loc'] if x != 'body')
        msg = err['msg']
        formatted_errors.append({"field": loc, "message": msg})

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"errors": formatted_errors}
    )


@app.post("/recipes/create")
def create_recipe(recipe: Recipe):

    test_doc = DocRecipe(os.path.join(current_project_dir, "Recipes", f"{recipe.recipeName}.docx"))
    test_doc.create_doc(recipe.recipeName,
                        recipe.recipeIngredients,
                        recipe.recipeDescription,
                        table_grid=False)
    return {"message": "recipe created"}


@app.get("/download")
def download_file(recipeName: str = Query(...)):
    safe_name = os.path.basename(recipeName) + ".docx"
    path_to_file = os.path.join(current_project_dir, "Recipes", safe_name)

    if not os.path.exists(path_to_file):
        return {"detail": "File does not exist"}

    print(os.path.join(current_project_dir, safe_name))

    with open(path_to_file, "rb") as f:
        content = f.read()
    headers = {
        'Content-Disposition': f'attachment; filename="{safe_name}"'
    }
    return Response(content=content,
                    media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    headers=headers)

# For autoreload without stuck
if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)