
import { useState , useEffect, useRef} from 'react';
import ActionButton from './ActionButtons/ActionButton';
import { useNavigate } from 'react-router-dom';
import socketConnection from '../webrtc Utilities/socketConnection';
import VideoMessageBox from "./VideoMessageBox";
import clientSocketListeners from '../webrtc Utilities/clientSocketListeners';

const AnswerVideo = ({callStatus, updateCallStatus,setHangUp, hangUp, localStream, offerData, userName, setOfferData, peerConnection,remoteStream}) => {
    const localFeedEl = useRef(null);
    const remoteFeedEl = useRef(null);
    const [joined, setJoined] = useState(false);
    const [ videoMessage, setVideoMessage ] = useState("Please enable video to start!")
    const [answerCreated, setAnswerCreated] = useState(false);

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
            <div class='w-full h-screen bg-black flex flex-row'>
                {/* <VideoMessageBox message={videoMessage} /> */}
                <video id="local-feed" ref={localFeedEl} autoPlay playsInline muted class='w-full  bg-black '></video>
                <video id="remote-feed" ref={remoteFeedEl} autoPlay playsInline muted class='w-full  bg-black '></video> 
             </div>
             <ActionButton
               hangUp={hangUp}
               setHangUp={setHangUp}
               localFeedEl={localFeedEl}
               remoteFeedEl={remoteFeedEl}
               userName={userName}
                callStatus={callStatus}
                localStream={localStream}
                remoteStream={remoteStream}
                offerData={offerData}
                updateCallStatus={updateCallStatus}
                peerConnection={peerConnection}
              />
        </div>
     
    )

};

export default AnswerVideo;