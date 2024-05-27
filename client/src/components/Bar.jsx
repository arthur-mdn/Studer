import {FaMessage} from "react-icons/fa6";
import {FaCog} from "react-icons/fa";
import React from "react";
import {useModal} from "./Modale/ModaleContext.jsx";

function Bar({userConfig, toggleChat}) {
    console.log(userConfig)
    const { newModal } = useModal();
    return <div className={"mobile-menu fr jc-sb"}>
        <button onClick={toggleChat} className={"display-mobile"}>
            <FaMessage/>
        </button>
        <img src={"/elements/logo.svg"} className={"logo"} alt={"logo"} style={{width: "2rem"}}/>
        <button onClick={() => {
            const formattedPreferences = Object.entries(userConfig?.preferences || {}).map(([key, value]) => {
                const labels = {
                    crea: "Création Numérique",
                    com: "Communication",
                    dev: "Développement"
                };
                return `<div>${labels[key]}: ${value.toFixed(2)}</div>`;
            }).join('');
            newModal(
                {
                    boutonClose: false,
                    titre: "Préférences",
                    htmlContent: `
                                                <div class="fc jc-c g1">
                                                    <div class="fc">
                                                    ${formattedPreferences}
                                                    </div>
                                                    <button id={"reset"} onclick="localStorage.clear();window.location.reload()">
                                                        Réinitialiser
                                                    </button>
                                                </div>
                                                `,
                    texteBoutonAction: "Fermer",
                    onValidate: () => {
                    }
                }
            )
        }} style={{marginLeft: "auto"}}>
            <FaCog/>
        </button>
    </div>
}

export default Bar;