// Get container to input ingredients or delete them
const containerIngredientsGroup = document.getElementById("containerIngredients");

const recipeName = document.getElementById("recipeName");

const btnDownloadFile = document.getElementById('btnDownload');

/**
* @summary Set url query
*
* Set param for recipeName to create a link to download a file.
*
* @returns {void}
*
* @example
* // "Пирог" link becomes "/download?recipeName=%D0%9F%D0%B8%D1%80%D0%BE%D0%B3"
*/
recipeName.addEventListener('input', () => {
    const recipeNameText = recipeName.value.trim();

    if (recipeNameText) {
        // Download file with it's name from query
        btnDownloadFile.href = `/download?recipeName=${encodeURIComponent(recipeNameText)}`;
    } else {
        // Set to default
        btnDownloadFile.href = '#';
    }
});

/**
* @summary Setting default params
*
* Setting default params and styles.
*
* @returns {void}
*/
document.addEventListener("DOMContentLoaded", function () {
    //#region Div placeholder display
    // The placeholder in <div> element is needed to be returned
    // Get element by attribute
    let editableDiv = document.querySelector("[contenteditable]");
    // To functionality when user is writing something
    editableDiv.addEventListener("input", function () {
        // If in div there is any image like screenshot then the placeholder will still be there
        // To fix it it need to be checked if there not only text but also an img tag
        const hasText = this.textContent.trim() != "";
        const hasImg = this.querySelector("img") != null;

        // If there is no text the attribute is removed to not display the placeholder
        if (hasText || hasImg)
            this.removeAttribute("data-text");
        // Otherwise the attribute is set again
        else
            this.setAttribute("data-text", "Введите описание рецепта...");
    });
    //#endregion

    document.getElementById("textBold").addEventListener('click', function () {
        document.execCommand('bold');
    })

    document.getElementById("textItalic").addEventListener('click', function () {
        document.execCommand('italic');
    })
});



/**
* @summary Append ingredient container to the page
*
* Append div container with input elements and btn to delete the current element. Also sets styles, restrictions on regex and tooltip for ingredient's amount
*
* @returns {void}
*
* @example
* // example
*/
function appendIngredient() {
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
    ingredientAmountField.classList.add("tooltip");
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

    // Input regex for amount. You can input only digits and . or , (and only one of these separators)
    // Also it's set to input only 3 decimal places (amount of digits after '.' or ',')
    ingredientAmountField.addEventListener('input', () => {
        let val = ingredientAmountField.value;
        let decimalSeparator = null;
        const maxDecimalPlaces = 3;

        // Only '-' or digitals or ',' or '.'
        val = val.replace(/[^0-9.,]/g, '');

        if (val.includes('.')) {
            decimalSeparator = '.';
            val = val.replace(/,/g, '');
        } else if (val.includes(',')) {
            decimalSeparator = ',';
            val = val.replace(/\./g, '');
        }

        if (decimalSeparator) {
            const parts = val.split(decimalSeparator);
            parts[1] = (parts[1] || '').slice(0, maxDecimalPlaces);
            val = parts[0] + decimalSeparator + parts[1];
        }

        ingredientAmountField.value = val;
    });

    ingredientMeasureField.addEventListener('input', () => {
        // Only literal symbols
        ingredientMeasureField.value = ingredientMeasureField.value.replace(/[^\p{L}]+$/gu, '');
    });


    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = 'Введите количество в граммах';
    document.body.appendChild(tooltip);

    // Place tooltip near to the input
    function positionTooltip() {
        const rect = ingredientAmountField.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        // Place tooltip to the center
        const top = rect.top - tooltipRect.height - 8; // 8px from above
        const left = rect.left + (rect.width - tooltipRect.width) / 2;

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
    }


    // Show tooltip
    ingredientAmountField.addEventListener('mouseenter', () => {
        positionTooltip();
        tooltip.style.opacity = '1';
    });

    // Update tooltip position from scrolling and changing window size
    window.addEventListener('scroll', () => {
        if (tooltip.style.opacity === '1') {
            positionTooltip();
        }
    });
    window.addEventListener('resize', () => {
        if (tooltip.style.opacity === '1') {
            positionTooltip();
        }
    });

    // Hide tooltip
    ingredientAmountField.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
    });

    // Insert tooltip inside the input
    ingredientAmountField.appendChild(tooltipSpan);
}

