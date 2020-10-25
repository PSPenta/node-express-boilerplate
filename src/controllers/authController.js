const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { responseMsg } = require('../helpers/utils');
const User = require('../models/User');

exports.jwtLogin = async (req, res, next) => {
  try {
    const userData = await User.findOne({ username: req.body.username });
    let token = '';
    if (userData && await bcrypt.compare(req.body.password, userData.password)) {
      token = jwt.sign(
        {
          username: userData.username,
          userId: userData._id.toString()
        },
        process.env.APP_KEY,
        { expiresIn: process.env.JWT_EXPIRE_IN || '1h' }
      );
    }
    if (token) {
      return res.json(responseMsg(null, true, { 'token': token }));
    } else {
      return res.status(404).json(responseMsg('User not found!'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseMsg('Something went wrong!'));
  }
}
