/* eslint-disable import/no-dynamic-require */
const { StatusCodes } = require('http-status-codes');
const { verify } = require('jsonwebtoken');

const { jwt } = require(`${require.main.path}/src/config/serverConfig`);
const { response } = require(`${require.main.path}/src/helpers/utils`);

// eslint-disable-next-line consistent-return
exports.jwtAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      console.error('Invalid authorization!');
      return res.status(StatusCodes.UNAUTHORIZED).json(response('You are not authorized to access this page!'));
    }

    const token = req.headers.authorization.split(' ')[1];
    // const blacklistedToken = await model('Blacklist').findOne({ token });
    // const blacklistedToken = await model('Blacklist').findOne({ where: { token } });
    // eslint-disable-next-line no-undef
    if (blacklistedToken) {
      console.error('Token blacklisted!');
      return res.status(StatusCodes.UNAUTHORIZED).json(response('You are not authorized to access this page!'));
    }

    // eslint-disable-next-line consistent-return
    verify(token, jwt.secret, (err, decoded) => {
      if (err) {
        console.error('JWT Error:', err);
        return res.status(StatusCodes.UNAUTHORIZED).json(response('Your login session is either expired or the token is invalid, please try logging in again!'));
      }

      if (decoded && decoded.userId) {
        req.userId = decoded.userId;
        // req.userType = decoded.role;
        next();
      } else {
        console.error('Token is invalid!');
        return res.status(StatusCodes.UNAUTHORIZED).json(response('You are not authorized to access this page!'));
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response('Internal server error!'));
  }
};
