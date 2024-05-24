
import AudioButton from './AudioButton';
import VideoButton  from './VideoButton';
import HangupButton from './HangupButton';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import socketConnection from '../../webrtc Utilities/socketConnection';

const ActionButton = ({callStatus,localFeedEl, remoteStream, userName, remoteFeedEl,hangUp,setHangUp,updateCallStatus,localStream,peerConnection}) => {
    const navigate = useNavigate()
        const endCall = () => {

            const copyCallStatus = { ...callStatus };
            copyCallStatus.current = 'complete';
            copyCallStatus.videoEnabled = false;
            updateCallStatus(copyCallStatus)
            // Check if the peer connection is still in a connected state
            if (peerConnection && (peerConnection.iceConnectionState === 'connected' || peerConnection.iceConnectionState === 'completed')) {
                // Close the connection
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
            console.log("This is peerConnectionn after close: ", peerConnection)
            if(callStatus.current === "complete"){
                navigate('/')
                localFeedEl.current.srcObject = null;
                localStream = null
            }        
        }, [callStatus])
      

    return (
        <div class='flex flex-row justify-center bg-white py-2' >
            <div className="left col-6 text-xl pr-4 pt-2">
                <AudioButton 
                        localFeedEl={localFeedEl}
                        callStatus={callStatus}
                        localStream={localStream}
                        updateCallStatus={updateCallStatus}
                        peerConnection={peerConnection}
                />
            </div>
            <button className=' center justify-center text-end col-2 hangup-wrapper rounded-full border border-gray-600 p-2' onClick={() => endCall()}>
                <HangupButton 
                 hangUp={hangUp}
                 setHangUp={setHangUp}
                 callStatus={callStatus}
                />
            </button>
            <div className="left col-6 text-xl pl-4 pt-2">
                <VideoButton
                        localFeedEl={localFeedEl}
                        callStatus={callStatus}
                        localStream={localStream}
                        updateCallStatus={updateCallStatus}
                        peerConnection={peerConnection}
                />
            </div>   
        </div>
    )
};

export default ActionButton;