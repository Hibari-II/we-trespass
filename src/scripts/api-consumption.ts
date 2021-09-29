enum apiClasses {
    tableHead = "petshop__list__headings",
    tableBody = "petshop__list__data",
    tableRow = "petshop__list__row",
    tableCell = "petshop__list__row__cell",
}

const dogs: String[] = []; 


fetch("https://dog.ceo/api/breeds/list/all")
.then(response => response.json())
.then(responseJson => {
    const respondingBreeds= responseJson.message;
    for (const breed in respondingBreeds) {
        if (respondingBreeds[breed].length) {
            responseJson.message[breed].forEach((subBreed: String) => 
                dogs.push(`${breed} ${subBreed}`)
            );
            continue;
        }
        dogs.push(breed);
    }
});