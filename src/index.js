const axios = require('axios');

const regionsParent = document.querySelector('#regions');
const trainersParent = document.querySelector('#trainers');
const pokemonParent = document.querySelector('#pokemon');
const pokemondata = document.querySelector('#pokemondata');

const renderRegions = (regions) => {
  regions.map((region) => {
    const tempRegion = document.createElement('div');
    tempRegion.id = region.id;
    tempRegion.className = region.name;
    tempRegion.innerHTML = `${region.name}`;
    regionsParent.appendChild(tempRegion);
  });
};

const renderTrainers = (trainers) => {
  trainersParent.innerHTML = '';
  pokemonParent.innerHTML = '';
  pokemondata.innerHTML = '';
  trainers.map((trainer) => {
    const tempTrainer = document.createElement('div');
    tempTrainer.id = trainer.id;
    tempTrainer.className = trainer.name;
    tempTrainer.innerHTML = `${trainer.name}, ${trainer.class}`;
    trainersParent.appendChild(tempTrainer);
  });
};

const renderPokemons = (pokemons) => {
  pokemonParent.innerHTML = '';
  pokemons.map((pokemon) => {
    const tempPokemon = document.createElement('div');
    tempPokemon.id = pokemon.id;
    tempPokemon.className = pokemon.name;
    tempPokemon.innerHTML = `${pokemon.name}, ${pokemon.level}`;
    pokemonParent.appendChild(tempPokemon);
  });
};

const trainers = async (id) => {
  const returnedTrainers = (await axios.get(`/trainers/${id}`)).data;
  return returnedTrainers;
};

regionsParent.addEventListener('click', async (ev) => {
  if (ev.target.id !== 'regions') {
    const regionTrainers = await trainers(ev.target.id);
    renderTrainers(regionTrainers);
  }
});

const pokemons = async (id) => {
  const returnedPokemons = (await axios.get(`/trainers/pokemon/${id}`)).data;
  return returnedPokemons[0].pokemons;
};

trainersParent.addEventListener('click', async (ev) => {
  if (ev.target.id !== 'trainers') {
    const trainersPokemon = await pokemons(ev.target.id);
    renderPokemons(trainersPokemon);
  }
});

pokemonParent.addEventListener('click', async (ev) => {
  if (ev.target.id !== 'pokemon') {
    const pokemonSelected = (await axios.get(`/pokemons/${ev.target.id}`)).data;
    const evolution = pokemonSelected[0].evolvedFrom;
    const pokemonPicData = (
      await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${ev.target.className}/`
      )
    ).data;
    const pokemonPicLink = pokemonPicData.sprites.front_default;
    let pokemonPicDiv;
    if (evolution) {
      const evolutionPicData = (
        await axios.get(`https://pokeapi.co/api/v2/pokemon/${evolution.name}/`)
      ).data;
      const evolutionPicLink = evolutionPicData.sprites.front_default;
      pokemonPicDiv = `
      <img src = ${pokemonPicLink}>
      <br><br>evolved from<br><br><img src = ${evolutionPicLink}>
      `;
    } else {
      pokemonPicDiv = `<img src = ${pokemonPicLink}>`;
    }
    pokemondata.innerHTML = pokemonPicDiv;
  }
});

const init = async () => {
  try {
    const regionsData = (await axios.get('/regions')).data;
    renderRegions(regionsData);
  } catch (error) {
    console.log(error);
  }
};
init();
