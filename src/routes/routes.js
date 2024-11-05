/* eslint-disable import/no-dynamic-require */
const router = require('express').Router();
const { check } = require('express-validator');

const dependencies = require('./routesDependencies');

const { response } = require(`${require.main.path}/src/helpers/utils`);

// Route for server Health Check
router.get('/health', (req, res) => res.json(response(null, true, { success: true })));

/**
 * @swagger
 * /login:
 *  post:
 *    tags:
 *      - Authentication
 *    name: Local Login API
 *    summary: Based on user's data, this api sent jwt token which leads to login process.
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: Body Data
 *        in: body
 *        schema:
 *         type: object
 *         properties:
 *          email:
 *            type: string
 *          password:
 *            type: string
 *        required:
 *         - email
 *         - password
 *    responses:
 *      200:
 *        description: JWT token will be in response.
 *      500:
 *        description: Internal server error.
 */
router.post(
  '/login',
  [
    check('email').exists().withMessage('The email is mandatory!')
      .isEmail()
      .normalizeEmail(),
    check('password', '...')
      .exists().withMessage('The password is mandatory!')
      .isLength({ min: 8, max: 15 })
      .withMessage('The password length must be between 8 and 15 digits!')
      .matches(/^(?=.*\d)(?=.*[!@#$&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$&*]{8,15}$/, 'i')
      .withMessage('The password must contain at least 1 uppercase, 1 lowercase, 1 special character and 1 number!')
  ],
  dependencies.middlewares.requestValidator.validateRequest,
  dependencies.controllers.authClient.jwtLogin
);

/**
 * @swagger
 * /auth/logout:
 *  get:
 *    tags:
 *      - Authentication
 *    name: Logout API
 *    summary: This api terminates the login session of the user whose token is passed.
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: Param Data
 *        in: param
 *        schema:
 *          type: object
 *    responses:
 *      200:
 *        description: Success message.
 *      403:
 *        description: Unauthorized user.
 *      500:
 *        description: Internal server error.
 */
router.get(
  '/logout',
  dependencies.middlewares.auth.jwtAuth,
  dependencies.controllers.authClient.jwtLogout
);

module.exports = router;
