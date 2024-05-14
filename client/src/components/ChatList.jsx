import React from 'react';

function ChatList({ isOpen, toggleChat, preferences }) {
    return (
        <div className={`chat ${isOpen ? 'open' : ''}`}>
            <div className={"title"}>
                MMI Studer
                <div className={"close display-mobile"} onClick={toggleChat}>X</div>
            </div>
            <ul className={"chats"}>
                {

                }
            </ul>
            <div className={"mt-a p1"}>{JSON.stringify(preferences)}</div>
        </div>
    );
}

export default ChatList;
