
const router = require("express").Router();
const db = require("../models");
const { Op, json } = require("sequelize");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const server = express();
const app = express();
var expressWs = require('express-ws')(app);

router.post("/api/create/message", async (req, res) => {
  let data = await db.Message.create({
    message: req.body.message,
    participants: req.body.participants,
  }).catch((err) => res.json(err));
  res.json(data).end();
});


const aWss = expressWs.getWss();

router.ws("/test", function (ws, req) {
  console.log("connnect")
  ws.onmessage = function (msg) {
    // router.ws("/bru", function (ws, req) {
    //   console.log("routing")
    //    ws.send("blub")
    // });

    console.log("dango")
    aWss.clients.forEach(function (client) {
      ws.send(msg.data);
      console.log(msg.data)
    });
  };
});

router.ws("/bru", function (ws, req) {
  // console.log("connect")
  ws.onmessage = (event) => {
    console.log(event.data)
    // aWss.clients.forEach(client => {
      ws.send(event.data)
    // })
  }
    
     
  });

router.post("/sendMessage", async (req, res) => {
  // 
  
  // let token = false;
  // if (!req.headers) {
  //   token = false;
  // } else if (!req.headers.authorization) {
  //   token = false;
  // } else {
  //   token = req.headers.authorization.split(" ")[1];
  // }
  // if (!token) {
  //   res.status(500);
  // } else {
  //   const data = await jwt.verify(token, process.env.JSON_RIO, (err, data) => {
  //     if (err) {
  //       res.status(403).end();
  //     } else {
  //       return data;
  //     }
  //   });
  //   if (data) {
  

  
  console.log(req.body.participants);
  let postedData = await db.Message.create({
    message: req.body.message,
    participants: JSON.stringify(req.body.participants),
    author: req.body.author,
  }).catch((err) => res.json(err));

  let messages = await db.Message.findAll({
    where: {
      participants: postedData.dataValues.participants,
    },
  }).catch((err) => res.json(err));
  res.json(messages);

  //   } else {
  //     res.status(403);
  //   }
  // }
});

router.get("/conversation/specific/:participants", async (req, res) => {
  let test = req.params.participants.split(",");
  let personArr = JSON.stringify(test);
  // console.log(personArr)
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
        res.status(403).end();
      } else {
        return data;
      }
    });
    if (data) {
      let postedData = await db.Message.findAll({
        where: {
          participants: personArr,
        },
      }).catch((err) => res.json(err));
      res.json(postedData);
    } else {
      res.status(403);
    }
  }
});
///////////////////////////////////////////////////////////////////////
router.get("/groupconversation/specific/:participants", async (req, res) => {
  let personArr = req.params.participants.split(",");

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
        res.status(403).end();
      } else {
        return data;
      }
    });
    if (data) {
      let participantDataArr = [];

      for (let i = 0; i < personArr.length; i++) {
        let individual = await db.User.findOne({
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
            id: parseInt(personArr[i]),
          },
        }).catch((err) => console.error(err));

        participantDataArr.push(individual.dataValues);
      }
      res.json(participantDataArr);
    } else {
      res.status(403);
    }
  }
});
/////////////////////////

router.get("/conversation", async (req, res) => {
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
        res.status(403).end();
      } else {
        return data;
      }
    });
    if (data) {
      let postedData = await db.Message.findAll().catch((err) =>
        console.error(err)
      );
      console.log(postedData);
      let resArr = [];
      for (let i = 0; i < postedData.length; i++) {
        if (postedData[i].dataValues.participants.includes(data.id)) {
          let exactMatch = await db.Message.findOne({
            where: {
              participants: postedData[i].dataValues.participants,
            },
          }).catch((err) => console.error(err));

          resArr.push(JSON.stringify(exactMatch));
        }
      }

      let reducedArr = [...new Set(resArr)];

      res.json(reducedArr.map((item) => JSON.parse(item)));
    } else {
      res.status(403);
    }
  }
});

router.put("/update/participants", async (req, res) => {
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
        res.status(403).end();
      } else {
        return data;
      }
    });
    if (data) {
      const clone = req.body.old.slice();
      const newArr = [...clone, req.body.new];

      console.log(newArr);
      console.log(req.body.old);

      let newData = await db.Message.update(
        { participants: JSON.stringify(newArr) },
        {
          where: {
            participants: JSON.stringify(req.body.old),
          },
        }
      );
      res.json(newArr);
    } else {
      res.status(403);
    }
  }
});

router.delete("/deleteMessage/:id", async (req, res) => {
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
        res.status(403).end();
      } else {
        return data;
      }
    });
    if (data) {
      let newData = await db.Message.destroy({
        where: {
          id: req.params.id,
        },
      }).catch((err) => {
        console.error(err);
      });
      console.log(newData);
    } else {
      res.status(403);
    }
  }
});

router.put("/unsubscribe", async (req, res) => {
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
        res.status(403).end();
      } else {
        return data;
      }
    });
    if (data) {
      let newArr = [...req.body];
      let index = newArr.indexOf(data.id.toString());
      newArr.splice(index, 1);
      console.log(newArr);
      console.log(req.body);

      let newData = await db.Message.update(
        { participants: JSON.stringify(newArr) },
        {
          where: {
            participants: JSON.stringify(req.body),
          },
        }
      ).catch((err) => console.error(err));
      res.json("Success");
    } else {
      res.status(403);
    }
  }
});

module.exports = router;
