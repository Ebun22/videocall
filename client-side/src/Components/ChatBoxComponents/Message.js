const Message = ({userName, text, time, self}) => {

    return (
        <div className={`flex justify-${self ? 'start' : 'end'} mb-2`}> 
            <div className={`relative max-w-fit p-2 rounded-b-lg ${self ? ' rounded-r-lg ' : ' rounded-l-lg'} shadow ${self ? ' bg-blue-500 text-white' : 'bg-gray-200 text-black'}  `}>
                <div className='font-bold mb-0'>{userName}</div>
                <div className='mt-0'>{text}</div>
                <div className='text-xs text-gray-600 mt-1 text-right'>{time}</div> 
            </div>
         </div> 
    )
};

export default Message;