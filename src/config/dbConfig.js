const { readdirSync } = require('fs');
const { dirname } = require('path');

/** User define DB Creadentials */
const { db: { noSqlDbConfig, sqlDbConfig } } = require('./config');
const database = process.env.DB_DRIVER || '';

if (database.toLowerCase() === 'mongodb') {
  // Bring in the mongoose module
  const mongoose = require('mongoose');
  const { url, name } = noSqlDbConfig;
  const dbURI = url + name;

  // console to check what is the dbURI refers to
  console.info('Database URL is => ', dbURI);

  // Open the mongoose connection to the database
  mongoose.connect(dbURI, {
    config: {
      autoIndex: false,
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Db Connection
  let db = mongoose.connection;

  db.on('connected', () => {
    console.info('Mongoose connected to ' + dbURI);
    readdirSync(dirname(require.main.filename) + '/src/models').forEach(file => require(dirname(require.main.filename) + '/src/models/' + file));
  });

  db.on('error', err => console.error('-> Mongoose connection error: ' + err));

  db.on('disconnected', () => console.warn('-> Mongoose disconnected!'));

  process.on('SIGINT', () => {
    db.close(() => {
      console.warn('-> Mongoose disconnected through app termination!');
      process.exit(0);
    });
  });

  // Exported the database connection which is to be imported at the server
  exports.default = db;
} else if (database.toLowerCase() === 'sql') {
  // Bring in the sequelize module
  const Sequelize = require('sequelize');
  const {
    name,
    username,
    password,
    host,
    port,
    dialect,
  } = sqlDbConfig;

  // logging: false because sequelize by default log all DB activities in console which will unneccessarily flood the console.
  const sequelize = new Sequelize(name, username, password, {
    host,
    port,
    dialect,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true
    }
  });

  sequelize
    .authenticate()
    .then(() =>
      console.info(
        `Sequelize connection started on database "${name}" from "${dialect}"`
      )
    )
    .catch(err => console.error(`Sequelize connection error: ${err}`));

  process.on('SIGINT', () => {
    console.warn('-> Sequelize disconnected through app termination!');
    process.exit(0);
  });

  // const { model } = require('../helpers/utils');
  /**** Establishing Relationships */
  /** Sequelize One-To-One relationship */
  // model('User').hasOne(model('Profile'));
  // model('Profile').belongsTo(model('User'), {constraints: true, onDelete: 'CASCADE'});

  /** Sequelize One-To-Many relationship */
  // model('User').hasMany(model('Product'));
  // model('Product').belongsTo(model('User'), {constraints: true, onDelete: 'CASCADE'});

  /** Sequelize Many-To-Many relationship */
  // model('User').belongsToMany(model('Product'), {through: model('UserProducts'), constraints: true, onDelete: 'CASCADE'});
  // model('Product').belongsToMany(model('User'), {through: model('UserProducts'), constraints: true, onDelete: 'CASCADE'});
  /**** Establishing Relationships */

  sequelize.sync()
    .then(() => console.info(`Sequelize connection synced and relationships established.`))
    .catch(err => console.error(err));

  // Exported the database connection which is to be imported at the server
  exports.default = sequelize;
} else {
  console.warn(
    '\x1b[33m%s\x1b[0m',
    '-> Application is running without database connection!'
  );
}
