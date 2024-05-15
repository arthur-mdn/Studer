import React from "react";

function QuizCard({ quiz, onAnswer }) {

    const scoreLabels = {
        dev: "Développement",
        com: "Communication",
        crea: "Création"
    };

    return (


        <div className="realization-card quiz-card">
            <div className="fr g0-5 ai-c jc-c" style={{marginTop:"2rem"}}>
                <div key={quiz.parcours} className="tag">
                    <span style={{color: "black"}}>{scoreLabels[quiz.parcours]}</span>
                </div>
            </div>
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
