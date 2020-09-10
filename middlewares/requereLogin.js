const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    res.status(401).json({ msg: "You must login first!" });
  }

  try {
    const decoded = jwt.verify(token, keys.secretOrKey);

    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "token is invalid" });
  }
};
