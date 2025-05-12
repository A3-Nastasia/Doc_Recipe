// Get container to input ingredients or delete them
const containerIngredientsGroup = document.getElementById("container-ingredients");

async function send(){

    const recipeName = document.getElementById("recipe-name").value;
    const response = await fetch("output-data", {
        method: "POST",
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({
            recipeName: recipeName
        })
    });

    if (response.ok){
        const data = await response.json();
        document.getElementById("testText").textContent = data.message;
    }
    else
    console.log(response);
}

document.addEventListener("DOMContentLoaded", function(){
    //#region Div placeholder display
    // The placeholder in <div> element is needed to be returned
    // Get element by attribute
    let editableDiv = document.querySelector("[contenteditable]");
    // To functionality when user is writing something
    editableDiv.addEventListener("input", function() {
        // If there is no text the attribute is removed to not display the placeholder
        if (this.textContent.trim()!="")
            this.removeAttribute("data-text");
        // Otherwise the attribute is set again
        else
            this.setAttribute("data-text", "Введите описание рецепта...");
    });
    //#endregion

    document.getElementById("textBold").addEventListener('click', function(){
        document.execCommand('bold');
    })

    document.getElementById("textItalic").addEventListener('click', function(){
        document.execCommand('italic');
    })
});




function appendIngredient(){
    // Create elements for user
    const containerIngredient = document.createElement("div");
    const ingredientAmountField = document.createElement("input");
    const ingredientMeasureField = document.createElement("input");
    const ingredientNameField = document.createElement("input");
    const btnDeleteIngredient = document.createElement("button");

    // Set some attributes
    containerIngredient.className = "container-form";
    containerIngredient.classList.add("pair-wrapper");
    ingredientAmountField.setAttribute("placeholder", "0");
    ingredientMeasureField.setAttribute("placeholder", "кг/шт");
    ingredientNameField.setAttribute("placeholder", "Ингредиент");
    ingredientAmountField.classList.add("input-ingredient-amount");
    ingredientMeasureField.classList.add("input-ingredient-measure");
    ingredientNameField.classList.add("input-ingredient-name");
    btnDeleteIngredient.classList.add("button-delete-ingredient");
    btnDeleteIngredient.textContent = "Удалить";

    // Append to the page
    containerIngredient.appendChild(ingredientAmountField);
    containerIngredient.appendChild(ingredientMeasureField);
    containerIngredient.appendChild(ingredientNameField);
    containerIngredient.appendChild(btnDeleteIngredient);
    containerIngredientsGroup.appendChild(containerIngredient);
}

// In parent container 
// if any delete button was clicked 
// this this pair will be deleted
containerIngredientsGroup.addEventListener("click", e => {
    if(e.target.classList.contains("button-delete-ingredient"))
        e.target.closest(".pair-wrapper").remove();
});




//#region Dropdown menu and Justify text
// A part of class name to find buttons and change main button's class
const justifyClassNamePart = 'dropdown-item-justify-';
// Dropdown button
const dropdownBtn = document.getElementById("dropdownBtn");
// Menu for dropdown button
const dropdownMenu = document.getElementById("dropdownMenu");
// Icon to change svg on Dropdown button
const icon = document.querySelector(".icon-container");


function getFullIncludesClassNames(elementsArray, str){
    // Using this kind of solution 
    // 'cause elements are DOM's elements and doesn't support .map, includes and etc.
    const elements = Array.from(elementsArray);
    return elements.map(i => Array.from(i.classList).find(j => j.includes(str))).filter(Boolean);
}

function clickJustifyTextAlign(element){
    // Using QuerySelectorAll(string) to find several elements
    const selectedJustifyMode = element;
    console.log("selectedJustifyMode: ", selectedJustifyMode);
    console.log("selectedJustifyMode: ", selectedJustifyMode.classList);
    const currentJustifyModeClassName = getFullIncludesClassNames(element, justifyClassNamePart);
    
    console.log(currentJustifyModeClassName);
    const justifyDirection = currentJustifyModeClassName[0].replace(justifyClassNamePart, '');

    switch(justifyDirection){
        case "left":
            document.execCommand('justifyLeft');
            break;
        case "center":
            document.execCommand('justifyCenter');
            break;
        case "right":
            document.execCommand('justifyRight');
            break;
        case "full":
            document.execCommand('justifyFull');
            break;
        default:
            break;
    }
}

document.querySelectorAll('.dropdown-item').forEach(btn => {
    console.log(".dropdown-items");
    btn.addEventListener('click', e => {
        console.log("btn");
        const selectedJustifyMode = e.currentTarget;
        clickJustifyTextAlign([selectedJustifyMode]);
    });
});

dropdownBtn.addEventListener('click', () => {
    clickJustifyTextAlign(document.querySelectorAll('#dropdownBtn'));
});


dropdownMenu.addEventListener('click', (e) => {
    const item = e.target.closest(".dropdown-item");
    if(!item) return;

    const svg = item.querySelector('svg');
    if(svg) {
        // Clear current icon
        icon.innerHTML = '';
        // Insert copy of svg
        icon.appendChild(svg.cloneNode(true));
    }
    item.classList.remove()


    // remove old class with justify
    // and add a new one
    const dropdownBtn = document.querySelector('#dropdownBtn');
    getFullIncludesClassNames([dropdownBtn], justifyClassNamePart).forEach(i => dropdownBtn.classList.remove(i));
    dropdownBtn.classList.add(getFullIncludesClassNames([item], justifyClassNamePart));
});

//#endregion