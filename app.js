const serverPort = 3001,
  http = require("http"),
  express = require("express"),
  app = express(),
  server = http.createServer(app),
  WebSocket = require("ws"),
  websocketServer = new WebSocket.Server({ server });
const observer = require("./routes/observable");
const Rxjs = require('rxjs');
const RxjsOperators = require('rxjs/operators');
//when a websocket connection is established

let request = []
websocketServer.on("connection", (webSocketClient) => {
  //send feedback to the incoming connection
  webSocketClient.send('{ "connection" : "ok"}');



  //when a message is received
  webSocketClient.on("message", (message) => {
    if (request.includes(JSON.parse(message).id)){
      const index = request.indexOf(JSON.parse(message).id);
      if (index > -1) {
        request.splice(index, 1);
      }
    } else {
      request.push(JSON.parse(message).id)
    }

    
    const stop = result => request.includes(JSON.parse(result).id);

    let m = JSON.parse(message)
    let data$ = observer.observe(m)
    data$.pipe(RxjsOperators.filter(stop)).subscribe((result) => {
      websocketServer.clients.forEach((client) => {
        client.send(`{ "message" : ${result} }`);
      });
    });
  });
});

//start the web server
server.listen(serverPort, () => {
  console.log(`Websocket server started on port ` + serverPort);
});
