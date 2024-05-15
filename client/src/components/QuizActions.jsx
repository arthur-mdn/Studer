import React from 'react';
function QuizActions({ onSkip }) {
    return (
        <div className="actions">
            <button className={"nope"} onClick={() => onSkip('nope')}>
                <img src={"/elements/actions/neutre.svg"}/>
            </button>
            <button className={"dislike"} disabled>
                <img src={"/elements/actions/dislike.svg"}/>
            </button>
            <button className={"like"} disabled>
                <img src={"/elements/actions/like.svg"}/>
            </button>
            <button className={"superlike"} disabled>
                <img src={"/elements/actions/extralike.svg"}/>
            </button>
        </div>
    );
}

export default QuizActions;
