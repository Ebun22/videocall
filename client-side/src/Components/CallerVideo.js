import { useState , useRef, useEffect} from 'react';
import ActionButton from './ActionButtons/ActionButton';
import VideoMessageBox from "./VideoMessageBox"
import { useNavigate } from 'react-router-dom';
import socketConnection from '../webrtc Utilities/socketConnection';

const CallerVideo = ({callStatus, updateCallStatus, setHangUp, hangUp, userName, localStream, setOfferData, peerConnection,remoteStream}) => {
    const localFeedEl = useRef(null);
    const remoteFeedEl = useRef(null);
    const [videoMessage, setVideoMessage] = useState('Please Enable Video')
    const [offerCreated, setOfferCreated] = useState(false)

    const navigate = useNavigate()

    //send back to home if no localStream
    useEffect(()=>{
        if(!localStream){
            navigate(`/`)
        }
        if(!callStatus.current && callStatus.current !== 'complete'){
            remoteFeedEl.current.srcObject = remoteStream           
        }else{
            remoteFeedEl.current.srcObject = null
        }
        console.log('This is the remoteFeed after close in callerVideo: ', remoteFeedEl.current, "this is remtestream: " , remoteStream)
    },[]);

    useEffect(()=>{
        if(callStatus.videoEnabled == true){
            localFeedEl.current.srcObject = localStream    
         
        }
    },[callStatus])

    if(callStatus.current == "complete"){
        remoteFeedEl.current.srcObject = null
        console.log("Remote vide is set, ", remoteFeedEl.current)
    }

     //once the user has shared video, start WebRTC'ing :)
     useEffect(()=>{
        const shareVideoAsync = async()=>{
            const offer = await peerConnection.createOffer()
            peerConnection.setLocalDescription(offer)
            //we can now start collecing ice candidates!
            // we need to emit the offer to the server
            const socket = socketConnection(userName)
            socket.emit('newOffer',offer)
            setOfferCreated(true) //so that our useEffect doesn't make an offer again
            setVideoMessage("Awaiting answer...") //update our videoMessage box
            console.log("created offer, setLocalDesc, emitted offer, updated videoMessage")
        }
        if(!offerCreated && callStatus.videoEnabled){
            //CREATE AN OFFER!!
            console.log("We have video and no offer... making offer")
            shareVideoAsync()
        }
    },[callStatus.videoEnabled,offerCreated])

    //answer had been created at this point so we can set client1 remote description to be answer
    useEffect(() => {
        const addAnswerAsync = async () => {
            try {
                // Check if the peer connection is in the correct state
                if (peerConnection.signalingState === 'stable') {
                    console.log("Peer connection is already in stable state, skipping setRemoteDescription.");
                    return;
                }
                await peerConnection.setRemoteDescription(callStatus.answer);
            } catch (error) {
                console.error("Failed to set remote description: ", error);
            }
        };

        if (callStatus.answer && !callStatus.current) {
            addAnswerAsync();
        }
    }, [callStatus, peerConnection])
    
    //Would only print when CLient2 disconnects from call
    useEffect(() =>{
        console.log("this in callerVideo comp got calledddddd")
        if(!remoteStream){
            console.log("remoteStream callerVideo comp g is null")
            remoteFeedEl.current.srcObject = null;
        }
    }, [remoteStream])
   

    //now we should have
    //---MONE FUNCTION THAT STARTS AND STOPS VIDEO ON CLICK TO ACTION BUTTON COMPONENT
    return(
        <div class='flex w-screen h-screen flex-col'>
            <div class='w-full h-screen bg-black flex flex-row'>
                {/* <VideoMessageBox message={videoMessage} /> */}
                <video id="local-feed" ref={localFeedEl} autoPlay playsInline class='w-full  bg-black '></video>
                <video id="remote-feed" ref={remoteFeedEl} autoPlay playsInline class='w-full  bg-black '></video> 
             </div>
             <ActionButton
              hangUp={hangUp}
              setHangUp={setHangUp}
              userName={userName}
              localFeedEl={localFeedEl}
              remoteFeedEl={remoteFeedEl}
              callStatus={callStatus}
              updateCallStatus={updateCallStatus}
              peerConnection={peerConnection}
              localStream={localStream}
              remoteStream={remoteStream}
              />
        </div>
     
    )
};

export default CallerVideo;