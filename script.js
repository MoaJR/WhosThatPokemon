const scoreCheck = document.querySelector('.scoreCheck');
const score = document.querySelector('.score');
const silhouette = document.querySelector('.silhouette');
const pokeNameDiv = document.querySelector('.pokeNameDiv');
const buttonsArray = document.querySelectorAll('.buttonChoice');

const buttons = Array.from(buttonsArray);
let sum = 0;

let arrayGlobal = [];
let pokeGlobal = '';
scoreCheck.innerText = '';
pokeNameDiv.innerText = '';
score.innerText = 'Pontuação: 0';

const fetchPoke = async () => {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`;
  const promise = await fetch(url);
  return promise.json();
};

const randomNumber = (maxValue) => Math.floor(Math.random() * maxValue);

const arrayLength = (array) => array.length - 1;

const appendImage = (pokemon) => {
  const img = document.createElement('img');
  img.src = pokemon.sprites.other.dream_world.front_default;
  img.id = 'silhouette__img'
  img.style.filter = 'brightness(0)';
  img.style.height = '200px'
  silhouette.appendChild(img);
  arrayGlobal.push(pokemon.name);
  pokeGlobal = pokemon.name;
}

const getRandomPokemon = (callback) => {
  silhouette.innerHTML = null;
  fetchPoke().then(({ results }) => {
    const pokeUrl = results[randomNumber(arrayLength(results))].url;
    const pokePromise = fetch(pokeUrl);
    pokePromise
        .then((json) => json.json())
        .then((pokemon) => {
          callback(pokemon);
          buttons.forEach((e, i) => e.innerText = arrayGlobal.sort()[i])
        })
  });
};

const getNames = (pokemon) => arrayGlobal.push(pokemon.name);

const fillArrayNames = () => {
  for (let i = 0; i < 3; i++) {
    getRandomPokemon(getNames);
  }
};

const disableButton = () => {
  buttons.forEach((button) => button.disabled = true)
};

const enableButton = () => {
  buttons.forEach((button) => button.disabled = false)
};

const revealPokeSetup = () => {
  arrayGlobal = [];
  fillArrayNames();
  scoreCheck.innerText = '';
  pokeNameDiv.innerText = '';
  getRandomPokemon(appendImage);
  enableButton();
};

const controlBrightness = () => {
  const silhouetteImg = document.querySelector('#silhouette__img');
  silhouetteImg.style.filter = 'brightness(1)';
};

const revealPoke = () => {
  pokeNameDiv.innerText = pokeGlobal;
  controlBrightness();
  disableButton();
  setTimeout(() => {
    revealPokeSetup();
  }, 2000);
};

const checkPoke = (pokeName) => {
  if (pokeName === pokeGlobal) {
    sum += 10;
    scoreCheck.innerText = 'acertou';
  } else {
    sum -= 3;
    scoreCheck.innerText = 'errou';    
  }
  score.innerText = `Pontuação: ${sum}`;
}

getRandomPokemon(appendImage);
fillArrayNames();

buttons.forEach((button) => {
  button.addEventListener('click', ({ target }) => {
    checkPoke(target.innerText);
    revealPoke();
  })
})