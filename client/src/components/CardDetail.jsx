import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import config from "../config.js";


function CardDetail({ realization, onBack }) {
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
                    style={{ opacity: i > value ? 0.5 : 1 }}
                />
            );
        }
        return icons;
    }

    // Prepare images for the slider
    const images = [realization.firstImage, ...realization.images].map((img, index) => (
        <div key={index}>
            <img src={`${config.serverUrl}/${img}`} alt={`Slide ${index}`} />
        </div>
    ));

    // Slider settings
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        cssEase: "linear"
    };

    return (
        <div className="realization-details">
            <button className="back-button" style={{ position: "absolute"}} onClick={onBack}>
                Retour
            </button>
            <div className="slider">
                <Slider {...settings}>
                    {images}
                </Slider>
            </div>
            <div className="fc g0-5 w100">
                <h2>{realization.title}</h2>
                <div className="fr g0-5">
                    {Object.entries(realization.scores)
                        .filter(([key, value]) => value > 0)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, value]) => (
                            <div key={key} className="tag">
                                <span>{scoreLabels[key] || key}</span>
                            </div>
                        ))
                    }
                </div>
                <h3>Description et contexte du projet</h3>
                <p>{realization.description}</p>
                <div className="fc g1">
                    <div className="project-detail-item">
                        <h4>Type de projet : </h4> {realization.type}
                    </div>
                    <div className="project-detail-item">
                        <h4>Difficulté du projet : </h4>
                        <div className="fr g0-25">{renderIcons("difficulty", realization.difficulty)}</div>
                    </div>
                    <div className="project-detail-item">
                        <h4>Durée du projet : </h4>
                        <div className="fr g0-25">{renderIcons("duration", realization.duration)}</div>
                    </div>
                    <div className="project-detail-item">
                        <h4>Année de réalisation : </h4> {realization.year}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardDetail;
