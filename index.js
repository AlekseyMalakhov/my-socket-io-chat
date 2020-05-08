const express = require('express');
const app = express();
const http = require('http').Server(app);  //http Node js module returns object with a lot of methods. Server() is one of them. We call the method server to express and return http object. Server() actually is a object constructor and it returns our server
const io = require("socket.io")(http);          // socket.io Node Js module returns a function. We give this function our http object and it returns an io object with a lot of useful methods

app.use("/static", express.static(__dirname + '/static'));    //serve our static files from the folder "static" to the server route "/static".

app.get('/', function(req, res){            // when browser connects to a root route it gets a hello world string
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  var addedUser = false;

  socket.on("disconnect", function() {
    console.log(socket.username + " disconnected");
    io.emit("user disconnected", socket.username);
  });

  socket.on("chat message", function(msg, username) {
    io.emit("chat message", msg, username);
  });

  socket.on("user connected", function(username) {
    io.emit("user connected", username);
  });


  socket.on('add user', (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    addedUser = true;

  });

});

const PORT = process.env.PORT || 8080;
http.listen(PORT, function(){               //start our server
  console.log('listening on port ' + PORT);
});