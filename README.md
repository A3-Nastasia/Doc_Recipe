## Site for entering information about recipe and getting it in file format

To run fastapi use command:
```
uvicorn main:app --reload
```

---


### Text formating tools

Font style:
- make text **bold**;
- make text *italic*.

Justify:
- left;
- center;
- right;
- full.

This app would be good with Flask but I wanted to get to know Fastapi.

## Ingredient
Restrictions:
- Only digitals.
- Only 3 decimal places (Like 1.001).
- Only one `.` or `,`.

You can dynamically add an ingredient to the page with button "+ ингредиент".

To see restrictions move mouse to the input for amount of the ingredient. The message will be displayed above.

To delete the ingredient click button "Удалить".