import React from 'react';
// import fontawesome from react-icons
import { FaRegHeart, FaHeart, FaRegStar, FaRegThumbsDown } from 'react-icons/fa';
import {FaCreativeCommonsNd, FaHeartCrack, FaNeuter} from "react-icons/fa6";

function CardActions({ onRate }) {
    return (
        <div className="actions">
            <button className={"nope"} onClick={() => onRate('nope')}>
                <img src={"/elements/actions/neutre.svg"}/>
            </button>
            <button className={"dislike"} onClick={() => onRate('dislike')}>
                <img src={"/elements/actions/dislike.svg"}/>
            </button>
            <button className={"like"} onClick={() => onRate('like')}>
                <img src={"/elements/actions/like.svg"}/>
            </button>
            <button className={"superlike"} onClick={() => onRate('superlike')}>
                <img src={"/elements/actions/extralike.svg"}/>
            </button>
        </div>
    );
}

export default CardActions;
