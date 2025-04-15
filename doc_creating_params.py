from docx import Document
import os
from docx.shared import Pt, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK

# Saving file and checking if it's opened
def save_docx(doc, doc_path, doc_name):
    try:
        doc.save(doc_name)
        print("File saved on path", doc_path)
    except PermissionError:
        print(f"Error: The file {doc_name} is currently in use. Please close it and try again.")


def set_doc_format(doc):
    # Set font size as default for all doc
    style = doc.styles["Normal"]
    style.font.size = Pt(14)

    # Set margin for sheet(-s)
    section = doc.sections[0]
    section.top_margin = Cm(1)
    section.right_margin = Cm(1)
    section.left_margin = Cm(1)
    section.bottom_margin = Cm(1)

    # Set none paragraph space after
    style.paragraph_format.space_after = 0

# Set colunm width in Cm
def set_table_col_width(col_id, width_in_cm):
    for cell in table.columns[col_id].cells:
        cell.width = Cm(width_in_cm)


doc_name = "Recipe_template.docx"
doc_path = os.path.join(os.getcwd(), doc_name)

recipe_name = "Recipe_name"

# Create doc object
doc = Document()

set_doc_format(doc)


# Add heading for recipe name
recipe_name_heading = doc.add_paragraph()
run_heading = recipe_name_heading.add_run(recipe_name)
run_heading.font.size = Pt(16)
recipe_name_heading.paragraph_format.space_after = Pt(20)


table = doc.add_table(rows=1, cols=3)
table.style = 'Table Grid'
table.autofit = False

hdr_cells = table.rows[0].cells
table.cell(0,0).merge(table.cell(0,1))
hdr_cells[0].text = "Ingredients"
hdr_cells[0].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
hdr_cells[2].text = "Cooking steps"
hdr_cells[2].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER

amount_ingredients = 5
measure_ingredient = "kg" # Change to list
for i in range(amount_ingredients):
    row = table.add_row()
    row.cells[0].text = f"{{{i}#_amount_of_this_ingredient}}" + "\n" + f"{measure_ingredient}"
    row.cells[1].text = "{name_of_ingredient}"
    row.cells[2].text = "{Cooking_steps_of_recipe _and_something_to_text_here}"

# Merge (connect) all cols at the right side
# The list of ingredients is at the left side
# To write a proper version of cooking steps it should be one space
table.cell(1,2).merge(table.cell(amount_ingredients,2))



set_table_col_width(0, 2)
set_table_col_width(1, 4.5)
set_table_col_width(2, 13.5)




save_docx(doc, doc_path, doc_name)