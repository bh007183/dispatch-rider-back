const router = require("express").Router();
const db = require("../models");

router.post("/api/create/message", async (req, res) => {
    console.log(req)
    
   let data = await db.Message.create({
       message: req.body.message,
       participants: req.body.participants,
       
   }).catch(err => res.json(err))
   res.json(data).end()
})

module.exports = router;