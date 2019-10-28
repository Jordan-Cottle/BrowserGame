
class Connection{
    constructor(protocol, host, port, messageHandler, onOpen){
        this.ready = false;
        let url = protocol + "://" + host + ':' + port;
        try{
            this.socket = new WebSocket(url);
        }
        catch (exception){
            console.log(exception);
            return;
        }

        this.socket.onopen = onOpen;

        this.socket.onclose = function (event){
            this.ready = false;
            console.log("Connection closed!");
            console.log(event);
        }

        this.socket.onerror = function(event){
            console.log("Error!");
            console.log(event);
        }

        this.socket.onmessage = messageHandler;
    }

    send(message){
        if(this.socket.readyState != WebSocket.OPEN){
            this.ready = true;
            console.log("Connection not open!");
            return;
        }
        
        this.socket.send(message);
    }
}

class Client{
    constructor(onConnect, onMessage){
        this.connection = new Connection('ws', 'localhost', 5555, onConnect, onMessage);
        
    }

    send(message){
        if(!this.isReady()){
            return;
        }
        this.connection.send(message);
    }

    close(){
        this.connection.close();
    }
}