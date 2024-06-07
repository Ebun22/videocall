const prepForCall = async (callStatus, updateCallStatus, setLocalStream, localStream, originalStream) => {
    const constraints = {
        video: true,
        audio: false
    }
    try{
        const stream  = await navigator.mediaDevices.getUserMedia(constraints);
        const copyCallStatus = {...callStatus};
        copyCallStatus.hasMedia = true;
        copyCallStatus.videoEnabled = null;
        copyCallStatus.audioEnabled = null;
        updateCallStatus(copyCallStatus);
        originalStream.current = stream
       
        setLocalStream(stream);
        console.log("local stream is gotten from users Camera: ", localStream)
    }catch(err){
        console.log(err)
    }

};

export default prepForCall;