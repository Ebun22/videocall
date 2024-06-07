import { MdOutlinePresentToAll } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import socketConnection from '../../webrtc Utilities/socketConnection';

const ScreenShareButton = ({peerConnection,callStatus,localFeedEl,setLocalStream,updateCallStatus,localStream,originalStream}) => {
    const [startScreenShare, setStartScreenShare] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        // if(localStream){
        //     localStream.getTracks().forEach( track => {
        //         track.onended = () => {
        //             setStartScreenShare(false)
        //             console.log('+++++++++screenShare was stopped=++++++: ', startScreenShare)
        //             //stopScreenShare()
        //         }
        //     })
        // }

        
    },[localStream])

    const replaceTrack = async (newStream) => {

        const senders = peerConnection.getSenders();
        const videoSender = senders.find(sender => sender.track.kind === 'video');

        if (videoSender) {
            const newVideoTrack = newStream.getVideoTracks()[0];
            if (newVideoTrack) {
                await videoSender.replaceTrack(newVideoTrack);
            }
        }

    }

    const startScreenShareAsync = async () => {
        //specify options
        const options = {
            audio: false,
            video: true,
            surfaceSwitching: 'include'
        }
    
        try{
            //get user display media and pass to var
            const stream = await navigator.mediaDevices.getDisplayMedia(options);
             //set that var to localstream state
             setLocalStream(stream);
             //replace video tracks being sent to remote clients
             await replaceTrack(stream)

             const copyCallStatus = {...callStatus};
             copyCallStatus.screenShare = 'done';
             updateCallStatus(copyCallStatus);
        }catch(err){
            console.log('There was an err while getting display media: ', err)
        }
    };

    const stopScreenShare = async () => {
        // //if localStream is true
        if(localStream){
            
            setLocalStream(originalStream.current);
            await replaceTrack(originalStream.current)
            const copyCallStatus = {...callStatus};
            copyCallStatus.screenShare = 'done';
            updateCallStatus(copyCallStatus);
        }   
    }
    useEffect(() => {
        const startStopScreenShareAsync = async () => {     
            if(startScreenShare){
                //call the function that starts screenshare
                await startScreenShareAsync()
                console.log("This is the originsl stream from camera: ", originalStream)
            }else if(!startScreenShare && callStatus.screenShare == "done"){
               await stopScreenShare()
            }
        }
        startStopScreenShareAsync()
    }, [startScreenShare])

    const startStopScreenShare = () => {
        setStartScreenShare(!startScreenShare);
        console.log("screenshare is initiated: ", startScreenShare);
    }
  
    return (
        <button className='h-full w-full' onClick={startStopScreenShare}>
            <MdOutlinePresentToAll class={`${startScreenShare ? 'delay-500 text-red-600' : 'delay-500 '} text-2xl`} />
        </button>
   
    )
};

export default ScreenShareButton;