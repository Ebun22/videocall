
import { useState , useEffect, useRef} from 'react';
import ActionButton from './ActionButtons/ActionButton';
import { useNavigate } from 'react-router-dom';
import socketConnection from '../webrtc Utilities/socketConnection';
import clientSocketListeners from '../webrtc Utilities/clientSocketListeners';
import ChatButton from './ChatBoxComponents/ChatButton';
import ChatBox from './ChatBoxComponents/ChatBox';

const AnswerVideo = ({callStatus, updateCallStatus, setHangUp, hangUp, userName, localStream, setLocalStream, offerData, peerConnection,remoteStream, originalStream}) => {
    const localFeedEl = useRef(null);
    const remoteFeedEl = useRef(null);
    const [joined, setJoined] = useState(false);
    const [videoMessage,setVideoMessage] = useState("Please enable video to start!")
    const [answerCreated, setAnswerCreated] = useState(false);
    const [openChat, setOpenChat] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        if(!localStream){
            navigate('/')
        }
        console.log("This is the callStatus on the answerer side: ", callStatus)

        if(!callStatus.current){
            //set video tags
            remoteFeedEl.current.srcObject = remoteStream
        }
    }, []);

    useEffect(()=>{
        if(callStatus.videoEnabled == true && !callStatus.current){
            localFeedEl.current.srcObject = localStream            
        }
      
    },[callStatus])

    useEffect(()=>{
        if(!callStatus.current){
            //set video tags
            console.log('new remote stream was set')
            remoteFeedEl.current.srcObject = remoteStream
        }
    },[remoteStream])


    //User has enabled video, but not made answer
    useEffect(()=>{
        const addOfferAndCreateAnswerAsync = async()=>{
            //add the offer
            await peerConnection.setRemoteDescription(offerData.offer)
            console.log(peerConnection.signalingState) //have remote-offer
            //now that we have the offer set, make our answer
            console.log("Creating answer...")
            
            const answer = await peerConnection.createAnswer()
            peerConnection.setLocalDescription(answer)
            const copyOfferData = {...offerData}
            copyOfferData.answer = answer
            copyOfferData.answerUserName = userName
            const socket = socketConnection(userName)
            const offerIceCandidates = await socket.emitWithAck(
                'newAnswer',copyOfferData)
            offerIceCandidates.forEach(c=>{
                peerConnection.addIceCandidate(c)
                console.log("==Added ice candidate from offerer==")
            })
            setAnswerCreated(true)
        }

        if(!answerCreated && callStatus.videoEnabled && !callStatus.current ){
            addOfferAndCreateAnswerAsync()
        }
    },[callStatus.videoEnabled,answerCreated])

    return(
        <div class='flex w-screen h-screen flex-col'>
            <div class='top flex w-screen h-screen flex-row'>
                <div class='left-half '>
                    <div class='w-full h-screen bg-black flex flex-row'>
                        <video id="local-feed" ref={localFeedEl} autoPlay playsInline class='w-1/2'></video>
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

export default AnswerVideo;