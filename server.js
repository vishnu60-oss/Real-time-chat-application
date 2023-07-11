const http = require("http");
const express= require("express");
const exp = require("constants");

const app = express();

const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname+'/public'));

app.get('/',(req,res)=>{
res.sendFile(__dirname+'/index.html');
})

/* Socket.io setup  */

const io = require("socket.io")(server);
const { Socket } = require("dgram");

var users={};

io.on("connection",(socket)=>{
    // console.log(socket.id);
    socket.on("new-user-joined",(username)=>{
        users[socket.id]=username;
        // console.log(users);
        socket.broadcast.emit('user-connected',username); // new user connect hone pe baki logo ko notification jayega
        io.emit("user-list",users); // sare logo ko message krne ke liye
    });

    socket.on("disconnect",()=>{
        socket.broadcast.emit('user-disconnected',user=users[socket.id]);
        delete users[socket.io];   // user left message
        io.emit("user-list",users); // sare logo ko message krne ke liye
    });

    socket.on('message',(data)=>{
        socket.broadcast.emit("message",{user: data.user,msg: data.msg});
    });
});

/* Socket.io setup Ends  */

server.listen(port, ()=>{
    console.log("Server started at "+port);
});