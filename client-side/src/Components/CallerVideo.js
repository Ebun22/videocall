import { useState , useRef, useEffect} from 'react';
import ActionButton from './ActionButtons/ActionButton';
import VideoMessageBox from "./VideoMessageBox"
import { useNavigate } from 'react-router-dom';
import socketConnection from '../webrtc Utilities/socketConnection';

const CallerVideo = ({callStatus, updateCallStatus, offerData, userName, localStream, setOfferData, peerConnection,remoteStream}) => {
    const localFeedEl = useRef(null);
    const remoteFeedEl = useRef(null);
    const [videoMessage, setVideoMessage] = useState('Please Enable Video')
    const [offerCreated, setOfferCreated] = useState(false)

    const navigate = useNavigate()

    //send back to home if no localStream
    useEffect(()=>{
        if(!localStream){
            navigate(`/`)
        }else{
            //set video tags
            remoteFeedEl.current.srcObject = remoteStream
            localFeedEl.current.srcObject = localStream            
        }
    },[])
    
    //set video tags
    // useEffect(()=>{
    //     remoteFeedEl.current.srcObject = remoteStream
    //     localFeedEl.current.srcObject = localStream
    // },[])

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
            await peerConnection.setRemoteDescription(callStatus.answer)
            console.log("Answer added!!")
        };

        if(callStatus.answer){
            addAnswerAsync()
        }
    }, [callStatus])

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
              localFeedEl={localFeedEl}
              remoteFeedEl={remoteFeedEl}
             callStatus={callStatus}
             updateCallStatus={updateCallStatus}
             localStream={localStream}
             peerConnection={peerConnection}
              />
        </div>
     
    )
};

export default CallerVideo;