
var http = require('http');
var port = 8888;

var server = http.createServer(function (req, res) {
    console.log(req.url+'正在请求');

    if(/getData/.test(req.url)){
        var data = {name:'zs',age:10}
        res.end('callback('+JSON.stringify(data)+')');
    }else{
        res.end('没有这个接口');
    }
});

server.listen(port,function (err) {
    err || console.log('服务器启动成功在'+port);
})