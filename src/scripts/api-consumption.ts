import { Dog } from "./models/dog";

enum apiClasses {
    tableHead = "petshop__list__headings",
    tableData = "petshop__list__data",
    tableRow = "petshop__list__row",
    tableCell = "petshop__list__row__cell",
    tableCellBreed = "petshop__list__row__cell__breed",
    tableCellDescription = "petshop__list__row__cell__description",
    tableCellAction = "petshop__list__row__cell__action",
    desktop = "desktop-only",
    button = "button",
    buttonWhite = "button--white",
    buttonSmall = "button--small"
}

const dogDescriptions: string[] = [
    "One of the goodest bois",
    "Does poop frequently",
    "Couch Potato",
    "Amys favorit",
    "Got some ball of steels",
    "One of the coolest doggos",
    "Smeels like poop"
]

const dogs: Dog[] = []; 
const listDataElement: Element = document.getElementsByClassName(apiClasses.tableData)[0];

function fillDogs(responseJson: any) {
    const respondingBreeds= responseJson.message;
    for (const breed in respondingBreeds) {
        const randomNumber = Math.floor(Math.random() * (dogDescriptions.length - 1));

        if (respondingBreeds[breed].length) {
            responseJson.message[breed].forEach((subBreed: string) => {
                const randomNumber = Math.floor(Math.random() * (dogDescriptions.length - 1));
                dogs.push({
                    breed: `${breed} ${subBreed}`,
                    description: dogDescriptions[randomNumber]
                });
            });
            continue;
        }
        dogs.push({
            breed: breed,
            description: dogDescriptions[randomNumber]
        });
    }
}

function createHtmlRow() {
    dogs.forEach((dog: Dog) => {
        const newRowElement: Element = document.createElement("div");
        newRowElement.classList.add(apiClasses.tableRow);
        
        const cellElements: { [key: string]: Element } = {
            breed: createBreedElement(dog.breed),
            description: createDescriptionElement(dog.description),
            action: createActionElement("Grab")
        };

        newRowElement.appendChild(cellElements.breed);
        newRowElement.appendChild(cellElements.description);
        newRowElement.appendChild(cellElements.action);

        listDataElement.appendChild(newRowElement);
    });
}

function createCell() : Element {
    const newElement: Element = document.createElement("div");
    newElement.classList.add(apiClasses.tableCell);
    return newElement;
}

function createBreedElement(breed: string) : Element {
    const newElement: Element = createCell();
    newElement.classList.add(apiClasses.tableCellBreed);
    newElement.innerHTML = breed;
    return newElement;
}

function createDescriptionElement(description: string) : Element {
    const newElement: Element = createCell();
    newElement.classList.add(apiClasses.tableCellDescription);
    newElement.classList.add(apiClasses.desktop);
    newElement.innerHTML = description;
    return newElement;
}

function createActionElement(actionName: string) : Element {
    const newElement: Element = createCell();
    newElement.classList.add(apiClasses.tableCellAction);
    newElement.appendChild(createButtonElement(actionName, apiClasses.buttonWhite, apiClasses.buttonSmall));
    return newElement;
}

function createButtonElement(actionName: string, buttonColor: apiClasses, buttonSize: apiClasses) : Element {
    const newElement: Element = document.createElement("button");
    newElement.classList.add(apiClasses.button);
    newElement.classList.add(buttonColor);
    newElement.classList.add(buttonSize);
    newElement.innerHTML = actionName;
    return newElement;
}

fetch("https://dog.ceo/api/breeds/list/all")
.then(response => response.json())
.then(responseJson => {
    fillDogs(responseJson);
    createHtmlRow();
});