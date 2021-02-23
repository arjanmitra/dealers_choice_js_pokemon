const {
  init,
  models: { Region, Trainer, Pokemon },
} = require('./db');
const express = require('express');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3002;

app.listen(port, () => console.log(`listening on port ${port}`));
init();

app.use(morgan('dev'));

app.get('/trainers', async (req, res, next) => {
  try {
    res.send(await Trainer.findAll());
  } catch (error) {
    next(error);
  }
});

app.get('/trainers/:id', async (req, res, next) => {
  try {
    res.send(
      await Trainer.findAll({
        where: {
          id: req.params.id,
        },
      })
    );
  } catch (error) {
    next(error);
  }
});
