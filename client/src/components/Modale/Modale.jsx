import "./Modale.css";
import { useModal } from './ModaleContext.jsx';
import { AnimatePresence, motion } from "framer-motion";
import { FaXmark } from "react-icons/fa6";

const Modale = () => {
    const { modalProps, closeModal } = useModal();

    const handleConfirm = () => {
        if (modalProps.onValidate) {
            modalProps.onValidate();
        }
        closeModal();
    };

    const modalVariants = {
        hidden: {
            scale: 0, opacity: 0,
        },
        visible: {
            scale: 1, opacity: 1, transition: { duration: 0.3 }
        },
        exit: {
            scale: 0.5, opacity: 0, transition: { duration: 0.2 }
        }
    };

    const handleContainerClick = (e) => {
        e.stopPropagation();
    };

    return (
        <AnimatePresence>
            {modalProps.isOpen && (
                <motion.div
                    className="modale-background"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={closeModal}
                >
                    <motion.div
                        className="modale-container"
                        variants={modalVariants}
                        onClick={handleContainerClick}
                    >
                        {modalProps.boutonClose && (
                            <button onClick={closeModal} className="modale-close-button">
                                <FaXmark />
                            </button>
                        )}
                        <div className={"mouse-indicator"}>
                            <img src={"/elements/others/mouse.svg"} alt={"mouse"}/>
                        </div>
                        <div className="modale-header">
                            <h3 style={{color:"#C83E4D"}}>{modalProps.titre}</h3>
                        </div>
                        <div className="modale-body">
                            {modalProps.htmlContent ? (
                                <div dangerouslySetInnerHTML={{ __html: modalProps.htmlContent }} />
                            ) : (
                                <p>{modalProps.texte}</p>
                            )}
                        </div>
                        <div className="modale-footer">
                            {modalProps.cancelButton && (
                                <button onClick={closeModal} className="modale-action-button">
                                    Annuler
                                </button>
                            )}
                            {modalProps.onValidate && (
                                <button onClick={handleConfirm} className="modale-action-button">
                                    {modalProps.texteBoutonAction}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modale;
