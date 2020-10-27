# Node API Boilerplate

## Installation Guide

### System Package Dependencies :-
 **Nodejs:** [Download](https://nodejs.org/en/download/)
_version:-_ `>= v10.16.3`

### Development Setup :-
1. Clone the repository and install dependencies
	 ```bash
	 $ git clone https://github.com/PSPenta/node-global-boilerplate.git
	 $ npm install ( If wants to work with existing version of packages )
	 $ npm run update:packages ( If wants to work with latest version of packages )
	```
2. To start with database configuration create *.env* file from referencing the *env.example* file.
	**For MongoDB install [Mongoose](https://mongoosejs.com/) package**
	```bash
	$ npm i -S mongoose mongoose-aggregate-paginate-v2
	```

	**For SQL DB install [Sequelize](https://sequelize.org/v5/) package**
	```bash
	$ npm i -S sequelize sequelize-paginate
	```

	**Sequelize supports multiple dialects for RDBMS**
	**One of the following command with respect to database:**
	```bash
	$ npm install --save pg pg-hstore 	# postgres dialect
	$ npm install --save mysql2 		# mysql dialect
	$ npm install --save mariadb 		# mariadb dialect
	$ npm install --save sqlite3 		# sqlite dialect
	$ npm install --save tedious 		# mssql dialect
	```
3. After that, if using Sequelize, create database to complete the DB connection. *(if you want to use DB migrations, you can use [sequelize-cli](https://sequelize.org/master/manual/migrations.html) as a dev dependency)*
	```bash
	$ npm install --save-dev sequelize-cli
	```

4. To run tests
	```bash
	$ npm test
	```
5. Start the application
	```bash
	$ npm start
	```

### Local Authentication Service Setup
1. Add environment variables in *.env* file referencing from *env.example* file.
2. In ***app.js*** file require ***passport.js*** and the ***src/services/authServices.js*** and initialize passport.js.
	```js
	const passport = require('passport');
	require('./src/services/authServices');
	passport.initialize();
	```
3. To create a JWT token use ***createToken()*** from authServices.js which takes object and add it in token.
4. To authenticate any routes use ***passport.authenticate()*** as middleware on it.
```js
const passport = require('passport');
router.use('/demo', passport.authenticate('jwt', { session : false }), (req, res) => {});
```

```diff
- Please remove this README.md file when working with live project.
```
