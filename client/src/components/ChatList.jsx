import React from 'react';
import config from "../config.js";
import {useModal} from "./Modale/ModaleContext.jsx";
import {FaX} from "react-icons/fa6";

function ChatList({ isOpen, toggleChat, chatHistory, onOpenChatDetail }) {
    const {newModal} = useModal();
    return (
        <div className={`chat ${isOpen ? 'open' : ''}`}>
            <div className="title">
                MMI Studer
                <button className="close display-mobile" onClick={toggleChat}><FaX/></button>
            </div>
            <div className="chat-container">
                {Object.keys(chatHistory).map(key => (
                    <div key={key} className="chat-session" onClick={() => onOpenChatDetail(key)}>
                        <img src={`${config.serverUrl}/${chatHistory[key].realization.firstImage}`} alt="Profile" style={{width: "50px"}}/>
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
                    <img src={"/elements/logo.svg"} alt="Logo" style={{width: "6rem"}} onClick={() => newModal({
                        boutonClose: true,
                        titre: "Bienvenue sur Studer.",
                        htmlContent:
                            `<div class="fr g0-25 ai-c">Le site pour <strong style="margin:0;color: #C83E4D">matcher avec ton avenir !</strong> </div>
                <br>
                À travers de merveilleuses réalisations, trois parcours MMI vont chercher à te séduire..
                <br>
                Lorsque tu croises une carte projet, plusieurs choix s'offrent à toi
                <br>
                <div class="actions fc ai-fs">
                <div class="fr g1 ai-c jc-s">
                    <button class="nope">
                        <img src="/elements/actions/neutre.svg"/>
                    </button>
                    Tu es mitigé, reste neutre.
                </div>
                <div class="fr g1 ai-c jc-s">
                    <button class="dislike">
                        <img src="/elements/actions/dislike.svg"/>
                    </button>
                    Tu n'aimes pas du tout.
                </div>
                <div class="fr g1 ai-c jc-s">
                    <button class="like">
                        <img src="/elements/actions/like.svg"/>
                    </button>
                    Tu aimes bien le projet.
                </div>
                <div class="fr g1 ai-c jc-s">
                    <button class="superlike">
                        <img src="/elements/actions/extralike.svg"/>
                    </button>
                    Tu adores le projet !
                </div>
            </div>            `,
                        texteBoutonAction: "Trouver mon match parfait",
                        onValidate: () => {
                            console.log("Utilisateur a accepté");
                            localStorage.setItem('welcomeModalShown', 'true');
                        },
                    })}/>
                </div>
            </div>
        </div>
    );
}

export default ChatList;
