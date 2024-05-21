import socketConnection from "./socketConnection";
import iceConfiguration from "./stunServers";

const createPeerConnection = (userName, typeOfCall) => {
    const socket = socketConnection(userName);
    try{
        const peerConnection = new RTCPeerConnection(iceConfiguration);
        const remoteStream = new MediaStream();

        peerConnection.addEventListener('signalingstatechange', (event) => {
            console.log(event)
            console.log(peerConnection.signalingState)
        });

        peerConnection.addEventListener('icecandidate', (event) => {
            console.log("This is the iceCandidate event ", event.candidate)
            if(event.candidate){
                socket.emit('sendIceCandidateToSignalingServer', {
                    iceCandidate: event.candidate,
                    iceUserName: userName,
                    didIOffer: typeOfCall === "offer"
                })
            }
         
        })

        peerConnection.addEventListener('track', (event) => {
            console.log("This is the event created when track is added to peerConnection: ", event);
            event.streams[0].getTracks().forEach(track => {
                remoteStream.addTrack(track, remoteStream)
                console.log("this is teh remote stream: ", remoteStream.getTracks())
            })
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