var app = require("express")();

var http = require("http").Server(app);

var io = require("socket.io")(http);

var path = require("path");

app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname + "./../client/index.html"));
});

var listData = [
        {
            name: "ZhangShun",
            age: 21,
        },
        {
            name: "LiSi",
            age: 12,
        },
        {
            name: "HuangGou",
            age: "23",
        }
    ];

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log("a user disconnect");
    });
    //有新用户连接的时候 服务端给其他用户的广播推送 注意：不包括自己 且在2个客户端连接的时候才有效
    socket.broadcast.emit("welcome", "A new user onLine!");
    //服务端给每个clinet 连接的时候发送的信息
    socket.emit("welcome", "Welcome to Chat_Room");
    console.log("server begin send msg:" + "Welcome to Chat_Room");
    
    setTimeout(function(){
        socket.emit("welcome", "Welcome to Chat_Room reload!");
    }, 4000);

    //展示当前的在线用户
    socket.on('chat message', function(msg){
        console.log("clinet send message:" + msg);
        //当前连接的客户端和服务端一对一实时推送
        socket.emit("onLine user", listData);
    });
    //添加一个在线用户
    socket.on('add User', function(res){
        listData.push(JSON.parse(res));
        //推送给全局客户端
        io.emit("onLine user", listData);
    });
    //减少一个在线用户
    socket.on("delete User", function(res){
        listData.pop();
        io.emit("onLine user", listData);
    })
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});