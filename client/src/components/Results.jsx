import React from "react";
import {useModal} from "./Modale/ModaleContext";
import {FaEnvelope} from "react-icons/fa6";

function Results({ userPreferences }) {
    const {newModal} = useModal();

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

    const openModal = () => {

        newModal({
            boutonClose: true,
            titre: "Contactez les étudiants",
            htmlContent: `
                <div class="fc g1">
                    <p>Tu as envie d’en savoir plus sur MMI et les trois parcours proposés ? Alors contacte les étudiant(e)s, ils seront là pour te conseiller.</p>
                    <div class="fc g1 contact-students">
                        <div>
                            <h3>COMMUNICATION</h3>
                            <div class="fr fw-w jc-sb g1">
                                <div class="fr g0-5 ai-c">
                                    <img src="/elements/students/julie.png" style="width: 4rem;flex-shrink: 0; ">
                                    <div class="fc ">
                                        <h3 style="color: #C83E4D">Julie</h3>
                                        <a href="mailto:julie-rigal2@etud.univ-tln.fr" style="margin: 0; color: black">julie-rigal2@etud.univ-tln.fr</a>
                                    </div>
                                </div>
                                <div class="fr g0-5 ai-c">
                                    <img src="/elements/students/penelope.png" style="width: 4rem;flex-shrink: 0; ">
                                    <div class="fc ">
                                        <h3 style="color: #C83E4D">Pénélope</h3>
                                        <a href="mailto:penelope-pierron@etud.univ-tln.fr" style="margin: 0; color: black">penelope-pierron@etud.univ-tln.fr</a>
                                    </div>
                                </div>
                            </div>            
                        </div>
                        <div>
                            <h3>CRÉATION NUMÉRIQUE</h3>
                            <div class="fr fw-w jc-sb g1">
                                <div class="fr g0-5 ai-c">
                                    <img src="/elements/students/theodore.png" style="width: 4rem;flex-shrink: 0; ">
                                    <div class="fc ">
                                        <h3 style="color: #C83E4D">Théodore</h3>
                                        <a href="mailto:theodore-allard@etud.univ-tln.fr" style="margin: 0; color: black">theodore-allard@etud.univ-tln.fr</a>
                                    </div>
                                </div>
                                <div class="fr g0-5 ai-c">
                                    <img src="/elements/students/hugo.png" style="width: 4rem;flex-shrink: 0; ">
                                    <div class="fc ">
                                        <h3 style="color: #C83E4D">Hugo</h3>
                                        <a href="mailto:hugo-bransard@etud.univ-tln.fr" style="margin: 0; color: black">hugo-bransard@etud.univ-tln.fr</a>
                                    </div>
                                </div>
                                <div class="fr g0-5 ai-c">
                                    <img src="/elements/students/mauryne.png" style="width: 4rem;flex-shrink: 0; ">
                                    <div class="fc ">
                                        <h3 style="color: #C83E4D">Mauryne</h3>
                                        <a href="mailto:mauryne-marty@etud.univ-tln.fr" style="margin: 0; color: black">mauryne-marty@etud.univ-tln.fr</a>
                                    </div>
                                </div>
                                <div class="fr g0-5 ai-c">
                                    <img src="/elements/students/dorian.png" style="width: 4rem;flex-shrink: 0; ">
                                    <div class="fc ">
                                        <h3 style="color: #C83E4D">Dorian</h3>
                                        <a href="mailto:dorian-rastello@etud.univ-tln.fr" style="margin: 0; color: black">dorian-rastello@etud.univ-tln.fr</a>
                                    </div>
                                </div>
                            </div>            
                        </div>
                        <div>
                            <h3>DÉVELOPPEMENT</h3>
                            <div class="fr fw-w jc-sb">
                                <div class="fr g0-5 ai-c">
                                    <img src="/elements/students/arthur.png" style="width: 4rem;flex-shrink: 0; ">
                                    <div class="fc ">
                                        <h3 style="color: #C83E4D">Arthur</h3>
                                        <a href="mailto:arthur-mondon@etud.univ-tln.fr" style="margin: 0; color: black">arthur-mondon@etud.univ-tln.fr</a>
                                    </div>
                                </div>
                            </div>            
                        </div>
                    </div>
                </div>
            `
        });
    }
    return (
        <div className="results fc ai-c jc-c g1">
            <img src="/elements/logo.svg" alt="logo" style={{ width: "8rem" }} />
            <h2>Tu es compatible à :</h2>
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
            <button className="button fr g0-5 ai-c" onClick={openModal} style={{backgroundColor:"#C83E4D"}}>
                <FaEnvelope/>
                Contacter les étudiants
            </button>
        </div>
    );
}

export default Results;
