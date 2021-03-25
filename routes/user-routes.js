const router = require("express").Router();
const db = require("../models");
const { Op } = require("sequelize");
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
  console.log(req.body);
  //   let encrypted = await bcrypt.hash(req.body.password, saltRounds);
  let data = await db.User.update(
    { connections: "[1, 3]" },
    {
      where: { firstName: req.body.firstName },
    }
  ).catch((err) => res.json(err));
  res.json(data).end();
});
///////////////////////////////////
router.post("/login", async (req, res) => {
  let data = await db.User.findOne({
    where: {
      username: req.body.username,
    },
  }).catch((err) => console.error(err));
  if (data) {
    let match = await bcrypt.compare(req.body.password, data.password);
    if (match) {
      db.User.update(
        { isOnline: true },
        { where: { username: data.dataValues.username } }
      );

      jwt.sign(
        {
          id: data.dataValues.id,
          firstName: data.dataValues.firstName,
          isOnline: data.dataValues.isOnline,
        },
        process.env.JSON_RIO,
        { expiresIn: "1h" },
        function (err, token) {
          if (err) {
            res.json(err + "line 49 user-routes");
          }
          res.json({ auth: token, id: data.dataValues.id }).end();
        }
      );
    } else {
      res.status(401).end();
    }
  } else {
    res.status(401);
  }
  //   console.log(token);
});

router.get("/friends", async (req, res) => {
  console.log(req.headers);
  let token = false;
  if (!req.headers) {
    token = false;
  } else if (!req.headers.authorization) {
    token = false;
  } else {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    res.status(500);
  } else {
    const data = await jwt.verify(token, process.env.JSON_RIO, (err, data) => {
      if (err) {
        return false;
      } else {
        return data;
      }
    });
    if (data) {
      let individual = await db.User.findOne({
        where: {
          id: data.id,
        },
      }).catch(err =>console.error(err))
        let arr = JSON.parse(individual.dataValues.connections);

        let friends = await db.User.findAll({
          attributes: {
            exclude: [
              "password",
              "username",
              "email",
              "updatedAt",
              "createdAt",
            ],
          },
          where: {
            id: {
              [Op.in]: arr,
            },
          },
        }).catch((err) => res.json("error on line 51 in user routes"));
        console.log(friends)
        res.json(friends).end();
      
    } else {
      res.status(403);
    }
  }
});

module.exports = router;
