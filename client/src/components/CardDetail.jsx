import React from "react";
import {FaInfo} from "react-icons/fa6";
import config from "../config.js";

function CardDetail({realization, onBack}) {
    const scoreLabels = {
        dev: "Développement",
        com: "Communication",
        crea: "Création"
    };

    function renderIcons(type, value, total = 5) {
        let icons = [];
        for (let i = 1; i <= total; i++) {
            icons.push(
                <img
                    src={`/elements/others/${type}.svg`}
                    alt={type}
                    key={i}
                    className={i > value ? 'o0-5' : ''}
                    style={{ opacity: i > value ? 0.2 : 1 }}
                />
            );
        }
        return icons;
    }

    console.log(realization)
    return (
        <div className="realization-details">
            <button style={{position:"absolute", right:0}} onClick={
                onBack
            }>Retour
            </button>
            <div className={"slider"}>
                <img src={`${config.serverUrl}/${realization.firstImage}`} alt={realization.title}/>
            </div>
            <div className={"fc g0-5 w100"}>
                <h2>{realization.title}</h2>
                <div className={"fr g0-5"}>
                    {Object.entries(realization.scores)
                        .filter(([key, value]) => value > 0)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, value]) => (
                            <div key={key} className={"tag"}>
                                <span>{scoreLabels[key] || key}</span>
                            </div>
                        ))
                    }
                </div>
                <h3>Description et contexte du projet</h3>
                <p>{realization.description}</p>
                <div className={"fc g1"}>
                    <div className={"project-detail-item"}>
                        <h4>Type de projet : </h4> {realization.type}
                    </div>
                    <div className={"project-detail-item"}>
                        <h4>Difficulté du projet : </h4>
                        <div className={"fr g0-25"}>{renderIcons("difficulty",realization.difficulty)}</div>
                    </div>
                    <div className={"project-detail-item"}>
                        <h4>Durée du projet : </h4>
                        <div className={"fr g0-25"}>{renderIcons("duration",realization.duration)}</div>
                    </div>
                    <div className={"project-detail-item"}>
                        <h4>Année de réalisation : </h4> {realization.year}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardDetail;
