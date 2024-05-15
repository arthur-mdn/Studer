import React from 'react';

function CardActions({ onRate, fullyDisabled = false, swipe }) {
    const handleClick = (action, direction) => {
        swipe(direction);
        onRate(action);
    };

    return (
        <div className="actions">
            <button className={"nope"} onClick={() => handleClick('nope', 'left')} disabled={fullyDisabled}>
                <img src={"/elements/actions/neutre.svg"} alt="neutre" />
            </button>
            <button className={"dislike"} onClick={() => handleClick('dislike', 'left')} disabled={fullyDisabled}>
                <img src={"/elements/actions/dislike.svg"} alt="dislike" />
            </button>
            <button className={"like"} onClick={() => handleClick('like', 'right')} disabled={fullyDisabled}>
                <img src={"/elements/actions/like.svg"} alt="like" />
            </button>
            <button className={"superlike"} onClick={() => handleClick('superlike', 'right')} disabled={fullyDisabled}>
                <img src={"/elements/actions/extralike.svg"} alt="superlike" />
            </button>
        </div>
    );
}

export default CardActions;
