from docx import Document
import os
from docx.shared import Pt, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH

class DocRecipe:
    def __init__(self, doc_name):
        """
        DESCRIPTION: initialize class object

        Args:
            self (DocRecipe): Instance of the current class
            doc_name (str): name of the .docx file
        """

        # Create a doc object from python-docx
        self.doc = Document()
        self.doc_name = doc_name

    # Saving file and checking if it's opened
    def __save_docx(self, doc):
        """
        DESCRIPTION: Save file and check if it's opened

        Args:
            self (DocRecipe): Instance of the current class
            doc (Document): Document object from python-docx
        """
        try:
            doc_path = os.path.join(os.getcwd(), self.doc_name)
            doc.save(self.doc_name)
            print("File saved on path", doc_path)
        except PermissionError:
            print(f"Error: The file {self.doc_name} is currently in use. Please close it and try again.")

    # TODO: add params to function like font size and etc.
    def __set_doc_format(self, doc):
        """
        DESCRIPTION: Set format for .docx text

        Args:
            self (DocRecipe): Instance of the current class
            doc (Document): Document object from python-docx
        """

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

    def __set_table_col_width(self, table, col_id, width_in_cm):
        """
        DESCRIPTION: Set column width in Cm

        Args:
            self (DocRecipe): Instance of the current class
            table (Table): Table object inside .docx (Document)
        """

        for cell in table.columns[col_id].cells:
            cell.width = Cm(width_in_cm)

    def __set_recipe_name_style(self, recipe_name, font_size, space_after):
        """
        DESCRIPTION: Set recipe name and style for it

        Args:
            self (DocRecipe): Instance of the current class
            recipe_name (str): Recipe name
            font_size (int): Font size in Pt
            space_after (int): Space after paragraph in Pt
        """
        recipe_name_heading = self.doc.add_paragraph()
        run_heading = recipe_name_heading.add_run(recipe_name)
        run_heading.font.size = Pt(font_size)
        recipe_name_heading.paragraph_format.space_after = Pt(space_after)

    def create_doc(self, recipe_name):
        """
        DESCRIPTION: Create a .docx file with recipe name and save it

        Args:
            self (DocRecipe): Instance of the current class
            recipe_name (str): Recipe name
        """

        self.__set_doc_format(self.doc)
        self.__set_recipe_name_style(recipe_name, 16, 20)

        table = self.doc.add_table(rows=1, cols=3)
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

        self.__set_table_col_width(table, 0, 2)
        self.__set_table_col_width(table, 1, 4.5)
        self.__set_table_col_width(table, 2, 13.5)

        self.__save_docx(self.doc)


test_doc = DocRecipe("Recipe_template.docx")
recipe_name = "Recipe_name"
test_doc.create_doc(recipe_name)