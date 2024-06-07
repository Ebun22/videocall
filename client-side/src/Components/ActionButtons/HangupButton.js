import { IoIosCall } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import socketConnection from '../../webrtc Utilities/socketConnection';

const HangupButton = ({remoteStream,callStatus,localFeedEl,userName,remoteFeedEl,hangUp,setHangUp,updateCallStatus,localStream,peerConnection}) => {

    const navigate = useNavigate()

    const endCall = () => {
        const copyCallStatus = { ...callStatus };
        copyCallStatus.current = 'complete';
        copyCallStatus.videoEnabled = false;
        updateCallStatus(copyCallStatus)

        // Check if the peer connection is still in a connected state
        if (peerConnection && (peerConnection.iceConnectionState === 'connected' || peerConnection.iceConnectionState === 'completed')) {
            // // Stop all tracks in the local stream
            localStream.getTracks().forEach(track => {
                console.log(`Stopping track: ${track.kind}`);
                track.stop();
            });

            // Clean up media elements
            localFeedEl.current.srcObject = null;
            localStream = null
            remoteFeedEl.current.srcObject = null;
            remoteStream = null 

            // Clean up event listeners
            peerConnection.onicecandidate = null;
            peerConnection.ontrack = null;
            peerConnection.oniceconnectionstatechange = null;

            // Close the connection
            peerConnection.close();
            console.log("Peerconnncetion closed")
            // Set peerConnection to null
            peerConnection = null;  
        }
    }

    useEffect(() => {
        if(callStatus.current === "complete"){
            console.log("This is peerConnectionn after close: ", peerConnection)
            navigate('/')
            localFeedEl.current.srcObject = null;
            localStream = null
        }        
    }, [callStatus])
  
    return (
        <button class='w-full h-full p-3' onClick={endCall}>
            <IoIosCall class='text-red-500 ' />
        </button>
   
    )
};

export default HangupButton;