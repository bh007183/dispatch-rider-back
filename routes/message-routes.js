const router = require("express").Router();
const db = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

router.post("/api/create/message", async (req, res) => {
    
    
   let data = await db.Message.create({
       message: req.body.message,
       participants: req.body.participants,
       
   }).catch(err => res.json(err))
   res.json(data).end()
})

router.post("/sendMessage", async (req, res) => {
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
        let postedData = await db.Message.create({
            message: req.body.message,
            participants: JSON.stringify(req.body.participants)
        }).catch(err => res.json(err))
        res.json(postedData)


      } else {
        res.status(403);
      }
    }
  });

module.exports = router;