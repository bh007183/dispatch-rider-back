const router = require("express").Router();
const db = require("../models");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

router.post("/api/create/account", async (req, res) => {
  let encrypted = await bcrypt.hash(req.body.password, saltRounds);
  let data = await db.User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    firstName: req.body.firstName,
    email: req.body.email,
    password: encrypted,
  }).catch((err) => res.json(err));
  res.json(data).end();
});

router.put("/api/update/account", async (req, res) => {
  console.log(req);
  let encrypted = await bcrypt.hash(req.body.password, saltRounds);
  let data = await db.User.update(req.body, {
    where: {},
  }).catch((err) => res.json(err));
  res.json(data).end();
});

router.post("/login", async (req, res) => {
  let data = await db.User.findOne({
    where: {
      username: req.body.username,
    },
  }).catch((err) => console.error(err));
console.log(data.dataValues.username)
  let match = await bcrypt.compare(req.body.password, data.password);
  if (match) {
    db.User.update({ isOnline: true }, { where: {username: data.dataValues.username} });
    jwt.sign(
      {
           id: data.dataValues.id, 
           firstName: data.dataValues.firstName, 
           isOnline: data.dataValues.isOnline 
        },
      process.env.JSON_RIO,
      { expiresIn: "1h" },
      function (err, token) {
        if (err) {
          res.json(err + "line 49 user-routes");
        }
        res.json({auth: token, id: data.dataValues.username}).end();
      }
    );
  } else {
    res.json("error on line 51 user-routes");
  }

//   console.log(token);
});

module.exports = router;
