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

  app.post("/api/login", async (req, res) => {
    const { name, password } = req.body;

    if (!name && !password) {
      return res.status(400).json({ msg: "Name and password required!" });
    }

    const user = await User.findOne({ name });

    if (!user) {
      return res.status(404).json({ msg: "this user does not exist" });
    }

    const isEqual = bcrypt.compare(password, user.password);

    if (!isEqual) {
      return res.status(400).json({ msg: "password incorrect" });
    }

    const payload = {
      user: {
        id: user.id,
        name: user.name,
      },
    };
    const token = await jwt.sign(payload, keys.secretOrKey, {
      expiresIn: "24h",
    });

    return res.status(200).json({ token: token });
  });
};
