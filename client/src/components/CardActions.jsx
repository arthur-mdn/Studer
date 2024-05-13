import React from 'react';
// import fontawesome from react-icons
import { FaRegHeart, FaHeart, FaRegStar, FaRegThumbsDown } from 'react-icons/fa';
import {FaCreativeCommonsNd, FaHeartCrack, FaNeuter} from "react-icons/fa6";

function CardActions({ onRate }) {
    return (
        <div className="actions">
            <button onClick={() => onRate('nope')}><FaCreativeCommonsNd/></button>
            <button onClick={() => onRate('like')}><FaHeart/></button>
            <button onClick={() => onRate('dislike')}><FaHeartCrack/></button>
            <button onClick={() => onRate('superlike')}><FaRegStar/></button>
        </div>
    );
}

export default CardActions;
