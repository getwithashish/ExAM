    import React, { useState } from 'react';

    const AssetSense: React.FC = () => {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [inputMessage, setInputMessage] = useState('');

    const handleSendMessage = () => {
    };

    return (
        <div className="flex h-screen bg-white">
        <div className="flex flex-col flex-grow overflow-hidden p-5">
            <div className="text-left text-2xl font-semibold tracking-tight md:text-2xl lg:text-3xl">
            Chat with AssetSense AI
            </div>
            <div className="chat-messages flex-grow">
            {messages.map((message, index) => (
                <div key={index} className={`message ${message.role}`}>
                {message.content}
                </div>
            ))}
            </div>
            <div className="absolute bottom-20 left-10 px-4 right-0 flex justify-center">
            <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="border-2 bg-transparent text-black rounded-md py-2 px-6 focus:outline-none text-sm w-full max-w-2xl md:w-lg lg:w-xl sm:w-md" // Constrained width with max-w-md
            />
            <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none hover:bg-blue-600 ml-4"
            >
                Send
            </button>
            </div>
        </div>
        </div>
    );
    };

    export default AssetSense;
