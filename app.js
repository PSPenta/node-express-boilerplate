/**** Core modules */
const fs = require('fs');
const path = require('path');
/**** Core modules */

/**** 3rd party modules */
const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();
/**** 3rd party modules */

/**** Local modules */
const config = require("./src/config/config");
const utils = require("./src/helpers/utils");
/**** Local modules */

const app = express();

// Create log file for morgan which stores all the log data
let logDir = path.join(__dirname, 'src/logs', 'access.log');
if (!fs.existsSync(logDir)) {
  if (!fs.existsSync(path.join(__dirname, 'src/logs'))) {
    fs.mkdirSync(path.join(__dirname, 'src/logs'));
  }
  fs.writeFileSync(logDir, '', (err) => {
    if (err) console.error(err);

    console.info("The file was succesfully saved!");
  });
}
const accessLogStream = fs.createWriteStream(logDir, { flags: 'a' });

// Logging of each request using morgan
app.use(morgan('combined', { stream: accessLogStream }));

// Set some special response headers using helmet
app.use(helmet());

// Compress the assets to be sent in response
app.use(compression());

/**
 * @name express-status-monitor
 * @description This middleware will report realtime server metrics for Express-based node servers.
 * Run server and go to /status
 * For further information: https://www.npmjs.com/package/express-status-monitor
 */
app.use(require("express-status-monitor")());

// Best practices app settings
app.set('port', process.env.HTTP_PORT || 8000);
app.set('app URL', process.env.APP_URL || 'localhost:8000');
app.set('title', process.env.APP_NAME);
app.set('query parser', `extended`);

/* Importing database connection when server starts **/
require("./src/config/dbConfig");

/**** Setting up the CORS for app */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
  res.header('Access-Control-Allow-Headers', 'Origin, Authorization, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});
/**** Setting up the CORS for app */

// Form encryption application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

// POST routes/APIs data in application/json format
app.use(bodyParser.json({ limit: "50mb" }));

// serve static files
app.use(express.static(path.join(__dirname, 'src/public')));

app.enable('etag'); // use strong etags
app.set('etag', 'strong');

/**
 * @name Swagger Documentation
 * @description This is used for API documentation. It's not mandatory
 *  */
const swaggerDefinition = config.swaggerDefinition;
const swaggerOptions = config.swaggerOptions;
const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerOptions)
);

/* Configuring Routes */
app.use("/api", require('./src/routes/routes'));

/* Handling invalid route */
app.use("/", function (req, res) {
  res.status(404).send(utils.responseMsg("Route not found!"));
});

/**
 * Listening to port
 */
app.listen(app.get("port"), () => {
  console.info(`Find the server at port:${app.get("port")}`);
});

module.exports = app;
