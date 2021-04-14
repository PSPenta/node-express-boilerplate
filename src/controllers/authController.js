const { compare } = require('bcrypt');
const { sign } = require('jsonwebtoken');

const { responseMsg } = require('../helpers/utils');

exports.jwtLogin = async (req, res, next) => {
  try {
    // const userData = await model('User').findOne({ username: req.body.username });
    // const userData = await model('User').findAll({ where: { username: req.body.username } });
    // Note: If using Sequelize, update userData to userData[0] for all the following occurrances
    let token = '';
    if (userData && await compare(req.body.password, userData.password)) {
      token = sign(
        {
          username: userData.username,
          userId: userData._id.toString()
        },
        process.env.APP_KEY,
        { expiresIn: process.env.JWT_EXPIRE_IN || '1h' }
      );
    }
    if (token) {
      return res.json(responseMsg(null, true, { token }));
    }
    return res.status(404).json(responseMsg('User not found!'));
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseMsg('Something went wrong!'));
  }
};
