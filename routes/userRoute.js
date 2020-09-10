const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const User = require("../models/User");

module.exports = (app) => {
  app.post("/users", (req, res) => {
    const { name, password } = req.body;

    if (!name && !password) {
      return res.status(400).json({ msg: "name ou password required!" });
    }
    User.findOne({ name: name }).then((user) => {
      if (user) {
        return res.status(400).json({ msg: "This name is already in use" });
      } else {
        const newUser = new User({
          name: name,
          password: password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => res.json(user))
              .catch((err) => console.log(err));
          });
        });
      }
    });
  });
};
