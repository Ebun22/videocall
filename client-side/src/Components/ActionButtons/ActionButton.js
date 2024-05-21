import { useState, useRef}  from 'react';
import AudioButton from './AudioButton';
import VideoButton  from './VideoButton';
import HangupButton from './HangupButton';

const ActionButton = ({callStatus,localFeedEl, remoteFeedEl,updateCallStatus,localStream,peerConnection}) => {

    //FUNCTION THAT STRARTS AND STOPS VIDEO, BASED ON copyCallStatus.videoEnabled VALUE
    //copyCallStatus.videoEnabled IS INITIALLU NULL SO THAT ELSE...IF BLOCK RUNS FIRST
    // const startStopVideo = () => {
    //     const copyCallStatus = {...callStatus};
    //     if(copyCallStatus.videoEnabled){
    //         //turn off camera
    //         copyCallStatus.videoEnabled = false;
    //         updateCallStatus(copyCallStatus);
    //         localStream.getTracks().forEach(track => {
    //             track.enabled = false
    //         })
    //     }else if(copyCallStatus.videoEnabled == false){
    //         //turn on camera
    //         copyCallStatus.videoEnabled =  true;
    //         updateCallStatus(copyCallStatus);
    //         localStream.getTracks().forEach(track => {
    //         })
    //     }else if(copyCallStatus.videoEnabled == null){
    //         //initialize camera
    //         //null is initial value from when stream was created
    //         copyCallStatus.videoEnabled = true;
    //         console.log("callSattus init part, callStatus.videoEnabled: ", callStatus.videoEnabled)
    //         updateCallStatus(copyCallStatus);
    //         //add your localstream client1 tracks to peerConnection
    //         localStream.getTracks().forEach(track => {
    //             peerConnection.addTrack(track, localStream)
    //             console.log("track has been addede to peerConnection: ", peerConnection)
    //         })            
    //     }
    // };

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
            <div className="center justify-center text-end col-2 hangup-wrapper rounded-full border border-gray-600 p-2">
                <HangupButton />
            </div>  
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