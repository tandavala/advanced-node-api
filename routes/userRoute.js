const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const User = require("../models/User");
const { restart } = require("nodemon");

module.exports = (app) => {
  app.post("/api/users", async (req, res) => {
    const { name, password } = req.body;

    if (!name && !password) {
      return res.status(400).json({ msg: "name ou password required!" });
    }

    let user = await User.findOne({ name: name });

    if (user) {
      return res.status(401).json({ msg: "this name is already in use" });
    }

    try {
      user = new User({
        name: name,
      });

      const salt = 10;
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: {
          id: user.id,
          name: user.name,
        },
      };

      const token = await jwt.sign(payload, keys.secretOrKey, {
        expiresIn: 3600,
      });
      res.status(201).json({ token: token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "errror in server " });
    }
  });

  app.post("/api/login", (req, res) => {
    const { name, password } = req.body;

    if (!name && !password) {
      return res.status(400).json({ msg: "Name and password required!" });
    }

    User.findOne({ name: name }).then((user) => {
      if (!user) {
        return res.status(404).json({ msg: "This user does not exist" });
      }
      bcrypt.compare(password, user.password).then((err, isMatch) => {
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
