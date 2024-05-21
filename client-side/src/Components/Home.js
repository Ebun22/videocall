import { useState, useEffect } from 'react';
import prepForCall from '../webrtc Utilities/prepForCall';
import socketConnection from '../webrtc Utilities/socketConnection';
import createPeerConnection from '../webrtc Utilities/createPeerConnection';
import { useNavigate } from 'react-router-dom';
import clientSocketListeners from '../webrtc Utilities/clientSocketListeners';

const Home = ({callStatus, updateCallStatus, setOfferData, setUserName, userName, setLocalStream, peerConnection, setPeerConnection, setRemoteStream, remoteStream}) => {
    const [joined, setJoined] = useState(false);
    const [typeOfCall, setTypeOfCall] = useState()
    const [availableCall, setAvailableCall] = useState([]);

    // useEffect(() => {
    //     const test = async () => {
    //        const socket =  await socketConnection('test')
    //        console.log(socket)
    //     }

    //     test();
    // }, []);
    const navigate = useNavigate();

    const initCall = async (typeOfCall) => {
        //get localstream ready and get userMedia
        await prepForCall(callStatus, updateCallStatus, setLocalStream)
        
        setTypeOfCall(typeOfCall);
    };

    useEffect(() => {
        if(joined){
            const username = prompt("Enter your username!");
            setUserName(username)
            //function that handles what happens to data recieved from server
            const setCalls = data => {
                //set the offers to availableCalls so they can be looped through
                setAvailableCall(data);
                console.log(data)
            };
            
            const socket = socketConnection(username);
            console.log(socket)
            //recieve the call offers sent from signalling Server
            socket.on('availableOffers', setCalls);
            socket.on('newOfferWaiting', setCalls);

        }
    }, [joined]);

    const call = async () => {
        initCall('offer')
    }

    //if we have the media stream then let's create peerConnection
    useEffect(() => {
        if(callStatus.hasMedia && !peerConnection){
            const {peerConnection, remoteStream} = createPeerConnection(userName, typeOfCall);
            setPeerConnection(peerConnection);
            setRemoteStream(remoteStream)
        }

    }, [callStatus.hasMedia])

    useEffect(() => {
        if(typeOfCall && peerConnection){
            const socket = socketConnection(userName);
            clientSocketListeners(socket, callStatus, typeOfCall, updateCallStatus, peerConnection)
        }
    }, [typeOfCall, peerConnection])

    //navigate to the videocall page when peerConnection is made
    useEffect(() => {
        if(remoteStream, peerConnection){
            navigate(`/${typeOfCall}`)
        }
    }, [remoteStream, peerConnection]);

    function answer (callData) {
        initCall('answer');
        setOfferData(callData)
    };

    if(!joined){
        return (
            <div class='w-full h-screen flex justify-center items-center'>
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setJoined(true)}>
                    Join    
                </button>
            </div>
        )
    }
    return (
        <div class='flex w-screen h-screen items-center'>
            <div class='flex flex-col w-1/3 h-screen py-12 items-center'>
                <h1 class='font-bold text-xl pb-2'>{userName}</h1>
                <h3 class='font-bold text-l pb-4'>Make a Call</h3>
                <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={call}>Call</button>
            </div>
            <div class='flex flex-col w-full h-screen px-4 pt-1 bg-gray-100'>
                <h1 class='font-bold text-xl '>Available calls</h1>
                    {availableCall?.map((callData, i)=> {
                        return (
                        <div className="col mb-2" key={i}>
                          <button 
                              onClick={()=>{answer(callData)}}
                              className="bg-blue-500 text-white p-3 mt-4 rounded-sm"
                            >
                            Answer Call From {callData.offererUserName}
                          </button>
                        </div>
                    )})}
                </div>

        </div>
    )
};

export default Home;