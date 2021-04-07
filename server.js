const express = require("express");
const server = express();


const cors = require("cors");
const db = require("./models");
// Sets up the Express App
var PORT = process.env.PORT || 8080;


// Sets up the Express app to handle data parsing
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

var corsOptions = {
  origin: 'https://dispatch-rider-front.herokuapp.com'
}
// corsOptions
server.use(cors(corsOptions));
// Static directory
server.use(express.static("public"));
/////////////////////////////////
const message = require("./routes/message-routes.js")
const user = require("./routes/user-routes.js")

const {Server} = require('ws');

const wss = new Server({server});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    ws.send(message);
    console.log(message)
  });
});

// Routes
// =============================================================
server.use(message)
server.use(user)

// Syncing our sequelize models and then starting our Express app
// =============================================================

// Change force: to true if it's cool for the site to remove database items.
db.sequelize.sync({ force: false}).then(function () {
  server.listen(PORT, function () {
    console.log("App listening on PORT http://localhost:" + PORT);
  });
});



///////////////


