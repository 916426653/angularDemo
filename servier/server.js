var http = require('http');
var fs = require('fs');
var url = require('url');
var queryString = require('querystring');


var port = 8888;

var data = {
    zs: {name: 'zs', age: 10},
    ls: {name: 'ls', age: 100}
};

//创建一个服务器,
var server = http.createServer(function (req, res) {
        res.setHeaders

        console.log('正在请求: ' + req.url);
        /**
         * MIME:
         * text/html --网页
         * text/plain --普通文本
         * application/json ----json字符串
         *
         * 浏览器根据MIME来判断资源的类型。然后以对应的方式处理他。
         *
         * */
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        //列表接口
        if (/^\/list/.test(req.url)) {

            res.end(JSON.stringify(data));
        }
        //用户获取接口--详情接口
        else if (/^\/get\?/.test(req.url)) {
            var query = url.parse(req.url).query;
            var args = queryString.parse(query);
            console.log('查询:' + args.name);
            var d = data[args.name];
            res.end(JSON.stringify(d));
        }
        //用户获取接口--详情接口
        else if (/^\/create/.test(req.url)) {
            req.on('data',function(param){

                console.log(param.toString()+'sssss');

                var args = JSON.parse(param.toString());
                console.log('新增:' + args.name);

                var name = args.name;
                var age = args.age;
                if(data[name]){
                    var msg = {code: 200, msg: '更新成功:' + name}
                    res.end('')
                }
                data[args.name] = {name: name, age: age};
                var msg = {code: 200, msg: '新增成功:' + name}
                res.end(JSON.stringify(msg));
            })

        }

        //用户获取接口--详情接口
        else if (/^\/remove\?/.test(req.url)) {
            var query = url.parse(req.url).query;
            var args = queryString.parse(query);
            console.log('删除:' + args.name);
            delete  data[args.name];
            var msg = {msg: '删除成功' + args.name, code: 200};
            res.end(JSON.stringify(msg));
        }
        //jsonp 接口
        else if (/getData/.test(req.url)) {
            var data = {name: 'zs', age: 10};
            var arg = url.parse(req.url).query;
            var args = queryString.parse(arg);
            var callback = args.callback;
            console.log(callback);
            res.end(callback+'('+JSON.stringify(data)+')');
        }

        else {
            res.setHeader('Content-Type', 'text/html;charset=utf-8');
            serverFile('../' + req.url, function (content) {
                res.end(content);
            })
        }

    })
    ;

server.listen(port, function (err) {
    err || console.log('服务器启动成功,在端口:' + port + "监听。。。")
})

function serverFile(pathName, fn) {
    /**
     * 判断文件是否存在
     */
    fs.access(pathName, function (err) {
        /**
         * 如果没有错误
         */
        if (!err) {
            fs.readFile(pathName, function (err, content) {
                if (!err) {

                    fn(content);
                }
            })
        } else {
            fn('file not exist!')
        }
    })
}

