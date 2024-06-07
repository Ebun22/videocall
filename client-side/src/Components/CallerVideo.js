import { useState , useRef, useEffect} from 'react';
import ActionButton from './ActionButtons/ActionButton';
import { useNavigate } from 'react-router-dom';
import socketConnection from '../webrtc Utilities/socketConnection';
import ChatButton from './ChatBoxComponents/ChatButton';
import ChatBox from './ChatBoxComponents/ChatBox';

const CallerVideo = ({callStatus, updateCallStatus, setHangUp, hangUp, userName, localStream, setLocalStream, peerConnection,remoteStream, originalStream}) => {
    const localFeedEl = useRef(null);
    const remoteFeedEl = useRef(null);
    const [videoMessage, setVideoMessage] = useState('Please Enable Video')
    const [offerCreated, setOfferCreated] = useState(false)
    const [openChat, setOpenChat] = useState(false);

    const navigate = useNavigate()

    //send back to home if no localStream
    useEffect(()=>{
        if(!localStream){
            navigate(`/`)
        }
        remoteFeedEl.current.srcObject = remoteStream           
    },[])

    useEffect(()=>{
        if(callStatus.videoEnabled == true || callStatus.screenShare == 'done'){
            console.log("localStream is set")
            localFeedEl.current.srcObject = localStream    
         
        }
    },[callStatus])

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
                    console.log(peerConnection)
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
        if(!remoteStream){
            remoteFeedEl.current.srcObject = null;
        }
    }, [remoteStream])
   

    //now we should have
    //---MONE FUNCTION THAT STARTS AND STOPS VIDEO ON CLICK TO ACTION BUTTON COMPONENT
    return(
        <div class='flex w-screen h-screen flex-col'>
            <div class='top flex w-screen h-screen flex-row'>
                <div class='left-half '>
                    <div class='w-full h-screen bg-black flex flex-row'>
                        {/* <VideoMessageBox message={videoMessage} /> */}
                        <video id="local-feed" ref={localFeedEl} autoPlay playsInline class='w-1/2 '></video>
                        <video id="remote-feed" ref={remoteFeedEl} autoPlay playsInline class='w-1/2'></video> 
                    </div>
                </div>
                <div class='right-side absolute right-0'>
                    <ChatButton 
                    openChat={openChat}
                    setOpenChat={setOpenChat}
                    />
                </div>
                <div className={`chat-container ${openChat ? 'open-chat' : ''}`}>
                    <ChatBox 
                    callStatus={callStatus}
                    openChat={openChat}
                    setOpenChat={setOpenChat}
                    userName={userName}
                    />
                </div>
            </div>
            <div class='bottom justify-center  flex w-screen h-screen '>
                <ActionButton
                    hangUp={hangUp}
                    setHangUp={setHangUp}
                    userName={userName}
                    localFeedEl={localFeedEl}
                    remoteFeedEl={remoteFeedEl}
                    callStatus={callStatus}
                    originalStream={originalStream}
                    updateCallStatus={updateCallStatus}
                    peerConnection={peerConnection}
                    localStream={localStream}
                    setLocalStream={setLocalStream}
                    remoteStream={remoteStream}
                />
            </div>
        </div> 
    )
};

export default CallerVideo;