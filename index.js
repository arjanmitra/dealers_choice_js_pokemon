const {
  init,
  models: { Region, Trainer, Pokemon },
} = require('./db');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
const port = process.env.PORT || 3002;

app.listen(port, () => console.log(`listening on port ${port}`));
init();

app.use(require('body-parser').json());
app.use(morgan('dev'));
app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next) =>
  res.sendFile(path.join(__dirname, 'index.html'))
);

app.get('/regions', async (req, res, next) => {
  try {
    res.send(await Region.findAll());
  } catch (error) {
    next(error);
  }
});

app.get('/trainers', async (req, res, next) => {
  try {
    res.send(
      await Trainer.findAll({
        include: [
          {
            model: Pokemon,
          },
          {
            model: Region,
          },
        ],
      })
    );
  } catch (error) {
    next(error);
  }
});

app.get('/trainers/:id', async (req, res, next) => {
  try {
    res.send(
      await Trainer.findAll({
        where: {
          regionId: req.params.id,
        },
        include: [
          {
            model: Pokemon,
          },
          {
            model: Region,
          },
        ],
      })
    );
  } catch (error) {
    next(error);
  }
});

app.get('/pokemons/:id', async (req, res, next) => {
  try {
    res.send(
      await Pokemon.findAll({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: Pokemon,
            as: 'evolvedFrom',
          },
        ],
      })
    );
  } catch (error) {
    next(error);
  }
});

app.get('/trainers/pokemon/:id', async (req, res, next) => {
  try {
    res.send(
      await Trainer.findAll({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: Pokemon,
            include: [
              {
                model: Pokemon,
                as: 'evolvedFrom',
              },
            ],
          },
          {
            model: Region,
          },
        ],
      })
    );
  } catch (error) {
    next(error);
  }
});
