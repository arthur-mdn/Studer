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
                {Object.keys(chatHistory).length === 0 && (
                    <div className="chat-session">
                        <div className="chat-info fr g1 ai-c">
                            <div className={"fc ai-c jc-c"} style={{backgroundColor:"#C83E4D",padding:"0.5rem", borderRadius:"6rem"}}>
                                <img src={"/elements/others/chat-empty.svg"} style={{width:"2rem",height:"2rem",borderRadius:0,objectFit:"contain"}}/>
                            </div>
                            <h4>Vous n'avez pas encore ouvert de conversation.</h4>
                        </div>
                    </div>
                )}
                <div className={"fc ai-c"} style={{marginTop:"auto",marginBottom:"1rem"}}>
                    <img src={"/elements/logo.svg"} alt="Logo" style={{width: "6rem"}}/>
                </div>
            </div>
        </div>
    );
}

export default ChatList;
