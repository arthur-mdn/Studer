import React from 'react';

function CardActions({ onRate, fullyDisabled = false, swipe }) {
    return (
        <div className="actions">
            <button className={"nope"} onClick={() => swipe('left')} disabled={fullyDisabled}>
                <img src={"/elements/actions/neutre.svg"} alt="neutre" />
            </button>
            <button className={"dislike"} onClick={() => swipe('left')} disabled={fullyDisabled}>
                <img src={"/elements/actions/dislike.svg"} alt="dislike" />
            </button>
            <button className={"like"} onClick={() => swipe('right')} disabled={fullyDisabled}>
                <img src={"/elements/actions/like.svg"} alt="like" />
            </button>
            <button className={"superlike"} onClick={() => swipe('right')} disabled={fullyDisabled}>
                <img src={"/elements/actions/extralike.svg"} alt="superlike" />
            </button>
        </div>
    );
}

export default CardActions;
