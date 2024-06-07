import { BsRecordBtn } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef} from 'react';
import socketConnection from '../../webrtc Utilities/socketConnection';

const ScreenRecordButton = ({remoteStream,callStatus,localFeedEl,remoteFeedEl,setLocalStream,localStream}) => {
    const [recording, setRecording] = useState(false)
    const mediaRecording = useRef(null);
    const blob = useRef([]);
    const superBlob = useRef(null);

    useEffect(() => {

        const startRecording = () => {
            if(!localStorage) return;
            mediaRecording.current = new MediaRecorder(localStream);
            console.log("This is mediaRecording when created: ",  mediaRecording.current)
            mediaRecording.current.ondataavailable = (event) => {
                blob.current.push(event.data);
            };
            console.log('recording has started');
            mediaRecording.current.start();
        }

        const stopRecording = () => {
            console.log("recordeing off was clicked")
            console.log("This is mediaRecording when stoped: ", mediaRecording.current)
            if(!mediaRecording.current) return;
            mediaRecording.current.stop();
            console.log('media recording has ended');

            const videoLabel = prompt('Enter name of recording');

            if(!blob.current) return;
            superBlob.current = new Blob(blob.current, {
                type: 'video/webm'
            });

            const videoUrl = window.URL.createObjectURL(superBlob.current);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = videoUrl
            a.download = `${videoLabel}.webm`
            document.body.appendChild(a);
            a.click();
            console.log(a)

            // setTimeout(() => {
            //     document.body.removeChild(a);
            //     window.URL.revokeObjectURL(superBlob.current);
            // }, 200)

            // Reset blob for future recordings
            blob.current = [];

            // Cleanup the media recorder
            mediaRecording.current = null;
        }

        if(recording === true){
            startRecording();
        }else if(recording === false){
            stopRecording();
        }
    }, [recording]);

    const startStopRecording = () => {
       setRecording(!recording)
    }
  
    return (
        <button className='h-full w-full' onClick={startStopRecording}>
            <BsRecordBtn class={`${recording ? 'text-red-600 delay-500' : 'delay-500'} 'text-2xl'`} />
        </button>
   
    )
};

export default ScreenRecordButton;