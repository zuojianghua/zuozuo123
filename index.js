var express = require('express');
var app = express();
app.use('/assets',express.static('assets'));
app.use('/example',express.static('example'));
app.use('/bower_components',express.static('bower_components'));
app.get('/', function (req, res) {
    res.set('Content-Type', 'text/html');
    res.sendfile('index.html');
});
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});