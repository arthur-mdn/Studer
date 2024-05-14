import React from "react";
import {FaInfo} from "react-icons/fa6";

function Card({realization}) {
    return (
        <div className="realization-card">
            <img src={realization.image} alt={realization.title}/>
            <div className="realization-info">
                <h2>{realization.title}</h2>
                <p>{realization.description}</p>
            </div>
            <button type={"button"} ><FaInfo/></button>
        </div>
    );
}

export default Card;
