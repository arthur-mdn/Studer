import React from "react";

function Results({ userPreferences }) {
    const scoreLabels = {
        dev: "Développement",
        com: "Communication",
        crea: "Création Numérique"
    };

    const totalScore = Object.keys(userPreferences).reduce(
        (total, key) => total + Math.abs(userPreferences[key]),
        0
    );

    const calculatePercentage = (score) => {
        return ((Math.abs(score) / totalScore) * 100).toFixed(2);
    };

    const scores = Object.keys(userPreferences).map(key => ({
        key,
        label: scoreLabels[key],
        score: userPreferences[key],
        percentage: calculatePercentage(userPreferences[key])
    }));

    scores.sort((a, b) => b.percentage - a.percentage);

    return (
        <div className="results fc ai-c jc-c g1">
            <img src="/elements/logo.svg" alt="logo" style={{ width: "8rem" }} />
            <h2>Voici tes résultats:</h2>
            <div className="preferences fr g3 w100 ai-c fw-w jc-c">
                {scores.map((score, index) => (
                    <div key={index} className="preference fc ai-c g1">
                        <h1 style={{color:"#C83E4D"}}>{score.percentage}%</h1>
                        <div className={"fc ai-c"}>
                            <p>Avec le parcours</p> <strong>{score.label}</strong>

                        </div>
                        <div className="progress-bar-container w100">
                        <div
                                className="progress-bar"
                                style={{
                                    width: `${score.percentage}%`,
                                    backgroundColor: "#C83E4D",
                                    height: '20px',
                                    borderRadius: '5rem',
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Results;
