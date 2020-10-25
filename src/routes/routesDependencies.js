module.exports = {
  controllers: {
    // List Controllers
    authClient: require('../controllers/authController')
  },
  middlewares: {
    auth: require('../middlewares/auth')
  }
};
