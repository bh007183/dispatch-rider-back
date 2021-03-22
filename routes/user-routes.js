const router = require("express").Router();
const db = require("../models");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config()


router.post("/api/create/account", async (req, res) => {
    console.log(req)
    let encrypted = await bcrypt.hash(req.body.password, saltRounds)
   let data = await db.User.create({
       firstName: req.body.firstName,
       lastName: req.body.lastName,
       username: req.body.username,
       firstName: req.body.firstName,
       email: req.body.email,
       password: encrypted,
   }).catch(err => res.json(err))
   res.json(data).end()
})


module.exports = router;