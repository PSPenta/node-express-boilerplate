/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
module.exports = {
  controllers: {
    authClient: require(`${require.main.path}/src/controllers/authController`)
  },
  middlewares: {
    auth: require(`${require.main.path}/src/middlewares/auth`),
    requestValidator: require(`${require.main.path}/src/middlewares/validation`)
  }
};
