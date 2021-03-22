const router = require("express").Router();
const db = require("../models");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config()


module.exports = router;