// In parent container 
// if any delete button was clicked 
// this this pair will be deleted
containerIngredientsGroup.addEventListener("click", e => {
    if (e.target.classList.contains("button-delete-ingredient"))
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


function getFullIncludesClassNames(elementsArray, str) {
    // Using this kind of solution 
    // 'cause elements are DOM's elements and doesn't support .map, includes and etc.
    const elements = Array.from(elementsArray);
    return elements.map(i => Array.from(i.classList).find(j => j.includes(str))).filter(Boolean);
}

function clickJustifyTextAlign(element) {
    // Using QuerySelectorAll(string) to find several elements
    const currentJustifyModeClassName = getFullIncludesClassNames(element, justifyClassNamePart);
    const justifyDirection = currentJustifyModeClassName[0].replace(justifyClassNamePart, '');

    switch (justifyDirection) {
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
    btn.addEventListener('click', e => {
        const selectedJustifyMode = e.currentTarget;
        clickJustifyTextAlign([selectedJustifyMode]);
    });
});

dropdownBtn.addEventListener('click', () => {
    clickJustifyTextAlign(document.querySelectorAll('#dropdownBtn'));
});


dropdownMenu.addEventListener('click', (e) => {
    const item = e.target.closest(".dropdown-item");
    if (!item) return;

    const svg = item.querySelector('svg');
    if (svg) {
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


// Container to display errors to user
const errors = document.getElementById('errorContainer');
errors.style.display = 'none';

// #region Send to server
async function sendRecipe() {
    errors.textContent = "";

    const recipeName = document.getElementById("recipeName").value.trim();

    // Get Ingredients. Firstly get the container and then get the input fields
    const recipeIngredientsContainer = document.querySelectorAll(".pair-wrapper");

    const recipeDescription = document.getElementsByClassName("container-recipe-description-steps");
    recipeDescription[0].innerText = recipeDescription[0].innerText.trim();

    // To contain info from every container
    const recipeIngredients = Array.from(recipeIngredientsContainer).reduce((acc, container) => {

        const inputs = container.querySelectorAll("input");

        const amount = inputs[0]?.value.trim() || null;
        const measure = inputs[1]?.value.trim() || null;
        const ingredientName = inputs[2]?.value.trim() || null;

        if (amount == null && measure == null && ingredientName == null)
            return acc;

        acc.push({
            amount: amount || 0,
            measure: measure || "кг/шт",
            ingredientName: ingredientName || "Ингредиент"
        });

        return acc;
    }, []);

    const response = await fetch("/recipes/create", {
        method: "POST",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            recipeName: recipeName,
            recipeIngredients: recipeIngredients || "",
            recipeDescription: recipeDescription[0].innerText.trim()
        })
    })
        .then(response => {
            if (recipeName === "" || (recipeDescription[0].innerText === "" || recipeIngredients.length === 0)) {
                errors.style.display = 'block';

                const emptyFields = [];
                errors.innerHTML = "&nbsp;&nbsp;&nbsp;Данные не заполнены.";


                if (recipeName === "") {
                    emptyFields.push("Название рецепта");
                }

                if (recipeDescription[0].innerText.trim() === "") {
                    emptyFields.push("Описание рецепта");
                }

                if (recipeIngredients.length === 0) {
                    emptyFields.push("Ингредиенты");
                }

                if (emptyFields.length > 0) {
                    errors.innerHTML += "<ul>" + emptyFields.map(error => `<li>${error}</li>`).join('') + "</ul>";
                    errors.style.display = 'block';
                } else {
                    errors.innerHTML = "";
                    errors.style.display = 'none';
                }

                return;
            }
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error('Ошибка сервера:', errorData);
                    throw new Error(errorData.message || 'Ошибка сервера');
                });
            }
            if (response.ok)
                errors.style.display = 'none';

            return response.json();
        })
        .then(data => {
            console.log('Успешно:', data);
        })
        .catch(error => {
            console.error('Ошибка запроса:', error);
            const errors = document.getElementById('errors');
            if (errors) {
                errors.style.display = 'block';
                errors.textContent = error.message;
            }
        });
}
// #endregion