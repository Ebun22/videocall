const prepForCall = async (callStatus, updateCallStatus, setLocalStream) => {
    const constraints = {
        video: true,
        audio: false
    }
    try{
        const stream  = await navigator.mediaDevices.getUserMedia(constraints);
        const copyCallStatus = {...callStatus};
        copyCallStatus.hasMedia = true;
        copyCallStatus.videoEnabled = null;
        copyCallStatus.AudioEnabled = false;
        updateCallStatus(copyCallStatus);
        setLocalStream(stream);
    }catch(err){
        console.log(err)
    }

};

export default prepForCall;