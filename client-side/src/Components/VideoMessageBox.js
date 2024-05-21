
import { useState , useRef} from 'react';
import ActionButton from './ActionButtons/ActionButton';

const VideoMessageBox = (message) => {

    return(
        <div class='flex w-screen h-screen flex-col'>{message} </div>
     
    )
};

export default VideoMessageBox;