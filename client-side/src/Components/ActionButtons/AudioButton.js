import { FaMicrophone } from "react-icons/fa";
import { FaMicrophoneSlash } from "react-icons/fa";
import { useState, useEffect } from 'react';

const AudioButton = ({callStatus,localStream,updateCallStatus,peerConnection}) => {
    const [micOn, setMicOn] = useState(false)
   let audioStream

    useEffect(() => {
        const getAudioTracks = async () => {
            try{
                if(localStream && (callStatus.audioEnabled==null)){
                    audioStream = await navigator.mediaDevices.getUserMedia({audio: true});
                    console.log("audio Stream created: ", audioStream)
                    const copyCallStatus = {...callStatus}
                    copyCallStatus.audioEnabled = false
                    updateCallStatus(copyCallStatus)

                    //add audio stream to localstream
                    audioStream.getAudioTracks().forEach(track => {
                        localStream.addTrack(track)
                        track.enabled = false
                    });
                    console.log("audio has been added to localStream: ", localStream)
    
                }
            }catch(err){
                console.log(err)
            }
        };

        getAudioTracks();

        return () => {
            // Cleanup: stop audio tracks if component unmounts
            if (audioStream) {
                audioStream.getTracks().forEach(track => track.stop());
                console.log("Audio comp has been unmounted: ", audioStream)
            }
        };
        
    
    },[]);

    const startStopAudio = async () => { 
        const copyCallStatus = {...callStatus}
        if(copyCallStatus.audioEnabled == false){  
            copyCallStatus.audioEnabled = true
            updateCallStatus(copyCallStatus)
            localStream.getAudioTracks().forEach(track => {
                track.enabled = true
            })
        }else if(copyCallStatus.audioEnabled == true){
            copyCallStatus.audioEnabled = false
            updateCallStatus(copyCallStatus)
            localStream.getAudioTracks().forEach(track => {
                track.enabled = false
            })
        }
    };
 
    return (
        <button onClick={startStopAudio}>
            {callStatus.audioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>
      
    )
};

export default AudioButton;