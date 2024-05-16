import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

function Step2({ userPreferences, onFinal }) {
    const [sequence, setSequence] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const videoRef = useRef(null);

    const max = Math.max(...Object.values(userPreferences));
    const parcours = Object.keys(userPreferences).find(key => userPreferences[key] === max).toUpperCase();

    const handleChoice = (choice) => {
        setDisabled(true);
        const newSequence = sequence + choice;
        setSequence(newSequence);

        const id = setTimeout(() => {
            setSequence(newSequence + "-");
            setDisabled(false);
        }, 5000);

        setTimeoutId(id);
    };

    useEffect(() => {
        if (sequence.replace(/\D/g, "").length === 4 && sequence.replace(/[^-]/g, "").length === 4) {
            onFinal();
        }
    }, [sequence]);

    const handleBack = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
        if (sequence.endsWith("-")) {
            setSequence(sequence.slice(0, -2));
        } else if (/\d$/.test(sequence)) {
            setSequence(sequence.slice(0, -1));
        }

        setDisabled(false);
    };

    const getCurrentVideo = () => {
        return `${parcours}${sequence}.mp4`;
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [sequence]);

    return (
        <div className="h100 w100 fc g1 ai-c jc-c step2">
            <h2>Étape 2</h2>
            <p>Il est temps de séduire le parcours qui t'intéresse !</p>
            <div className="video-container w100 fc g1 ai-c jc-c">
                <h5>{getCurrentVideo()}</h5>
                <video ref={videoRef} controls autoPlay loop>
                    <source src={`/elements/step2/${getCurrentVideo()}`} type="video/mp4"  />
                    Votre navigateur ne supporte pas la balise vidéo.
                </video>
            </div>
            <div className="fr g0-5">
                <button onClick={() => handleChoice("0")} disabled={disabled}><FaArrowLeftLong /></button>
                <button onClick={() => handleChoice("1")} disabled={disabled}><FaArrowRightLong /></button>
            </div>
            <button onClick={handleBack}>Retour</button>
        </div>
    );
}

export default Step2;
