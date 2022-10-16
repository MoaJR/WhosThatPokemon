const scoreCheck = document.querySelector('.scoreCheck');
const score = document.querySelector('.score');
const silhouette = document.querySelector('.silhouette');
const pokeNameDiv = document.querySelector('.pokeNameDiv');
const buttonsArray = document.querySelectorAll('.buttonChoice');
const tip1 = document.querySelector('.tip1');
const flash = document.querySelector('.tip2');

const buttons = Array.from(buttonsArray);
let sum = 0;
let quantityTipOne = 3;
let quantityTipFlash = 3;

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

const apiImgSrc = (pokemon, callbackSrc) => {
  let src =  pokemon.sprites.other.dream_world.front_default;
  if (src === null) src = pokemon.sprites.other['official-artwork'].front_default;
  if (src === null) src = pokemon.sprites.front_default;
  return src;
};

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

const appendImage = (pokemon) => {
  const img = document.createElement('img');
  img.src = apiImgSrc(pokemon);
  img.id = 'silhouette__img'
  img.style.filter = 'brightness(0)';
  img.style.height = '200px'
  silhouette.appendChild(img);
  arrayGlobal.push(pokemon.name);
  pokeGlobal = pokemon.name;
}

const getNames = (pokemon) => arrayGlobal.push(pokemon.name);

const fillArrayNames = () => {
  for (let i = 0; i < 3; i++) {
    getRandomPokemon(getNames);
  }
};

const disableButton = () => {
  buttons.forEach((button) => button.disabled = true);
  tip1.disabled = true;
  flash.disabled = true;
};

const enableButton = () => {
  buttons.forEach((button) => button.disabled = false);
  if (quantityTipOne > 0) tip1.disabled = false;
  if (quantityTipFlash > 0) flash.disabled = false;
};

const revealPokeSetup = () => {
  arrayGlobal = [];
  fillArrayNames();
  scoreCheck.innerText = '';
  pokeNameDiv.innerText = '';
  getRandomPokemon(appendImage);
  enableButton();
};

const controlBrightness = (ammount) => {
  const silhouetteImg = document.querySelector('#silhouette__img');
  silhouetteImg.style.filter = `brightness(${ammount})`;
};

const revealPoke = () => {
  pokeNameDiv.innerText = pokeGlobal;
  controlBrightness(1);
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

const tipOne = () => {
  const filterPokeName = arrayGlobal.filter((poke)  => poke !== pokeGlobal);
  Math.random() < 0.5 ? filterPokeName.pop() : filterPokeName.shift();
  buttons.flatMap((e) => {
    if (filterPokeName.includes(e.innerText)) {
      e.disabled = true;
    }
  })
  if (quantityTipOne <= 0) tip1.disabled = true;
}

buttons.forEach((button) => {
  button.addEventListener('click', ({ target }) => {
    checkPoke(target.innerText);
    revealPoke();
  })
})

tip1.addEventListener('click', () => {
  if (quantityTipOne > 0) {
    quantityTipOne -= 1;
    tipOne();
    tip1.disabled = true;
  }
  tip1.innerText = `50/50: ${quantityTipOne}`;
});

flash.addEventListener('click', () => {
  if (quantityTipFlash > 0) {
    quantityTipFlash -= 1;
    setTimeout(() => {
      controlBrightness(1);
      setTimeout(() => {
        controlBrightness(0);
      }, 200)
    }, 500);
   
    flash.disabled = true;
  }
  flash.innerText = `Flash: ${quantityTipFlash}`;

})

getRandomPokemon(appendImage);
fillArrayNames();
