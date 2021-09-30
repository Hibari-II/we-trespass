import { Dog } from "./models/dog";
import { StolenDog } from "./models/stolendog";

enum ActionButton {
    steal,
    release
}

enum apiClasses {
    tableHead = "petshop__table__headings",
    tableData = "petshop__table__data",
    tableRow = "petshop__table__row",
    tableCell = "petshop__table__row__cell",
    tableCellBreed = "petshop__table__row__cell__breed",
    tableCellDescription = "petshop__table__row__cell__description",
    tableCellAmount = "petshop__table__row__cell__amount",
    tableCellAction = "petshop__table__row__cell__action",
    tableBackpack = "backpack__table",
    desktop = "desktop-only",
    button = "button",
    buttonWhite = "button--white",
    buttonRed = "button--red",
    buttonSmall = "button--small",
    buttonMedium = "button--medium"
}

const dogDescriptions: string[] = [
    "One of the goodest bois",
    "Does poop frequently",
    "Couch Potato",
    "Amys favorit",
    "Got some ball of steels",
    "One of the coolest doggos",
    "Smeels like poop",
    "Bites your pp",
    "Pees on you",
    "Piece on you",
    "Sheet on my bed",
    "Want a fork on the table"
]

const dogs: Dog[] = []; 
let backpack: StolenDog[] = [];
const petshopTable: Element = document.getElementById("petshop-table");
const backpackTable: Element = document.getElementById("backpack");
const petshopTableData: Element = document.getElementById("petshop-table-data");
const backpackTableData: Element = document.getElementById("backpack-table-data")

const openBackpackButton: Element = document.getElementById("openBackpack-btn");
const returnPetshopButton: Element = document.getElementById("returnPetshop-btn");
const takeHomeButton: Element = document.getElementById("takeHome-btn");

function fillDogs(responseJson: any) {
    const respondingBreeds= responseJson.message;
    for (const breed in respondingBreeds) {
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

        const randomNumber = Math.floor(Math.random() * (dogDescriptions.length - 1));
        dogs.push({
            breed: breed,
            description: dogDescriptions[randomNumber]
        });
    }
}

function createPetshopTableRows() {
    let indexCount: number = 0;
    dogs.forEach((dog: Dog) => {
        const newRowElement: Element = document.createElement("div");
        newRowElement.classList.add(apiClasses.tableRow);
        
        const cellElements: { [key: string]: Element } = {
            breed: createBreedElement(dog.breed),
            description: createDescriptionElement(dog.description),
            action: createActionElement(ActionButton.steal, indexCount)
        };

        newRowElement.appendChild(cellElements.breed);
        newRowElement.appendChild(cellElements.description);
        newRowElement.appendChild(cellElements.action);

        petshopTableData.appendChild(newRowElement);
        indexCount++;
    });
}

function updateBackpackTableRows() {
    let indexCount: number = 0;
    backpack.forEach((dog: StolenDog) => {
        const newRowElement: Element = document.createElement("div");
        newRowElement.classList.add(apiClasses.tableRow);

        const cellElements: { [key: string]: Element } = {
            breed: createBreedElement(dog.breed),
            description: createDescriptionElement(dog.description),
            amount: createAmountElement(dog.amount),
            action: createActionElement(ActionButton.release, indexCount)
        };

        newRowElement.appendChild(cellElements.breed);
        newRowElement.appendChild(cellElements.description);
        newRowElement.appendChild(cellElements.amount);
        newRowElement.appendChild(cellElements.action);

        petshopTableData.appendChild(newRowElement);
        indexCount++;
    });
}

function createCell() : Element {
    const cell: Element = document.createElement("div");
    cell.classList.add(apiClasses.tableCell);
    return cell;
}

function createBreedElement(breed: string) : Element {
    const breedEl: Element = createCell();
    breedEl.classList.add(apiClasses.tableCellBreed);
    breedEl.innerHTML = breed;
    return breedEl;
}

function createDescriptionElement(description: string) : Element {
    const newElement: Element = createCell();
    newElement.classList.add(apiClasses.tableCellDescription);
    newElement.classList.add(apiClasses.desktop);
    newElement.innerHTML = description;
    return newElement;
}

function createAmountElement(amount: number) : Element {
    const newElement: Element = createCell();
    newElement.classList.add(apiClasses.tableCellAmount);
    newElement.innerHTML = String(amount);
    return newElement;
}

function createActionElement(actionType: ActionButton, index: number) : Element {
    const actionEl: Element = createCell();
    actionEl.classList.add(apiClasses.tableCellAction);
    actionEl.appendChild(createButtonElement(actionType, index));
    return actionEl;
}

function createButtonElement(actionType: ActionButton, dogIndex: number) : Element {
    const buttonEl: Element = document.createElement("button");
    buttonEl.classList.add(apiClasses.button);
    buttonEl.classList.add(apiClasses.buttonSmall);

    switch (actionType) {
        case ActionButton.steal:
            buttonEl.addEventListener("click", addToBackpack(dogIndex));
            buttonEl.classList.add(apiClasses.buttonWhite);
            buttonEl.innerHTML = "Grab";
            break;
        case ActionButton.release:
            buttonEl.addEventListener("click", addToBackpack(dogIndex));
            buttonEl.classList.add(apiClasses.buttonRed);
            buttonEl.innerHTML = "Release";
            break;
        default:
            break;
    }

    return buttonEl;
}

function addToBackpack(index: number) {
    return () => {
        console.log("Add dog to backpack");
        const dog = dogs[index];
        const foundIndex = backpack.findIndex(x => dog.breed === x.breed);

        if (foundIndex >= 0) {
            backpack[foundIndex].amount++;
            return;
        }
        
        backpack.push({
            breed: dog.breed,
            description: dog.description,
            amount: 1
        });
    };
}

function releaseFromBackpack(index: number) {
    return () => {
        console.log("Release dog from backpack");
        const foundIndex = backpack.findIndex(x => dogs[index].breed === x.breed);
    
        if (foundIndex < 0) {
            return;
        }
        let stolenDog: StolenDog = backpack[foundIndex]; 
        stolenDog.amount--;

        if (!stolenDog.amount) {
            backpack = backpack.splice(foundIndex, 1);
            backpackTable.innerHTML = "";
        }
        updateBackpackTableRows();
    }
}

openBackpackButton.addEventListener("click", function() {
    updateBackpackTableRows();
});

takeHomeButton.addEventListener("click", function() {
    backpack = [];
    backpackTable.innerHTML = "";
    alert("You took all doggos to your home!");
});

fetch("https://dog.ceo/api/breeds/list/all")
.then(response => response.json())
.then(responseJson => {
    fillDogs(responseJson);
    createPetshopTableRows();
});

