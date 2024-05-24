
const clientSocketListeners = (socket,typeOfCall,callStatus,
    updateCallStatus,peerConnection)=>{
    socket.on('answerResponse',entireOfferObj=>{
        console.log("======From inside clientSocketListeners======", entireOfferObj);
        const copyCallStatus = {...callStatus}
        copyCallStatus.answer = entireOfferObj.answer
        copyCallStatus.answerUserName = entireOfferObj.answererUserName 
        copyCallStatus.myRole = typeOfCall
        updateCallStatus(copyCallStatus)
        // setOfferData(entireOfferObj)
    })

    socket.on('receivedIceCandidateFromServer',iceC=>{
        console.log("Ice candidate recied: ", iceC)
        if(iceC){
            peerConnection.addIceCandidate(iceC).catch(err=>{
                console.log("Chrome thinks there is an error. There isn't...")
            })
            console.log(iceC)
            console.log("Added an iceCandidate to existing page presence")
            // setShowCallInfo(false);
        }
    })
}

export default clientSocketListeners