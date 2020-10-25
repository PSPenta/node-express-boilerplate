const { verify } = require('jsonwebtoken');

const { responseMsg } = require('../helpers/utils');

exports.jwtAuth = (req, res, next) => {
  if (req.headers.authorization) {
    try {
      let decodedToken = verify(req.headers.authorization.split(' ')[1], process.env.APP_KEY);
      if (decodedToken) {
        req.userId = decodedToken.userId;
        next();
      } else {
        return res.status(401).json(responseMsg('Not authenticated!'));
      }
    } catch (error) {
      return res.status(401).json(responseMsg('Not authenticated!'));
    }
  } else {
    return res.status(401).json(responseMsg('Not authenticated!'));
  }
}
