const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const User = require("../models/User");
const { restart } = require("nodemon");

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

  app.post("/users/login", (req, res) => {
    const { name, password } = req.body;

    if (!name && !password) {
      return res.status(400).json({ msg: "Name and password required!" });
    }

    User.findOne({ name: name }).then((user) => {
      if (!user) {
        return res.status(404).json({ msg: "This user does not exist" });
      }
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          const payload = { id: user.id, name: user.name };

          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
        } else {
          return res.status(400).json("bad");
        }
      });
    });
  });
};
