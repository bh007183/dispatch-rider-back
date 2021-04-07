const express = require("express");
const app = express();
var expressWs = require('express-ws')(app);


const cors = require("cors");
const db = require("./models");
// Sets up the Express App
var PORT = process.env.PORT || 8080;


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var corsOptions = {
  origin: 'https://dispatch-rider-front.herokuapp.com'
}
// corsOptions
app.use(cors(corsOptions));
// Static directory
app.use(express.static("public"));
/////////////////////////////////
const message = require("./routes/message-routes.js")
const user = require("./routes/user-routes.js")


app.ws('/test', function (ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
  });
  console.log('socket', req.testing);
})


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


