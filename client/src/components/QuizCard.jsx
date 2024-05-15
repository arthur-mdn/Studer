import React from "react";

function QuizCard({ quiz, onAnswer }) {
    return (




    <div className="realization-card quiz-card">
        <div className="realization-info quiz-answers">
            <h2>{quiz.question}</h2>
            <div className="answers fc g0-5">
                {quiz.answers.map((answer, index) => (
                    <button key={index} className="quiz-answer answer" onClick={() => onAnswer(answer.response)}>
                        {answer.response}
                    </button>
                ))}
            </div>
        </div>
    </div>
)
    ;
}

export default QuizCard;
