import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import config from './config';
import './App.css';
import CardActions from './components/CardActions.jsx';
import Card from "./components/Card.jsx";
import CardDetail from "./components/CardDetail.jsx";
import ChatList from "./components/ChatList.jsx";
import ChatDetail from "./components/ChatDetail.jsx";
import { FaMessage } from "react-icons/fa6";
import {useModal} from "./components/Modale/ModaleContext";
import QuizCard from "./components/QuizCard.jsx";
import QuizActions from "./components/QuizActions.jsx";

function App() {
    const [socket, setSocket] = useState(null);
    const {newModal} = useModal();
    const [status, setStatus] = useState('connecting');
    const [error, setError] = useState(null);
    const [userConfig, setUserConfig] = useState(null);
    const [realizations, setRealizations] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [view, setView] = useState('list'); // 'list', 'detail', 'chatDetail'
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
            newSocket.emit('request_realizations', { userId: config.token });
            newSocket.emit('request_quizzes', { userId: config.token });
        });

        newSocket.on('realizations', (newRealizations) => {
            setRealizations(prev => [...prev, ...newRealizations]);
        });

        newSocket.on('quizzes', (newQuizzes) => {
            setQuizzes(prev => [...prev, ...newQuizzes]);
        });

        newSocket.on('preferences_updated', ({ preferences }) => {
            setUserConfig(config => ({ ...config, preferences }));
        });

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
        // Show the welcome modal only if it hasn't been dismissed by the user
        if (!localStorage.getItem('welcomeModalShown')) {
            newModal({
                boutonClose: true,
                titre: "Bienvenue sur Studer.",
                htmlContent:
                    `Le site pour matcher avec ton avenir ! 
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
            const currentRealization = realizations[0]._id;
            socket.emit('rate_realization', {
                userId: localStorage.getItem('userToken'),
                realizationId: currentRealization,
                action
            });

            setRealizations(prev => prev.filter(r => r._id !== currentRealization));
            setRealizationCount(prev => prev + 1);

            if ((realizationCount + 1) % 3 === 0 && quizzes.length > 0) {
                setSelectedQuiz(quizzes.shift());
                setView('quiz');
            }
        }
    };

    //useEffect to display realizationsCount each time it changes
    useEffect(() => {
        console.log("Realizations count:", realizationCount);
        console.log("quizzes lenght", quizzes.length)
    }, [realizationCount]);

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


    const renderRealizations = () => {
        switch (view) {
            case 'list':
                if (realizations.length > 0) {
                    const currentRealization = realizations[0];
                    return (
                        <>
                            <Card realization={currentRealization} onView={() => handleViewDetails(currentRealization)} onAddToChat={() => handleAddToChat(currentRealization)} />
                            <CardActions onRate={handleRate} />
                        </>
                    );
                } else {
                    return <div className="status">No more realizations to rate.</div>;
                }
            case 'detail':
                if (selectedRealization) {
                    return <CardDetail realization={selectedRealization} onBack={handleBackToList} onOpenChat={()=> handleAddToChat(selectedRealization)} />;
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
            default:
                return <div className="status">No more realizations to rate.</div>;
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
                        <div className={"mobile-menu display-mobile"}>
                            <button onClick={toggleChat}>
                                <FaMessage/>
                            </button>
                        </div>
                        <ChatList isOpen={isChatOpen} toggleChat={toggleChat} chatHistory={chatHistory} onOpenChatDetail={handleOpenChatDetail} />
                        <div className="status realizations">
                            {renderRealizations()}
                        </div>
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
            <button id={"reset"} onClick={() => {
                localStorage.clear();
                window.location.reload();
            }}>
                {JSON.stringify(userConfig?.preferences)}
                Reset
            </button>
            {renderContent()}
        </div>
    );
}

export default App;
