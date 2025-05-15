from typing import List

import uvicorn
from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import FileResponse
from starlette import status
from starlette.responses import RedirectResponse
from starlette.staticfiles import StaticFiles
from pydantic import BaseModel

class Ingredient(BaseModel):
    amount: int
    measure: str
    ingredientName: str
class Recipe(BaseModel):
    recipeName: str
    recipeIngredients: List[Ingredient] | None
    recipeDescription: str | None # Not required field


# app = FastAPI()
app = FastAPI()

app.mount("/static",
          StaticFiles(directory=Path(__file__).parent.absolute() / "static"),
          name="static")

@app.get("/")
def home_root():
    return FileResponse("templates/index.html")

@app.get("/submit-recipe")
async def create_recipe(recipe: Recipe):
    print(recipe.recipeName)
    print(recipe.recipeIngredients)
    return {"recipeName": recipe.recipeName,
            "containerIngredientsInputs": recipe.recipeIngredients,
            "message": "complete"}



# @app.post("/submit-recipe")
# async def create_recipe(recipe: Recipe):
#     return {"recipeName": recipe.recipeName,
#             "containerIngredientsInputs": recipe.recipeIngredients,
#             "message": "complete"}


# @app.get("/submit-recipe")
# async def create_recipe(recipe: Recipe):
#     return {"recipeName": recipe.recipeName, "containerIngredientsInputs": recipe.recipeIngredients,  "message": "done"}




# For autoreload without stuck
if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)