import React, { useState, useRef, useEffect } from "react";
import {FaArrowLeftLong, FaArrowRightLong, FaBusinessTime, FaStopwatch} from "react-icons/fa6";

function Step2({ userPreferences, onFinal, onBack }) {
    const [sequence, setSequence] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const [countdownId, setCountdownId] = useState(null);
    const videoRef = useRef(null);
    const [counter, setCounter] = useState(15);

    const max = Math.max(...Object.values(userPreferences));
    const parcours = Object.keys(userPreferences).find(key => userPreferences[key] === max).toUpperCase();

    const handleChoice = (choice) => {
        setDisabled(true);
        const newSequence = sequence + choice;
        setSequence(newSequence);

        if (countdownId) {
            clearInterval(countdownId);
        }

        const id = setTimeout(() => {
            setSequence(newSequence + "-");
            setDisabled(false);
            setCounter(15);

            const newCountdownId = setInterval(() => {
                setCounter((prevCounter) => {
                    if (prevCounter > 0) {
                        return prevCounter - 1;
                    } else {
                        clearInterval(newCountdownId);
                        return 0;
                    }
                });
            }, 1000);
            setCountdownId(newCountdownId);
        }, 5000);

        setTimeoutId(id);
    };

    useEffect(() => {
        if (sequence.replace(/\D/g, "").length === 4 && sequence.replace(/[^-]/g, "").length === 4) {
            onFinal();
        }
    }, [sequence, onFinal]);

    const handleBack = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
        if (countdownId) {
            clearInterval(countdownId);
            setCountdownId(null);
        }
        if (sequence.endsWith("-")) {
            setSequence(sequence.slice(0, -2));
        } else if (/\d$/.test(sequence)) {
            setSequence(sequence.slice(0, -1));
        }
        if (sequence === "") {
            onBack();
        }

        setDisabled(false);
        setCounter(15);
    };

    const getCurrentVideo = () => {
        return `${parcours}${sequence}.mp4`;
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [sequence]);

    useEffect(() => {
        const newCountdownId = setInterval(() => {
            setCounter((prevCounter) => {
                if (prevCounter > 0) {
                    return prevCounter - 1;
                } else {
                    clearInterval(newCountdownId);
                    return 0;
                }
            });
        }, 1000);
        setCountdownId(newCountdownId);

        return () => clearInterval(newCountdownId);
    }, []);

    return (
        <div className="h100 w100 fc g1 ai-c jc-c step2">
            <h2>Étape 2</h2>
            <h2>{!disabled && <div className={"ennemi fc ai-c"}> <FaStopwatch/> <h5>Ennemi juré</h5><h2>{counter}</h2></div>}</h2>
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
