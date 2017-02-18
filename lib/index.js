const Koa = require('koa');
const BodyParser = require('koa-bodyparser');
const models = require('./models');
const config = require('./config');

models.ready.then(startServer);

function startServer() {
  const HOST = config.get('HOST');
  const PORT = config.get('PORT');
  const app = Koa();
  app.keys = [config.get('SECRET_KEY')];

  app
  .use(BodyParser({enableTypes: ['json', 'form', 'text']}))

  app.listen(PORT, HOST, err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Listening at ${HOST}:${PORT}`);
  });
}