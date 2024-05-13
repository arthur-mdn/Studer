import React from 'react';
// import fontawesome from react-icons
import { FaRegHeart, FaHeart, FaRegStar, FaRegThumbsDown } from 'react-icons/fa';
import {FaCreativeCommonsNd, FaHeartCrack, FaNeuter} from "react-icons/fa6";

function CardActions({ onRate }) {
    return (
        <div className="actions">
            <button className={"nope"} onClick={() => onRate('nope')}><FaCreativeCommonsNd/></button>
            <button className={"dislike"} onClick={() => onRate('dislike')}><FaHeartCrack/></button>
            <button className={"like"} onClick={() => onRate('like')}><FaHeart/></button>
            <button className={"superlike"} onClick={() => onRate('superlike')}><FaRegStar/></button>
        </div>
    );
}

export default CardActions;
