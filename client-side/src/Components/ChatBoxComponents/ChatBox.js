import { useState , useRef, useEffect} from 'react';
import { IoSend } from "react-icons/io5";
import { IoMdArrowBack } from "react-icons/io";
import socketConnection from '../../webrtc Utilities/socketConnection';
import Message from './Message';

const ChatBox = ({openChat, setOpenChat, callStatus, userName}) => {
    const [chat, setChat] = useState('');
    const [messages, setMessages] = useState();
    const messagesCont = useRef(null)
    const inputBox = useRef(null)
    let socket;

    // useEffect(() => {
    //     socket = socketConnection(userName);
    // }, [socket])

    const closeChat = () => {
        setOpenChat(false)
    }

    const sendChat = () => {
        let msg = inputBox.current.value
        //console.log("This si teh chatBox value: ", inputBox.current.value)
        socket = socketConnection(userName);
        //emit the message over our socket connection
        console.log("this si socket: ", socket)
        console.log("this is the callStatus in the useEffect: ", callStatus.answerUserName)
        if(!socket) return;
        socket.emit('sendChat', {
            msg,
            to: callStatus.answerUserName,
            from: userName
        })

        //get the current time
        const currentTime = new Date().toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          });

         if(messages){
            const copyMessages = [...messages];
            copyMessages.push({
                self: true,
                msg,
                from: userName,
                currentTime
            });
            setMessages(copyMessages)
         }else{
            setMessages([{
                self: true,
                msg,
                from: userName,
                currentTime
            }])
         }
         console.log(messages)
         //clear the message box
        inputBox.current.value = ''
    }

    useEffect(() => {
        if(socket){
            console.log("this is the callStatus in the useEffect: ", callStatus)
            console.log("this is the userName on the answerer's pov in the useEffect: ", userName)
            socket.on('recieveMessage', data => {
                console.log("This is teh recieved message: ", data)
                const currentTime = new Date().toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                });

                if(messages){
                    const copyMessages = [...messages];
                    copyMessages.push({
                        self: false,
                        msg: data.chat,
                        from: data.from,
                        currentTime
                    });
                    setMessages(copyMessages)
                 }else{
                    setMessages([{
                        self: true,
                        msg: data.chat,
                        from: data.from,
                        currentTime
                    }])
                }
                console.log(messages)
            })
        }
        //cleanup function
        return () => {
            if(!socket) return;
            socket.off('receiveChat');
          };
    }, [socket])

    return (
        <div className={`ChatBox flex flex-col absolute h-full rounded-l-lg  bg-white right-0 z-40 ${openChat ? 'open-chat' : ' '}`}>
            <div class='header border-b'>
                <div class='p-2 flex flex-row w-full'>
                    <button onClick={closeChat}>
                        <IoMdArrowBack />
                    </button>
                     <p className='text-center w-full'> Chatbox</p>
                </div>
            </div>  
            <div ref={messagesCont} class='overflow-y-auto p-6 grow bg-slate-50 relative'>
               {messages?.map((msg, index) => {
                  return(
                    <Message
                    key={index}
                    self={msg.self}
                    userName={msg.from}
                    text={msg.msg}
                    time={msg.currentTime}
                     />
                  )  
               })}       
            </div>

            <div class='flex flex-row justify-content m-4 w-3/5 relative bottom-0'>
                <div class='chat-input box'>
                    <input type='text' ref={inputBox} class='text-box placeholder:italic placeholder:text-slate-400 p-2 rounded-lg bg-slate-100' placeholder='Type a message...' onChange={(e) => setChat(e.target.value)} />
                </div>
                <div class='send pl-3 pt-3'>
                    <button onClick={sendChat}>
                        <IoSend />
                    </button>
                </div>
            </div>
        </div>
    )
};

export default ChatBox;