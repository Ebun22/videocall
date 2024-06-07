
import AudioButton from './AudioButton';
import VideoButton  from './VideoButton';
import HangupButton from './HangupButton';
import ScreenShareButton from './ScreenShareButton';
import ScreenRecordButton from './ScreenRecordButton';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import socketConnection from '../../webrtc Utilities/socketConnection';

const ActionButton = ({callStatus,setLocalStream, localFeedEl,remoteStream,originalStream,remoteFeedEl,hangUp,setHangUp,updateCallStatus,localStream,peerConnection}) => {
  

    return (
        <div class='flex flex-row justify-center bg-white py-2 ' >
            <div className="left text-xl pr-4 pt-2">
                <AudioButton 
                localFeedEl={localFeedEl}
                callStatus={callStatus}
                localStream={localStream}
                updateCallStatus={updateCallStatus}
                peerConnection={peerConnection}
                />
            </div>
            <div className="left text-2xl pr-4 pt-2">
                <ScreenRecordButton
                localFeedEl={localFeedEl}
                callStatus={callStatus}
                localStream={localStream}
                updateCallStatus={updateCallStatus}
                peerConnection={peerConnection}
                />
            </div>
            <div className='center justify-center text-end  hangup-wrapper rounded-full border border-gray-600'>
                <HangupButton 
                 hangUp={hangUp}
                 setHangUp={setHangUp}
                 callStatus={callStatus}
                 localFeedEl={localFeedEl}
                 remoteFeedEl={remoteFeedEl}
                 localStream={localStream}
                 remoteStream={remoteStream}
                 updateCallStatus={updateCallStatus}
                 peerConnection={peerConnection}
                />
            </div>
            <div className="left pl-4 w-full h-full pt-2">
                <ScreenShareButton
                localFeedEl={localFeedEl}
                callStatus={callStatus}
                localStream={localStream}
                setLocalStream={setLocalStream}
                originalStream={originalStream}
                updateCallStatus={updateCallStatus}
                peerConnection={peerConnection}
                />
            </div>  
            <div className="left text-xl pl-4 pt-2">
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