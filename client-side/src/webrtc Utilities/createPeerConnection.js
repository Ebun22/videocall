import socketConnection from "./socketConnection";
import iceConfiguration from "./stunServers";

const createPeerConnection = (userName, typeOfCall) => {
    const socket = socketConnection(userName);
    try{
        const peerConnection = new RTCPeerConnection(iceConfiguration);
        let remoteStream = new MediaStream();

        peerConnection.addEventListener('signalingstatechange', (event) => {
            console.log(event)
            console.log(peerConnection.signalingState)
        });

        peerConnection.addEventListener('icecandidate', (event) => {
            if(event.candidate){
                socket.emit('sendIceCandidateToSignalingServer', {
                    iceCandidate: event.candidate,
                    iceUserName: userName,
                    didIOffer: typeOfCall === "offer"
                })
            }
         
        })

        peerConnection.addEventListener('track', (event) => {
            event.streams[0].getTracks().forEach(track => {
                remoteStream.addTrack(track, remoteStream)
            })
        });

        peerConnection.addEventListener('iceconnectionstatechange', (event) => {
            console.log("this connection has been disconncted: ", event);
            if(peerConnection.iceConnectionState === "disconnected"){
               console.log("this connection has been disconncted: ", peerConnection.iceConnectionState);
               peerConnection.ontrack = null;
               remoteStream.getTracks().forEach(track => {
                    remoteStream.removeTrack(track,remoteStream)
               })
               remoteStream = null
               console.log("This is the remote Stream: ", remoteStream)
           }
        });

        return {
            peerConnection,
            remoteStream
        }
    }catch(err){
        console.log(err)
    }
};

export default createPeerConnection;