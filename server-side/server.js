
const fs = require('fs');
const http = require('http')
const path = require('path')
const express = require('express');
const app = express();
const cors = require('cors');
const socketio = require('socket.io');
// app.use(express.static(__dirname))
app.use(express.static(path.join(__dirname)))
////**MAJOR CHANGE**////

//we need a key and cert to run https
//we generated them with mkcert
// $ mkcert create-ca
// $ mkcert create-cert
// const key = fs.readFileSync('./.cert/create-cert-key.pem');
// const cert = fs.readFileSync('./.cert/create-cert.pem');

//we changed our express setup so we can use https
//pass the key and cert to createServer on https
const expressServer = http.createServer(app);
app.use(cors({
    cors: [
        "http://localhost:3000",
        "https://localhost:3000"
    ],
    method: [
        'GET',
        'POST'
    ]
}));
// const expressServer = http.createServer(app);
//create our socket.io server... it will listen to our express port
const io = socketio(expressServer,{
    cors: [
        "http://localhost:3000",
        "https://localhost:3000"
    ],
    method: [
        'GET',
        'POST'
    ]
});


expressServer.listen(8001);

//offers will contain {}
const offers = [
    // offererUserName
    // offer
    // offerIceCandidates
    // answererUserName
    // answer
    // answererIceCandidates
 ];
const connectedSockets = [
    //username, socketId
]

io.on('connection',(socket)=>{
    // console.log("Someone has connected");
    const userName = socket.handshake.auth.userName;
    const password = socket.handshake.auth.password;
 
    connectedSockets.push({
        socketId: socket.id,
        userName
    })
    console.log(connectedSockets)

    //test connectivity
    socket.on('test',ack=>{
        ack('pong')
    })

    //a new client has joined. If there are any offers available,
    //emit them out
    if(offers.length){
        socket.emit('availableOffers',offers);
    }
    
    socket.on('newOffer',newOffer=>{
        console.log("newOffer!")
        // console.log(newOffer)
        offers.push({
            offererUserName: userName,
            offer: newOffer,
            offerIceCandidates: [],
            answererUserName: null,
            answer: null,
            answererIceCandidates: []
        })
        // console.log(newOffer.sdp.slice(50))
        //send out to all connected sockets EXCEPT the caller
        console.log("Emmiting newOfferAwaiting")
        socket.broadcast.emit('newOfferAwaiting',offers.slice(-1))
    })

    socket.on('newAnswer',(offerObj,ackFunction)=>{
        // console.log(offerObj);
        console.log(connectedSockets)
        console.log("Requested offerer",offerObj.offererUserName)
        //emit this answer (offerObj) back to CLIENT1
        //in order to do that, we need CLIENT1's socketid
        const socketToAnswer = connectedSockets.find(s=>s.userName === offerObj.offererUserName)
        if(!socketToAnswer){
            console.log("No matching socket")
            return;
        }
        //we found the matching socket, so we can emit to it!
        const socketIdToAnswer = socketToAnswer.socketId;
        //we find the offer to update so we can emit it
        const offerToUpdate = offers.find(o=>o.offererUserName === offerObj.offererUserName)
        if(!offerToUpdate){
            console.log("No OfferToUpdate")
            return;
        }
        //send back to the answerer all the iceCandidates we have already collected
        ackFunction(offerToUpdate.offerIceCandidates);
        offerToUpdate.answer = offerObj.answer
        offerToUpdate.answererUserName = userName
        //socket has a .to() which allows emiting to a "room"
        //every socket has it's own room
        console.log(socketIdToAnswer)
        socket.to(socketIdToAnswer).emit('answerResponse',offerToUpdate)
    })

    socket.on('sendIceCandidateToSignalingServer',iceCandidateObj=>{
        const { didIOffer, iceUserName, iceCandidate } = iceCandidateObj;
        // console.log(iceCandidate);
        if(didIOffer){
            //this ice is coming from the offerer. Send to the answerer
            const offerInOffers = offers.find(o=>o.offererUserName === iceUserName);
            if(offerInOffers){
                offerInOffers.offerIceCandidates.push(iceCandidate)
                // 1. When the answerer answers, all existing ice candidates are sent
                // 2. Any candidates that come in after the offer has been answered, will be passed through
                if(offerInOffers.answererUserName){
                    //pass it through to the other socket
                    const socketToSendTo = connectedSockets.find(s=>s.userName === offerInOffers.answererUserName);
                    if(socketToSendTo){
                        socket.to(socketToSendTo.socketId).emit('receivedIceCandidateFromServer',iceCandidate)
                    }else{
                        console.log("Ice candidate recieved but could not find answere")
                    }
                }
            }
        }else{
            //this ice is coming from the answerer. Send to the offerer
            //pass it through to the other socket
            //console.log("These are offers if type of calll is answer: ", offers)
            const offerInOffers = offers.find(o=>o.answererUserName === iceUserName);
            //console.log("This si offer: ", offerInOffers)
            let socketToSendTo
            if(offerInOffers){
                socketToSendTo = connectedSockets.find(s=>s.userName == iceUserName)
                console.log("Offer found", socketToSendTo)
            };
            if(socketToSendTo){
                socket.to(socketToSendTo.socketId).emit('receivedIceCandidateFromServer',iceCandidate)
                console.log("This is the icecandidate sent: ", iceCandidate)
            }else{
                console.log("Ice candidate recieved but could not find offerer")
            }
        }
        // console.log(offers)
    })

    socket.on('disconnect',()=>{
        const offerToClear = offers.findIndex(o=>o.offererUserName === userName)
        console.log("Connection has ended: ", offerToClear)
        offers.splice(offerToClear,1)
        socket.emit('availableOffers',offers);
    })
})
