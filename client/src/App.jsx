import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import config from './config';
import './App.css';
import CardActions from './components/CardActions.jsx';
import Card from "./components/Card.jsx";
import CardDetail from "./components/CardDetail.jsx";
import ChatList from "./components/ChatList.jsx";
import ChatDetail from "./components/ChatDetail.jsx";
import {FaArrowLeftLong, FaArrowRightLong, FaMessage, FaPlay} from "react-icons/fa6";
import { useModal } from "./components/Modale/ModaleContext";
import QuizCard from "./components/QuizCard.jsx";
import QuizActions from "./components/QuizActions.jsx";
import Results from "./components/Results.jsx";
import Step2 from "./components/Step2.jsx";
import {FaCog} from "react-icons/fa";

function App() {
    const [socket, setSocket] = useState(null);
    const { newModal } = useModal();
    const [status, setStatus] = useState('connecting');
    const [error, setError] = useState(null);
    const [userConfig, setUserConfig] = useState(null);
    const [realizations, setRealizations] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [view, setView] = useState('list'); // 'list', 'detail', 'chatDetail', 'quiz', 'results'
    const [selectedRealization, setSelectedRealization] = useState(null);
    const [chatHistory, setChatHistory] = useState(() => {
        const localData = localStorage.getItem('chatHistory');
        if (localData) {
            const parsedHistory = JSON.parse(localData);
            // Convert askedQuestions back to a Set for each chat session
            Object.keys(parsedHistory).forEach(key => {
                if (Array.isArray(parsedHistory[key].askedQuestions)) {
                    parsedHistory[key].askedQuestions = new Set(parsedHistory[key].askedQuestions);
                } else {
                    parsedHistory[key].askedQuestions = new Set();  // Initialize a new Set if not present or invalid
                }
            });
            return parsedHistory;
        }
        return {};
    });

    const [chatDetailId, setChatDetailId] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [realizationCount, setRealizationCount] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [swiping, setSwiping] = useState(false);

    // Array of references for TinderCards
    const cardRefs = useRef([]);

    useEffect(() => {
        setTimeout(() => {
            const startingScreen = document.querySelector(".startingScreen");
            startingScreen.style.transition = 'opacity 0.5s ease-out';
            startingScreen.style.opacity = '0';

            setTimeout(() => {
                startingScreen.style.display = "none";
            }, 1000);
        }, 2000);
    }, []);


    useEffect(() => {
        const newSocket = io(config.serverUrl, {
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            const token = localStorage.getItem('userToken');
            if (token) {
                setStatus('updating_config');
                newSocket.emit('update_config', { userId: token });
                newSocket.emit('request_realizations', { userId: token });
                newSocket.emit('request_quizzes', { userId: token });
            } else {
                setStatus('requesting_code');
                newSocket.emit('request_code');
            }
        });

        newSocket.on('receive_code', (config) => {
            localStorage.setItem('userToken', config.token);
            setUserConfig(config);
            setStatus('ready');
            newSocket.emit('request_realizations', { userId: config.token });
            newSocket.emit('request_quizzes', { userId: config.token });
        });

        newSocket.on('config_updated', (config) => {
            setUserConfig(config);
            setStatus('ready');
            newSocket.emit('request_quizzes', { userId: config.token });
            if(config.finished){
                setShowResults(true);
            }else{
                setShowResults(false);
            }
        });

        newSocket.on('results', (status) => {
            setShowResults(status.status)
        });

        newSocket.on('realizations', (newRealizations) => {
            setRealizations(prev => [...prev, ...newRealizations.filter(newRealization => !prev.some(realization => realization._id === newRealization._id))]);
        });

        newSocket.on('quizzes', (newQuizzes) => {
            setQuizzes(prev => [...prev, ...newQuizzes.filter(newQuiz => !prev.some(quiz => quiz._id === newQuiz._id))]);
        });

        newSocket.on('preferences_updated', ({ preferences }) => {
            setUserConfig(config => ({ ...config, preferences }));
        });

        newSocket.on('updated_finishAtActionsCount', ({ finishAtActionsCount }) => {
            setShowResults(false);
        })
        newSocket.on('disconnect', () => setStatus('disconnected'));

        newSocket.on('connect_error', (err) => {
            setStatus('connection_failed');
            setError(err.message);
        });

        newSocket.on('error', (err) => {
            setStatus('error');
            setError(err);
        });

        return () => newSocket.disconnect();
    }, []);

    // Effect to store chatHistory in localStorage
    useEffect(() => {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }, [chatHistory]);

    useEffect(() => {
        const scoreLabels = {
            dev: "Développement",
            com: "Communication",
            crea: "Création Numérique"
        };
        if (showResults && view !== "final" && view !== "step2") {
            let max = Math.max(...Object.values(userConfig?.preferences));
            let parcours = scoreLabels[Object.keys(userConfig?.preferences).find(key => userConfig?.preferences[key] === max)];

            newModal({
                boutonClose: false,
                titre: "Félicitations !",
                htmlContent: `
                <div>Selon moi, le parcours <span style="color: #C83E4D;font-weight: bold">${parcours}</span> a l'air de t'intéresser !</div>
                <br> 
                <div class="fc jc-c">
                    <p style="margin:0">C’est à ton tour de tenter de le séduire avec l’épreuve de séduction. Pour trouver ton match parfait, tu vas te retrouver face à des choix. Il n’y a pas de bonnes ou mauvaises réponses.</p>
                    <p style="margin:0">Mais fais attention à ton ennemi juré : le temps.</p>
                </div>`,
                texteBoutonAction: "Séduire ce parcours",
                onValidate: () => {
                    setView('step2');
                },
                onCancel: () => {
                    setShowResults(false);
                    socket.emit('continue_swipe', { userId: localStorage.getItem('userToken') });
                }
            });
        }
    }, [showResults]);


    useEffect(() => {
        // Show the welcome modal only if it hasn't been dismissed by the user
        if (!localStorage.getItem('welcomeModalShown')) {
            newModal({
                boutonClose: true,
                titre: "Bienvenue sur Studer.",
                htmlContent:
                    `<div>
                              Le site <span style="color: #C83E4D;font-weight: bold">pour matcher avec ton avenir !</span>
                            </div>
                <br>
                À travers de merveilleuses réalisations, trois parcours MMI vont chercher à te séduire..
                <br>
                Lorsque tu croises une carte projet, plusieurs choix s'offrent à toi
                <br>
                <div class="actions fc ai-fs">
                <div class="fr g1 ai-c jc-s">
                    <button class="nope">
                        <img src="/elements/actions/neutre.svg"/>
                    </button>
                    Tu es mitigé, reste neutre.
                </div>
                <div class="fr g1 ai-c jc-s">
                    <button class="dislike">
                        <img src="/elements/actions/dislike.svg"/>
                    </button>
                    Tu n'aimes pas du tout.
                </div>
                <div class="fr g1 ai-c jc-s">
                    <button class="like">
                        <img src="/elements/actions/like.svg"/>
                    </button>
                    Tu aimes bien le projet.
                </div>
                <div class="fr g1 ai-c jc-s">
                    <button class="superlike">
                        <img src="/elements/actions/extralike.svg"/>
                    </button>
                    Tu adores le projet !
                </div>
            </div>            `,
                texteBoutonAction: "Trouver mon match parfait",
                onValidate: () => {
                    console.log("Utilisateur a accepté");
                    localStorage.setItem('welcomeModalShown', 'true');
                },
            });
        }
    }, []);


    const handleRate = (action) => {
        if (realizations.length > 0 && socket) {
            const currentRealization = realizations[realizations.length - 1]._id;
            setSwiping(true);

            setTimeout(() => {
                socket.emit('rate_realization', {
                    userId: localStorage.getItem('userToken'),
                    realizationId: currentRealization,
                    action
                });

                setRealizations(prev => prev.filter(r => r._id !== currentRealization));
                setRealizationCount(prev => prev + 1);
                setSwiping(false);

                if ((realizationCount + 1) % 3 === 0 && quizzes.length > 0) {
                    setSelectedQuiz(quizzes.shift());
                    setView('quiz');
                } else {
                    setView('list');
                }
            }, 300);
        }
    };

    const toggleChat = () => setIsChatOpen(!isChatOpen);

    const handleViewDetails = (realization) => {
        setSelectedRealization(realization);
        setView('detail');
    };

    const handleBackToList = () => {
        setSelectedRealization(null);
        setView('list');
    };

    const handleAddToChat = (realization) => {
        const newChatHistory = { ...chatHistory };
        if (!newChatHistory[realization._id]) {
            newChatHistory[realization._id] = {
                realization,
                messages: [{ text: "Hey, tu as des questions ?", from: 'bot' }],
                askedQuestions: new Set()
            };
        }
        setChatHistory(newChatHistory);
        setIsChatOpen(false);
        setChatDetailId(realization._id);
        setSelectedRealization(realization);
        setView('chatDetail');
    };


    const handleOpenChatDetail = (realizationId) => {
        setChatDetailId(realizationId);
        setSelectedRealization(chatHistory[realizationId].realization);
        setView('chatDetail');
    };

    const handleSendQuestion = (realizationId, questionText) => {
        const newChatHistory = { ...chatHistory };
        const chatSession = newChatHistory[realizationId];

        if (chatSession && chatSession.realization) {
            const { realization } = chatSession;
            let { askedQuestions } = chatSession;

            if (!askedQuestions) {
                askedQuestions = new Set();  // Ensure askedQuestions is always a Set
                chatSession.askedQuestions = askedQuestions;
            }

            if (!askedQuestions.has(questionText)) {
                const question = realization.questions.find(q => q.question === questionText);
                if (question) {
                    chatSession.messages.push({ text: questionText, from: 'user' });
                    chatSession.messages.push({ text: question.answer, from: 'bot' });
                    askedQuestions.add(questionText);

                    setChatHistory(newChatHistory);

                    // Update localStorage
                    localStorage.setItem('chatHistory', JSON.stringify(newChatHistory));

                    // Notify server about the question
                    socket.emit('ask_question', {
                        userId: localStorage.getItem('userToken'),
                        realizationId,
                        question: questionText,
                        answer: question.answer
                    });
                }
            }
        }
    };

    const handleQuizAnswer = (answer) => {
        if (selectedQuiz && socket) {
            const { _id, parcours, answers } = selectedQuiz;
            const answerObj = answers.find(ans => ans.response === answer);

            if (answerObj) {
                socket.emit('answer_quiz', {
                    userId: localStorage.getItem('userToken'),
                    quizId: _id,
                    parcours: parcours,
                    influence: answerObj.influence
                });
                socket.emit('request_quizzes', { userId: localStorage.getItem('userToken') });

            }
            setSelectedQuiz(null);
            setView('list');
        }
    };

    const handleQuizSkip = () => {
        if (selectedQuiz && socket) {
            socket.emit('skip_quiz', {
                userId: localStorage.getItem('userToken'),
                quizId: selectedQuiz._id,
                parcours: selectedQuiz.parcours
            });
            socket.emit('request_quizzes', { userId: localStorage.getItem('userToken') });
            setSelectedQuiz(null);
            setView('list');
        }
    }

    const swipe = (direction) => {
        const cards = cardRefs.current;
        if (cards.length > 0) {
            const card = cards[realizations.length - 1];
            if (card) {
                card.swipe(direction);
            }
        }
    };

    const renderRealizations = () => {
        switch (view) {
            case 'list':
                if (realizations.length > 0) {
                    // Only keep references for the last two cards
                    cardRefs.current = cardRefs.current.slice(-2);

                    // Determine the start index to show the last two cards
                    const startIndex = Math.max(realizations.length - 2, 0);
                    const cardsToShow = realizations.slice(startIndex);

                    return (
                        <>
                            <div className={"mobile-menu fr jc-sb"}>
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
                                                    <button id={"reset"} onclick={
                                                        localStorage.clear();
                                                        window.location.reload();
                                                    }>
                                                        Réinitialiser
                                                    </button>
                                                </div>
                                                `,
                                            texteBoutonAction: "Fermer",
                                            onValidate: () => {
                                            }
                                        }
                                    )
                                }} style={{marginLeft:"auto"}}>
                                    <FaCog/>
                                </button>
                            </div>
                            <div className="cardContainer">
                                {cardsToShow.map((realization, index) => (
                                    <Card
                                        key={realization._id}
                                        realization={realization}
                                        onView={() => handleViewDetails(realization)}
                                        onAddToChat={() => handleAddToChat(realization)}
                                        onRate={handleRate}
                                        swiping={swiping}
                                        ref={el => cardRefs.current[startIndex + index] = el}
                                        index={startIndex + index}
                                    />
                                ))}
                            </div>
                            <CardActions onRate={handleRate} fullyDisabled={swiping} swipe={swipe}/>
                        </>
                    );
                } else {
                    return <div className="status">No more realizations to rate.</div>;
                }
            case 'detail':
                if (selectedRealization) {
                    return <CardDetail swipe={swipe} realization={selectedRealization} onBack={handleBackToList}
                                       onOpenChat={() => handleAddToChat(selectedRealization)} onRate={handleRate}/>;
                }
                break;
            case 'chatDetail':
                if (chatDetailId && chatHistory[chatDetailId]) {
                    return (
                        <ChatDetail
                            chat={chatHistory[chatDetailId]}
                            onSendQuestion={(questionText) => handleSendQuestion(chatDetailId, questionText)}
                            onBackToList={handleBackToList}
                        />
                    );
                }
                break;
            case 'quiz':
                if (selectedQuiz) {
                    return (
                        <>
                            <QuizCard quiz={selectedQuiz} onAnswer={handleQuizAnswer} />
                            <QuizActions onAnswer={handleQuizAnswer} onSkip={handleQuizSkip} />
                        </>
                    );
                }
                break;
            case 'step2':
                return <>
                    <Step2 userPreferences={userConfig?.preferences} onFinal={() => {setView('final')}} onBack={() => {setView('list')}}/>
                </>;
                break;
            case 'final':
                return <>
                    <Results userPreferences={userConfig?.preferences}/>
                </>;
                break;
            default:
                return <>
                    <div className="status">Aucune réalisation restante</div>
                </>;

        }
    };

    const renderContent = () => {
        switch (status) {
            case 'connecting':
                return <div className="status">Connecting to server...</div>;
            case 'requesting_code':
                return <div className="status">Requesting a unique code...</div>;
            case 'ready':
                return (
                    <>
                        {(view !== "final" && view !== "step2") ? (
                            <>
                                <ChatList isOpen={isChatOpen} toggleChat={toggleChat} chatHistory={chatHistory}
                                          onOpenChatDetail={handleOpenChatDetail}/>
                                <div className={"fc g0 ai-c jc-c w100"}>

                                    <div className="status realizations">
                                        {renderRealizations()}
                                    </div>
                                </div>

                            </>
                        ) : <div className="status results-container w100 h100 fc ai-c jc-c">
                            {renderRealizations()}
                        </div>}

                    </>
                );
            case 'disconnected':
                return <div className="status">Disconnected. Attempting to reconnect...</div>;
            case 'connection_failed':
                return (
                    <div className="status">
                        Connection Failed: <button onClick={() => window.location.reload()}>Retry</button>
                    </div>
                );
            case 'error':
                return (
                    <div className="status">
                        Error: {error} <button onClick={() => { localStorage.clear(); window.location.reload(); }}>Reset</button>
                    </div>
                );
            default:
                return <div className="status">Unknown status</div>;
        }
    };

    return (
        <div className="App">
            <div className={"startingScreen"}>
                <img src={"/elements/logo.svg"}/>
            </div>
            {renderContent()}
        </div>
    );
}

export default App;
