const axios = require("axios").default,
  fs = require("fs"),
  path = require("path"),
  format = require("date-format"),
  pathToCharactersData = path.join("./rickAndMortyHeroes.json"),
  pathToSearchResults = path.join("./searchResults.json");

const getAllCharacters = () => {
  axios({
      method: "get",
      url: "https://rickandmortyapi.com/api/character/",
    })
    .then(response => {
      const countOfAllCharacters = response.data.info.count;
      const counter = countOfCharacters(countOfAllCharacters);
      axios({
          method: "get",
          url: "https://rickandmortyapi.com/api/character/" + counter,
        })
        .then(response => {
          fs.writeFileSync(pathToCharactersData, JSON.stringify(response.data, null, "\t"));
        })
        .catch(error => console.log(error));
    })
    .catch(error => console.log(error));
};

const countOfCharacters = (countOfAllCharacters) => {
  let stringWithCountOfCharacters = "";
  for (let i = 1; i <= countOfAllCharacters; i++) {
    stringWithCountOfCharacters = stringWithCountOfCharacters + i + ",";
    if (i === countOfAllCharacters) {
      stringWithCountOfCharacters = stringWithCountOfCharacters + i;
    }
  }
  return stringWithCountOfCharacters;
};

const getCharactersFromJSON = () => {
  return JSON.parse(fs.readFileSync(pathToCharactersData));
};

const getCharactersData = () => {
  try {
    return getCharactersFromJSON();
  } catch (error) {
    fs.writeFileSync(pathToNotesStorage, JSON.stringify([]));
    return getCharactersFromJSON();
  }
};

const verifyAndWrite = (array, counter) => {
  if (!counter) {
    array.push("Characters not founded!");
  }
  fs.writeFileSync(pathToSearchResults, JSON.stringify(array, null, "\t"));
};

const findCharacterByParameter = (parameter, species) => {
  const array = getCharactersData(),
    timeOfCreate = format.asString("dd/MM/yy hh:mm:ss", new Date()),
    arrayWithResults = [];
  arrayWithResults.push("Results of search in " + timeOfCreate);
  let counter = 0;
  array.forEach((character) => {
    for (let key in character) {
      if (key.toLowerCase() === parameter.toLowerCase() && character[key].toString().toLowerCase() === species.toLowerCase()) {
        arrayWithResults.push(`${character.name} - ${key} - ${character[key]}`);
        counter++;
      }
    }
  });
  verifyAndWrite(arrayWithResults, counter);
};

const findCharacterBySetOfParameters = (parameters, species) => {
  const array = getCharactersData(),
    timeOfCreate = format.asString("dd/MM/yy hh:mm:ss", new Date()),
    arrayWithResults = [],
    arrayWithNames = [],
    divider = /\s*,\s*/,
    arrayWithParameters = parameters.split(divider),
    arrayWithSpecies = species.split(divider);
  console.log(arrayWithParameters);
  console.log(arrayWithSpecies);
  let counter = 0,
    resultOfCompare = 0;
  arrayWithResults.push("Results of search in " + timeOfCreate);
  array.forEach(character => {
    for (let key in character) {
      let sum = 0;
      for (let parameters of arrayWithParameters) {
        for (let species of arrayWithSpecies) {
          if (key.toLowerCase() === parameters.toLowerCase() && character[key].toString().toLowerCase() === species.toLowerCase()) {
            // arrayWithResults.push(`${character.name} - ${key} - ${character[key]}`);
            arrayWithResults.push(`${character.name}`);
            counter++;
          }
          //console.log(character.hasOwnProperty("species"));
        }
      }
    }
  });
  verifyAndWrite(arrayWithResults, counter);
};

module.exports = {
  getAllCharacters,
  findCharacterByParameter,
  findCharacterBySetOfParameters
};