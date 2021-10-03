import { Dog } from "./models/dog";
import { StolenDog } from "./models/stolendog";
import { PetshopCell } from "./models/petshopcell";

enum ActionButton {
    steal,
    release
}

enum TableType {
    petshop,
    backpack
}

enum apiClasses {
    petshopTable = "petshop__table",
    petshopTableHead = "petshop__table__headings",
    petshopTableData = "petshop__table__data",

    backpackTable = "backpack__table",
    backpackTableHead = "backpack__table__headings",
    backpackTableData = "backpack__table__data",

    table = "table",
    tableHead = "table__headings",
    tableData = "table__data",
    tableRow = "table__row",
    tableCell = "table__row__cell",
    tableCellBreed = "table__row__cell__breed",
    tableCellDescription = "table__row__cell__description",
    tableCellAmount = "table__row__cell__amount",
    tableCellAction = "table__row__cell__action",
    tableClose = "table--closed",

    tableBackpack = "backpack__table",
    desktop = "desktop-only",
    button = "button",
    buttonWhite = "button--white",
    buttonRed = "button--red",
    buttonSmall = "button--small",
    buttonMedium = "button--medium",
    buttonClose = "button--closed"
}

const dogDescriptions: string[] = [
    "One of the goodest bois",
    "Does poop frequently",
    "Couch Potato",
    "Amys favorit",
    "Got some ball of steels",
    "One of the coolest doggos",
    "Smeels like poop",
]

const dogs: Dog[] = []; 
let backpack: StolenDog[] = [];
const petshopTable: Element = document.getElementById("petshop-table");
const backpackTable: Element = document.getElementById("backpack-table");
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

function createTableRow(type: TableType, dog: (Dog | StolenDog), index: number = 0) : PetshopCell {
    const cellElements: PetshopCell = {
        breed: createBreedElement(dog.breed),
        description: createDescriptionElement(dog.description),
        action: createActionElement(ActionButton.steal, index)
    };

    if (type == TableType.backpack) {
        cellElements.amount = createAmountElement((dog as StolenDog).amount);
        cellElements.action = createActionElement(ActionButton.release, index);
    }

    return cellElements;
}

function createPetshopTableRows() {
    let indexCount: number = 0;
    dogs.forEach((dog: Dog) => {
        const newRowElement: Element = document.createElement("div");
        newRowElement.classList.add(apiClasses.tableRow);
    
        const cellElements = createTableRow(TableType.petshop, dog, indexCount);

        newRowElement.appendChild(cellElements.breed);
        newRowElement.appendChild(cellElements.description);
        newRowElement.appendChild(cellElements.action);

        petshopTableData.appendChild(newRowElement);
        indexCount++;
    });
}

function updateBackpackTableRows() {
    emptyBackpackTable();

    let indexCount: number = 0;
    console.log(backpack);
    backpack.forEach((dog: StolenDog) => {
        const newRowElement: Element = document.createElement("div");
        newRowElement.classList.add(apiClasses.tableRow);

        const cellElements = createTableRow(TableType.backpack, dog, indexCount);

        newRowElement.appendChild(cellElements.breed);
        newRowElement.appendChild(cellElements.description);
        newRowElement.appendChild(cellElements.amount);
        newRowElement.appendChild(cellElements.action);

        backpackTableData.appendChild(newRowElement);
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
            buttonEl.addEventListener("click", releaseFromBackpack(dogIndex));
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
        let stolenDog: StolenDog = backpack[index]; 
        stolenDog.amount--;

        if (!stolenDog.amount) {
            backpack.splice(index, 1);
        }
        updateBackpackTableRows();
    }
}

function emptyBackpackTable() {
    backpackTableData.innerHTML = "";
}

openBackpackButton.addEventListener("click", function() {
    updateBackpackTableRows();

    backpackTable.classList.remove(apiClasses.tableClose);
    petshopTable.classList.add(apiClasses.tableClose);

    returnPetshopButton.classList.remove(apiClasses.buttonClose);
    takeHomeButton.classList.remove(apiClasses.buttonClose);
    openBackpackButton.classList.add(apiClasses.buttonClose);
});

returnPetshopButton.addEventListener("click", function() {
    backpackTable.classList.add(apiClasses.tableClose)
    petshopTable.classList.remove(apiClasses.tableClose);

    returnPetshopButton.classList.add(apiClasses.buttonClose);
    takeHomeButton.classList.add(apiClasses.buttonClose);
    openBackpackButton.classList.remove(apiClasses.buttonClose);
});

takeHomeButton.addEventListener("click", function() {
    backpack = [];
    emptyBackpackTable();
    alert("You took all doggos to your home!");
});

fetch("https://dog.ceo/api/breeds/list/all")
.then(response => response.json())
.then(responseJson => {
    fillDogs(responseJson);
    createPetshopTableRows();
});

