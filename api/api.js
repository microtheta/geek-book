import express from 'express';
import morgan from 'morgan';
import chalk from 'chalk';
import session from 'express-session';
import SQLitestore from 'connect-sqlite3';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import PrettyError from 'pretty-error';
import expressValidator from 'express-validator';

import models from '../models';
import config from './config';
import routes from './modules';

const SQLiteStore = SQLitestore(session);

process.on('unhandledRejection', error => console.error(error));

const pretty = new PrettyError();
pretty.start();
const app = express();

app.set('config', config)
  .use(morgan('dev'))
  .use(compression())
  .use(cookieParser())
  .use(session({
    secret: 'react and redux rule!!!!',
    resave: true,
    saveUninitialized: true,
    // cookie: { maxAge: 60000 },
    store: new SQLiteStore({ db: 'db.development.sqlite' })
  }))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(expressValidator());


/**
Passport init
**/
const auth = require('./modules/auth');
auth.initialize(app);


/**
Express configuration.
**/
app.use('/api', routes);
app.set('port', process.env.APIPORT || 9090);


/**
   * Connect to DB.
   */
models.sequelize.sync().then(() => {
  console.log('DB Connection setup successfully!!!');
  /**
  Start Express server.
  **/
  app.listen(app.get('port'), () => {
    console.log('%s Express server listening on port %d in %s mode.',
      chalk.green('✓'), app.get('port'), app.get('env'));
  });
}).catch((error) => {
  console.error('MySQL Connection Error. Please make sure that MySQL is running.', error);
  // process.exit(1);
});
