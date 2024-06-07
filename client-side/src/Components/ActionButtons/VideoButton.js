import { IoMdVideocam } from "react-icons/io";
import { IoVideocamOff } from "react-icons/io5";
import { useState } from 'react';

const VideoButton = ({localFeedEl,callStatus,localStream,updateCallStatus,peerConnection}) => {

//handle user clicking on video button
const startStopVideo = ()=>{
    const copyCallStatus = {...callStatus}
    // useCases:
    if(copyCallStatus.videoEnabled){
        // 1. Video is enabled, so we need to disable
        //disable
        copyCallStatus.videoEnabled = false
        console.log("This si the VideoCall status: ", copyCallStatus.videoEnabled )
        updateCallStatus(copyCallStatus)
        const tracks = localStream.getVideoTracks()
        tracks.forEach(track=>track.enabled = false)
    }else if(copyCallStatus.videoEnabled === false){
        // 2. Video is disabled, so we need to enable
        copyCallStatus.videoEnabled = true
        console.log("This si the VideoCall status: ", copyCallStatus.videoEnabled )
        updateCallStatus(copyCallStatus)
        const tracks = localStream.getVideoTracks()
        tracks.forEach(track=>track.enabled = true)
    }else if(copyCallStatus.videoEnabled === null){
        // 3. Video is null, so we need to init
        console.log("Init video!")
        copyCallStatus.videoEnabled = true
        console.log("This is the VideoCall status: ", copyCallStatus.videoEnabled )
        updateCallStatus(copyCallStatus)
        // we are not adding tracks so they are visible 
        // in the video tag. We are addign them
        // to the PC, so they can be sent
        localStream.getTracks().forEach(track=>{
            peerConnection.addTrack(track,localStream)
        })
    }
}


    return (
        <button className='h-full w-full' onClick={startStopVideo}>
            {callStatus.videoEnabled ? <IoMdVideocam /> : <IoVideocamOff />}
        </button>
    )
};

export default VideoButton;