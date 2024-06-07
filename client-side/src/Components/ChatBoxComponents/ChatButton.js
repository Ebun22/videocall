import { IoMdChatboxes } from "react-icons/io";

const ChatButton = ({openChat, setOpenChat}) => {

    const showChat = () => {
        setOpenChat(true)
        console.log("Open Chat is: ", openChat)
    };

    return (
        <button className='w-full h-full' onClick={showChat}>
            <div class="z-20 bg-white p-2 rounded-b-lg rounded-l-lg">
            <div class="flex flex-row h-1/5"><p>Chat</p><IoMdChatboxes class='text-2xl pt-2'/></div>
            </div>
        </button>
    )
};

export default ChatButton;