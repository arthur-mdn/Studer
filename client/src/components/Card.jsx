import React from "react";
import {FaArrowRight, FaArrowRightLong, FaComment, FaInfo, FaMessage} from "react-icons/fa6";
import config from '../config';

function Card({realization, onView, onAddToChat}) {
    return (
        <div className="realization-card">
            <img src={`${config.serverUrl}/${realization.firstImage}`} alt={realization.title}/>
            <div className={"shadow"}></div>
            <div className="realization-info">
                <h2>{realization.title}</h2>
                <p>{realization.description}</p>
                <div className={"realization-buttons"}>
                    <button type={"button"} className={"see-more"} onClick={
                        onView
                    }>En savoir plus <FaArrowRightLong/></button>
                    <button className="add-to-chat" onClick={onAddToChat}><FaComment/></button>
                </div>
            </div>

        </div>
    );
}

export default Card;
