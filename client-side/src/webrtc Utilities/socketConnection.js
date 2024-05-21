import io from 'socket.io-client';

let socket;
const socketConnection = (userName) => {

    if(socket && socket.connected){
        console.log("socket connection already exits: ", socket.connected)
        return socket;
    }else {
        const socket = io.connect('https://localhost:8000', {
            auth: {
                userName
            }
        });
        if(userName === 'test'){
            console.log('Testing...');
            //espect response from sihnalling server,
            //response saved in ping
            const ping = socket.emitWithAck('test');
            console.log(ping)
        }
        return socket;
    }
};

export default socketConnection;