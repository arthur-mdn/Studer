import React from "react";
import {FaArrowRightLong, FaComment, FaInfo} from "react-icons/fa6";
import config from '../config';

function Card({ realization, onView, onAddToChat }) {
    const handleCardClick = () => {
        onView();
    };

    const handleChatClick = (e) => {
        e.stopPropagation(); // Prevent the card's click event from firing
        onAddToChat();
    };

    return (
        <div className="realization-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
            <img src={`${config.serverUrl}/${realization.firstImage}`} alt={realization.title} />
            <div className={"fc ai-c jc-c o0-5"} style={{position:"absolute", right:"1rem", top:"1rem", border:'1px solid white',zIndex:'4', borderRadius:'5rem',width:"1.6rem", height:"1.6rem", boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px"}}>
                <FaInfo style={{marginBottom:"0.2rem", color:"white"}}/>
            </div>
            <div className={"shadow"}></div>
            <div className="realization-info">
                <h2>{realization.title}</h2>
                <p>{realization.description}</p>
                <div className={"realization-buttons"}>
                    <button type="button" className="see-more" onClick={handleChatClick}>
                        J'ai une question <FaArrowRightLong />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Card;
