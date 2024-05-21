import { FaMicrophone } from "react-icons/fa";
import { FaMicrophoneSlash } from "react-icons/fa";
import { useState } from 'react';

const AudioButton = () => {
    const [micOn, setMicOn] = useState(false)
    const startStopAudio = () => {
        setMicOn(!micOn)
    };

    return (
        <button onClick={startStopAudio}>
            {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>
      
    )
};

export default AudioButton;