import React from "react";
import {FaInfo} from "react-icons/fa6";

function CardDetail({realization, onBack}) {
    return (
        <div className="realization-details">
            <button onClick={
                onBack
            }>Retour
            </button>
            <img src={realization.image} alt={realization.title}/>
            <h2>{realization.title}</h2>
            <p>{realization.description}</p>

        </div>
    );
}

export default CardDetail;
