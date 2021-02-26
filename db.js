const { DataTypes, Sequelize } = require('sequelize');
const db = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost/dealers_choice_pokemon'
);

const Region = db.define('region', {
  name: {
    type: DataTypes.STRING,
  },
});

const Trainer = db.define('trainer', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  class: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'software engineer',
  },
});

const Pokemon = db.define('pokemon', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Trainer.belongsTo(Region);
Region.hasMany(Trainer);

Pokemon.belongsTo(Pokemon, {
  as: 'evolvedFrom',
});
Pokemon.hasOne(Pokemon, {
  foreignKey: 'evolvedFromId',
});

Trainer.belongsToMany(Pokemon, { through: 'Pokemon_Trainers' });
Pokemon.belongsToMany(Trainer, { through: 'Pokemon_Trainers' });

const seed = async () => {
  //region data
  const [orre, johto, unova, sinnoh] = await Promise.all(
    ['orre', 'johto', 'unova', 'sinnoh'].map((region) =>
      Region.create({ name: region })
    )
  );

  //trainer data
  const [
    arjan,
    zaina,
    manu,
    felicia,
    stanley,
    eliot,
    thompson,
  ] = await Promise.all(
    [
      'arjan',
      'zaina',
      'manu',
      'felicia',
      'stanley',
      'eliot',
      'thompson',
    ].map((trainer) => Trainer.create({ name: trainer }))
  );

  arjan.regionId = 2;
  arjan.class = 'software engineer in training';
  await arjan.save();
  zaina.regionId = 1;
  await zaina.save();
  manu.regionId = 3;
  manu.class = 'software engineer in training';
  await manu.save();
  felicia.regionId = 2;
  felicia.class = 'software engineer in training';
  await felicia.save();
  stanley.regionId = 1;
  await stanley.save();
  eliot.regionId = 4;
  await eliot.save();
  thompson.regionId = 3;
  await thompson.save();

  //pokemon data
  const pichu = await Pokemon.create({
    name: 'pichu',
    level: 5,
    type: 'electric',
    gender: 'f',
  });
  const pikachu = await Pokemon.create({
    name: 'pikachu',
    level: 23,
    type: 'electric',
    gender: 'm',
  });
  const raichu = await Pokemon.create({
    name: 'raichu',
    level: 42,
    type: 'electric',
    gender: 'm',
  });
  const eevee = await Pokemon.create({
    name: 'eevee',
    level: 11,
    type: 'normal',
    gender: 'f',
  });
  const jolteon = await Pokemon.create({
    name: 'jolteon',
    level: 25,
    type: 'electric',
    gender: 'f',
  });
  const umbreon = await Pokemon.create({
    name: 'umbreon',
    level: 31,
    type: 'dark',
    gender: 'm',
  });
  const vaporeon = await Pokemon.create({
    name: 'vaporeon',
    level: 29,
    type: 'water',
    gender: 'f',
  });
  const espeon = await Pokemon.create({
    name: 'espeon',
    level: 33,
    type: 'psychic',
    gender: 'f',
  });
  const flareon = await Pokemon.create({
    name: 'flareon',
    level: 39,
    type: 'fire',
    gender: 'm',
  });
  const lugia = await Pokemon.create({
    name: 'lugia',
    level: 50,
    type: 'flying',
    gender: 'm',
  });
  const zapdos = await Pokemon.create({
    name: 'zapdos',
    level: 48,
    type: 'electric',
    gender: 'f',
  });
  const articuno = await Pokemon.create({
    name: 'articuno',
    level: 49,
    type: 'ice',
    gender: 'f',
  });
  const charmander = await Pokemon.create({
    name: 'charmander',
    level: 14,
    type: 'fire',
    gender: 'f',
  });
  const charizard = await Pokemon.create({
    name: 'charizard',
    level: 37,
    type: 'fire',
    gender: 'm',
  });

  //pichu evolutions
  pikachu.evolvedFromId = pichu.id;
  await pikachu.save();
  raichu.evolvedFromId = pikachu.id;
  await raichu.save();

  //eevee evolutions
  jolteon.evolvedFromId = eevee.id;
  await jolteon.save();
  umbreon.evolvedFromId = eevee.id;
  await umbreon.save();
  espeon.evolvedFromId = eevee.id;
  await espeon.save();
  vaporeon.evolvedFromId = eevee.id;
  await vaporeon.save();
  flareon.evolvedFromId = eevee.id;
  await flareon.save();

  //charmander evolutions
  charizard.evolvedFromId = charmander.id;
  await charizard.save();

  await arjan.addPokemons([pikachu.id, articuno.id, lugia.id, pichu.id]);
  await stanley.addPokemons([umbreon.id, charmander.id]);
  await eliot.addPokemons([eevee.id, vaporeon.id, charizard.id]);
  await thompson.addPokemons([zapdos.id, articuno.id, espeon.id]);
  await zaina.addPokemons([flareon.id, raichu.id]);
  await manu.addPokemons([pichu.id, vaporeon.id, espeon.id, lugia.id]);
  await felicia.addPokemons([umbreon.id, articuno.id, zapdos.id]);
};

const init = async () => {
  await db.sync({ force: true });
  await seed();
};

module.exports = {
  init,
  models: {
    Region,
    Trainer,
    Pokemon,
  },
};
