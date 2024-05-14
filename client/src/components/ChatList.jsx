import React from 'react';

function ChatList({ isOpen, toggleChat, chatHistory, onOpenChatDetail }) {
    return (
        <div className={`chat ${isOpen ? 'open' : ''}`}>
            <div className="title">
                MMI Studer
                <div className="close display-mobile" onClick={toggleChat}>X</div>
            </div>
            <div className="chat-container">
                {Object.keys(chatHistory).map(key => (
                    <div key={key} className="chat-session" onClick={() => onOpenChatDetail(key)}>
                        <img src={chatHistory[key].realization.image} alt="Profile" style={{width: "50px"}}/>
                        <div className="chat-info">
                            <h4>{chatHistory[key].realization.title}</h4>
                            <p>{chatHistory[key].messages[chatHistory[key].messages.length - 1].text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChatList;
