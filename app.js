const express = require('express');
const app = express();
const http = require("http");
const path = require('path');

const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket){
    socket.on("send-location", function(data){
        // console.log(data);
        io.emit("recieve-location", {id: socket.id,pos:data});
    });
    
    socket.on("disconnet", function(){
        io.emit("user-disconnected", socket.id);
    });
});

app.get("/", function (req, res) {  // creating route
    res.render("index");
} );

server.listen(3000); //listening at this port

