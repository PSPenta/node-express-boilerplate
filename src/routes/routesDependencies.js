module.exports = {
  controllers: {
    authClient: require('../controllers/authController')
  },
  middlewares: {
    auth: require('../middlewares/auth')
  }
};
