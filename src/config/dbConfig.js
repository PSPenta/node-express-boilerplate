/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const { readdirSync } = require('fs');
const { dirname } = require('path');

/** User define DB Credentials */
const {
  db: {
    noSqlDbConfig,
    sqlDbConfig,
    sqlMasterDbConfig,
    sqlSlaveDbConfig
  }
} = require('./serverConfig');

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
      autoIndex: false
    },
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Db Connection
  const Mongoose = mongoose.connection;

  Mongoose.on('connected', () => {
    console.info(`Mongoose connected to ${dbURI}`);
    readdirSync(`${dirname(require.main.filename)}/src/models`).forEach((file) => require(`${dirname(require.main.filename)}/src/models/${file}`));
  });

  Mongoose.on('error', (err) => console.error('\x1B[31m', `=> Mongoose connection error: ${err}`));

  Mongoose.on('disconnected', () => console.warn('\x1b[33m%s\x1b[0m', '-> Mongoose disconnected!'));

  process.on('SIGINT', () => {
    Mongoose.close(() => {
      console.warn('\x1b[33m%s\x1b[0m', '-> Mongoose disconnected through app termination!');
      process.exit(0);
    });
  });

  // Exported the database connection which is to be imported at the server
  exports.default = Mongoose;
} else if (database.toLowerCase() === 'sql') {
  // Bring in the sequelize module
  const Sequelize = require('sequelize');

  const {
    name,
    username,
    password,
    host,
    port,
    dialect
  } = sqlDbConfig;

  const sequelize = new Sequelize(name, username, password, {
    host,
    port,
    dialect,
    logging: false,
    // Logging false to keep the console clean (change it to true to print all queries in console).
    pool: {
      max: 5,
      min: 1,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    }
  });

  /** If have separate master and slave DBs, use following setting instead of the above one. */
  /*
  const {
    nameMaster,
    usernameMaster,
    passwordMaster,
    hostMaster,
    portMaster,
    dialect
  } = sqlMasterDbConfig;

  const {
    nameSlave,
    usernameSlave,
    passwordSlave,
    hostSlave,
    portSlave
  } = sqlSlaveDbConfig;

  const sequelize = new Sequelize({
    dialect,
    logging: true,
    replication: {
      write: {
        host: hostMaster,
        username: usernameMaster,
        password: passwordMaster,
        database: nameMaster,
        port: portMaster,
        pool: {
          max: 30,
          min: 5,
          idle: 10000
        }
      },
      read: [
        {
          host: hostSlave,
          username: usernameSlave,
          password: passwordSlave,
          database: nameSlave,
          port: portSlave,
          pool: {
            max: 20,
            min: 2,
            idle: 10000
          }
        }
      ]
    },
    define: {
      timestamps: true,
      freezeTableName: false,
      underscored: true
    }
  });
  */

  sequelize
    .authenticate()
    .then(() => console.info(`Sequelize connection started on database "${name}" from "${dialect}"`))
    .catch((err) => console.error('\x1B[31m', `=> Sequelize connection error: ${err}`));

  process.on('SIGINT', () => {
    console.warn('\x1b[33m%s\x1b[0m', '-> Sequelize disconnected through app termination!');
    process.exit(0);
  });

  /**
   * Pass name of the model defined in Sequelize Schema and get it imported
   *
   * @param {String} model Name of the model
   *
   * @return {Any} data which is given if it exists or False
   */
  exports.model = (model) => {
    const models = require(`${require.main.path}/src/models/_index`)(sequelize, Sequelize);
    return models[model];
  };

  /** ** Establishing Relationships */
  /** Sequelize One-To-One relationship */
  // this.model('User').hasOne(this.model('Profile'));
  // this.model('Profile').belongsTo(this.model('User'), {
  //   constraints: true,
  //   onDelete: 'CASCADE'
  // });

  /** Sequelize One-To-Many relationship */
  // this.model('User').hasMany(this.model('Product'));
  // this.model('Product').belongsTo(this.model('User'), {
  //   constraints: true,
  //   onDelete: 'CASCADE'
  // });

  /** Sequelize Many-To-Many relationship */
  // this.model('User').belongsToMany(this.model('Product'), {
  //   through: this.model('UserProducts'),
  //   constraints: true,
  //   onDelete: 'CASCADE'
  // });
  // this.model('Product').belongsToMany(this.model('User'), {
  //   through: this.model('UserProducts'),
  //   constraints: true,
  //   onDelete: 'CASCADE'
  // });
  /** ** Establishing Relationships */

  sequelize.sync()
    .then(() => console.info('Sequelize connection synced and relationships established.'))
    .catch((err) => console.error('\x1B[31m', err));

  // Exported the database connection which is to be imported at the server
  exports.default = sequelize;
} else {
  console.warn('\x1b[33m%s\x1b[0m', '-> Application is running without database connection!');
  process.exit(0);
}
