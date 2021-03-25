const express = require("express");
const app = express();
const WebSocket = require('ws'); // new

// express code 
const socketServer = new WebSocket.Server({port: 3030});
socketServer.on('connection', (socketClient) => {
  console.log('connected');
  console.log('client Set length: ', socketServer.clients.size);
  socketClient.on('close', (socketClient) => {
    console.log('closed');
    console.log('Number of clients: ', socketServer.clients.size);
  });
});

const cors = require("cors");
const db = require("./models");
// Sets up the Express App
var PORT = process.env.PORT || 8080;


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// var corsOptions = {
//   origin: 'https://bjh-hop-estore.herokuapp.com'
// }
// corsOptions
app.use(cors());
// Static directory
app.use(express.static("public"));
/////////////////////////////////
const message = require("./routes/message-routes.js")
const user = require("./routes/user-routes.js")


// Routes
// =============================================================
app.use(message)
app.use(user)

// Syncing our sequelize models and then starting our Express app
// =============================================================

// Change force: to true if it's cool for the site to remove database items.
db.sequelize.sync({ force: false}).then(function () {
  app.listen(PORT, function () {
    console.log("App listening on PORT http://localhost:" + PORT);
  });
});



///////////////


