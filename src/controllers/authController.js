/* eslint-disable no-undef */
const { compare } = require('bcrypt');
const { StatusCodes } = require('http-status-codes');
const { sign } = require('jsonwebtoken');

const { jwt } = require('../config/serverConfig');
const { response } = require('../helpers/utils');

exports.jwtLogin = async (req, res) => {
  try {
    // Mongoose Query
    // const userData = await model('User').findOne({ username: req.body.username });

    // Sequelize Query
    // const userData = await model('User').findOne({ where: { username: req.body.username } });
    let token = '';
    if (userData && await compare(req.body.password, userData.password)) {
      token = sign(
        {
          username: userData.username,
          // eslint-disable-next-line no-underscore-dangle
          userId: userData._id.toString()
        },
        jwt.secret,
        { expiresIn: jwt.expireIn }
      );
    }
    if (token) {
      return res.json(response(null, true, { token }));
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response('User not found!'));
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response('Something went wrong!'));
  }
};

exports.jwtLogout = async (req, res) => {
  try {
    if (!req.headers.authorization) {
      return res.status(StatusCodes.UNAUTHORIZED).json(response('You are not authorized to access this page!'));
    }

    const token = req.headers.authorization.split(' ')[1];
    if (token) {
      await model('Blacklist').create({
        token,
        user: req.userId
      });
    }
    return res.json(response(null, true, 'Successfully logged out!'));
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response('Something went wrong!'));
  }
};
