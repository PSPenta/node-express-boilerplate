const { verify } = require('jsonwebtoken');

const { responseMsg } = require('../helpers/utils');

exports.jwtAuth = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let decodedToken = verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.error('JWT Error: ', err);
          return res.status(440).json(responseMsg('Your login session is either expired or the token is invalid, please try logging in again!'));
        }
        return decoded;
      });
      if (decodedToken) {
        req.userId = decodedToken.userId;
        next();
      } else {
        return res.status(401).json(responseMsg('Invalid token!'));
      }
    } else {
      return res.status(401).json(responseMsg('Not authenticated!'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseMsg('Internal server error!'));
  }
}
