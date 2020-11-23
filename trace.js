const WebSocket = require("ws");
const Traceroute = require("nodejs-traceroute");
const http = require("http");
const fs = require("fs");

const webServer = http.createServer((request, response) => {
    fs.readFile("./index.html", (err, data) => {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(data);
        response.end();
    });
});


const server = new WebSocket.Server({server: webServer});
server.on("connection", (ws) => {
    ws.on("message", (hostname) => {
        const tracer = new Traceroute();
        var pid;
        try {
            tracer
                .on('pid', (tracer_pid) => {
                    pid = tracer_pid;
                })
                .on("hop", (hop) => {
                    try {
                        ws.send(JSON.stringify(hop));
                    } catch (err) {
                        process.kill(pid, 'SIGHUP');
                        return;
                    }

                    if (hop.ip != "*") {
                        try {
                            const endpoint = "http://ip-api.com/json/" + hop.ip;
                            http.get(endpoint, (resp) => {
                                if (resp.statusCode !== 200) {
                                    ws.send(JSON.stringify({
                                        'status': 'error',
                                        'msg': resp.client._host + ': ' + resp.statusCode + ' ' + resp.statusMessage
                                    }));
                                    return;
                                }

                                let loc = '';
                                resp.on("data", (data) => loc += data);
                                try {
                                    resp.on("end", () => ws.send(JSON.stringify({...JSON.parse(loc), ...hop})));
                                } catch (err) {
                                    process.kill(pid, 'SIGHUP');
                                    return;
                                }
                            }).on("error", (err) => {
                                console.log("error:", err);
                            });
                        } catch (err) {
                            return;
                        }
                    }

                })
                .on("close", (code) => {
                    console.log("trace is done");
                    const done = {status: "done",};
                    try {
                        ws.send(JSON.stringify(done));
                    } catch (err) {
                        return;
                    }
                });


            tracer.trace(hostname.toString());
        } catch (ex) {
            console.log(ex);
            try {
                ws.send(JSON.stringify({'status': 'error', 'msg': ex}));
            } catch (err) {
                process.kill(pid, 'SIGHUP');
                return;
            }
        }
    })
});

webServer.listen(8080);
