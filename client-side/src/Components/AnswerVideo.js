
import { useState , useEffect, useRef} from 'react';
import ActionButton from './ActionButtons/ActionButton';
import { useNavigate } from 'react-router-dom';
import socketConnection from '../webrtc Utilities/socketConnection';
import VideoMessageBox from "./VideoMessageBox";
import clientSocketListeners from '../webrtc Utilities/clientSocketListeners';

const AnswerVideo = ({callStatus, updateCallStatus, typeOfCall, setTypeOfCall, localStream, offerData, userName, setOfferData, peerConnection,remoteStream}) => {
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
        // if(callStatus.videoEnabled){
            localFeedEl.current.srcObject = localStream;
        // }
        // remoteStream.getTracks().forEach(track => {
        //     track.enabled = true;
        //     remoteStream.addTrack(track, remoteStream)
        // })
        // if( remoteStream) 
        remoteFeedEl.current.srcObject = remoteStream;
        console.log("This is the remote stream: ", remoteStream)
        console.log("This is the local stream: ", localStream)
    }, []);

    useEffect(() => {
        if(answerCreated && peerConnection){
            const socket = socketConnection(userName);
            console.log("client socketListeners ran")
            clientSocketListeners(socket, callStatus, typeOfCall, updateCallStatus, peerConnection)
        }
    }, [answerCreated, peerConnection])

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
        }

        if(!answerCreated && callStatus.videoEnabled){
            addOfferAndCreateAnswerAsync()
        }
    },[callStatus.videoEnabled,answerCreated])
    

    //if we have tracks, disable the video message
    useEffect(()=>{
        if(peerConnection){
            peerConnection.ontrack = e=>{
                if(e?.streams?.length){
                    setVideoMessage("")
                }else{
                    setVideoMessage("Disconnected...")
                }
            }
        }
    },[peerConnection])


    return(
        <div class='flex w-screen h-screen flex-col'>
            <div class='w-full h-screen bg-black flex flex-row'>
                {/* <VideoMessageBox message={videoMessage} /> */}
                <video id="local-feed" ref={localFeedEl} autoPlay playsInline muted class='w-full  bg-black '></video>
                <video id="remote-feed" ref={remoteFeedEl} autoPlay playsInline muted class='w-full  bg-black '></video> 
             </div>
             <ActionButton
                localFeedEl={localFeedEl}
                remoteFeedEl={remoteFeedEl}
                callStatus={callStatus}
                localStream={localStream}
                updateCallStatus={updateCallStatus}
                peerConnection={peerConnection}
              />
        </div>
     
    )

};

export default AnswerVideo;