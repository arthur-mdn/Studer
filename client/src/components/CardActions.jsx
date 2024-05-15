import React from 'react';
function CardActions({ onRate, fullyDisabled = false}) {
    return (
        <div className="actions">
            <button className={"nope"} onClick={() => onRate('nope')} disabled={fullyDisabled}>
                <img src={"/elements/actions/neutre.svg"}/>
            </button>
            <button className={"dislike"} onClick={() => onRate('dislike')} disabled={fullyDisabled}>
                <img src={"/elements/actions/dislike.svg"}/>
            </button>
            <button className={"like"} onClick={() => onRate('like')} disabled={fullyDisabled}>
                <img src={"/elements/actions/like.svg"}/>
            </button>
            <button className={"superlike"} onClick={() => onRate('superlike')} disabled={fullyDisabled}>
                <img src={"/elements/actions/extralike.svg"}/>
            </button>
        </div>
    );
}

export default CardActions;
