import React from 'react';

function Chat({ isOpen, toggleChat, preferences }) {
    return (
        <div className={`chat ${isOpen ? 'open' : ''}`}>
            <div className={"title"}>
                MMI Studer
                <div className={"close display-mobile"} onClick={toggleChat}>X</div>
            </div>
            <ul className={"chats"}>
                <li>
                    <img src={"/elements/others/profile.jpeg"} alt="Profile"/>
                    <div>
                        <h4 className={"name"}>John Doe</h4>
                        <div className={"message"}>Hey, tu as des questions ?</div>
                    </div>
                </li>
            </ul>
            <div className={"mt-a p1"}>{JSON.stringify(preferences)}</div>
        </div>
    );
}

export default Chat;
