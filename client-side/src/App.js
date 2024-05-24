
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Home from './Components/Home';
import CallerVideo from './Components/CallerVideo';
import AnswerVideo from './Components/AnswerVideo';


function App() {

  // useEffect(() => {
  //   //this runs on load, ie. when the client id loaded
  //   const socket = io.connect('https://localhost:8001');
  //   socket.on('connected', data => {
  //     console.log(data)
  //   })
  // }, []);

  const [ callStatus, updateCallStatus ] = useState({})
  const [ localStream, setLocalStream ] = useState(null)
  const [ remoteStream, setRemoteStream ] = useState(null)
  const [ peerConnection, setPeerConnection ] = useState(null)
  const [ userName, setUserName ] = useState('')
  const [ offerData, setOfferData ] = useState(null)
  const [typeOfCall, setTypeOfCall] = useState()
  const [hangUp, setHangUp] = useState(false)

  return (
   <BrowserRouter>
      <Routes>
        <Route exact path='/' element={
          <Home 
            callStatus={callStatus}
            updateCallStatus={updateCallStatus}
            localStream={localStream}
            setLocalStream={setLocalStream}
            remoteStream={remoteStream}
            setRemoteStream={setRemoteStream}
            peerConnection={peerConnection}
            setPeerConnection ={setPeerConnection}
            userName={userName} 
            setUserName={setUserName}
            offerData={offerData}
            setOfferData={setOfferData}
            typeOfCall={typeOfCall}
            setTypeOfCall={setTypeOfCall}
          />
        }/>
         <Route exact path='/offer' element={
          <CallerVideo
            callStatus={callStatus}
            updateCallStatus={updateCallStatus}
            localStream={localStream}
            setLocalStream={setLocalStream}
            remoteStream={remoteStream}
            setRemoteStream={setRemoteStream}
            peerConnection={peerConnection}
            setPeerConnection ={setPeerConnection}
            userName={userName} 
            setUserName={setUserName}
            offerData={offerData}
            setOfferData={setOfferData}
            typeOfCall={typeOfCall}
            setTypeOfCall={setTypeOfCall}
            hangUp={hangUp}
            setHangUp={setHangUp}
          />
        }/>
         <Route exact path='/answer' element={
          <AnswerVideo 
          hangUp={hangUp}
          setHangUp={setHangUp}
            callStatus={callStatus}
            updateCallStatus={updateCallStatus}
            localStream={localStream}
            setLocalStream={setLocalStream}
            remoteStream={remoteStream}
            setRemoteStream={setRemoteStream}
            peerConnection={peerConnection}
            setPeerConnection ={setPeerConnection}
            userName={userName} 
            setUserName={setUserName}
            offerData={offerData}
            setOfferData={setOfferData}
            typeOfCall={typeOfCall}
            setTypeOfCall={setTypeOfCall}
          />
        }/>
      </Routes>
   </BrowserRouter>
  );
}

export default App;
