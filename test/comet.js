
global.messages = {
    //'resid':[]
};

var char500 = (function() {
    var i = 0;
    var arr = [];
    for( i = 0; i < 500; i++) {
        arr.push(' ');
    }
    return arr.join('');
})();

var http_method_funs = {
    'GET' : function(resid, data, request, response) {
        if(global.messages[resid] == undefined) {
            global.messages[resid] = [];
        }

        response.writeHead(200, {
            'content-type' : 'text/plain'
        });

        var interval = setInterval(myoutput, 500);
        response.connection.on('end', function() {
            console.log("GET\t" + resid + "\tclosed");
            clearInterval(interval);
        });
        myoutput();

        function myoutput() {

            var msgs = global.messages[resid];
            if(msgs.length) {
                var str = msgs.join("\n\n\n") + "\n\n\n";
                str = (str.length < 500 ) ? (str + char500 ) : str;
                console.log( "write str: " + str );
                response.write(str);
                global.messages[resid] = [];
            }

        }

    },
    'PUT' : function(resid, data, request, response) {
        if(global.messages[resid] == undefined) {
            global.messages[resid] = [];
        }

        global.messages[resid].push(data);
        console.log(global.messages);

        response.writeHead(200, {
            'content-type' : 'text/plain'
        });
        response.end('ok\n');
    },
};
//method function

require('http').createServer(function(request, response) {

    var urlinfo = require('url').parse(request.url);
    var resid = urlinfo['pathname'];
    var data = (urlinfo['query']) ? urlinfo['query'] : 0;
    var method = request.method;

    console.log(method + "\t" + resid);

    if( typeof http_method_funs[method] == 'function') {
        http_method_funs[method].call(null, resid, data, request, response);
    } else {
        response.writeHead(400);
        response.end("unsupport method\n");
    }

}).listen(18124);
console.log('server running at http://127.0.0.1:18124/');
