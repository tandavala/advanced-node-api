const User = require("../models/User");

module.exports = (app) => {
  app.post("/", (req, res) => {
    res.send("create User");
  });
};
