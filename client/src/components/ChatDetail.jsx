import React, { useEffect, useState } from 'react';
import {FaArrowLeftLong} from "react-icons/fa6";

function ChatDetail({ chat, onSendQuestion, onBackToList }) {
    const [askedQuestions, setAskedQuestions] = useState(new Set(chat.askedQuestions || []));
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [messages, setMessages] = useState([...chat.messages]); // Initialize with the current messages

    useEffect(() => {
        // Update askedQuestions based on the updated chat prop
        setAskedQuestions(new Set(chat.askedQuestions || []));
        setMessages([...chat.messages]); // Update messages when the chat updates
    }, [chat]);

    const sendQuestion = (questionText) => {
        if (!askedQuestions.has(questionText)) {
            onSendQuestion(questionText);

            const updatedAskedQuestions = new Set(askedQuestions).add(questionText);
            setAskedQuestions(updatedAskedQuestions);
            setMessages([...messages, { text: questionText, from: 'user' }]);
            setIsBotTyping(true);

            setTimeout(() => {
                setIsBotTyping(false);
                setTimeout(() => {
                    setMessages([...messages, { text: questionText, from: 'user' }, { text: findAnswerForQuestion(questionText), from: 'bot' }]);
                }, 1);
            }, 3000);
        }
    };

    const findAnswerForQuestion = (questionText) => {
        const question = chat.realization.questions.find(q => q.question === questionText);
        return question ? question.answer : "Pas de réponse trouvée.";
    };

    return (
        <div className="chat-detail">
            <div className={"fr g1"}>
                <button className="back-to-chat-list fr g0-5 ai-c" onClick={onBackToList}><FaArrowLeftLong/>Retour</button>
                <h2>{chat.realization.title}</h2>
            </div>
            <div className={"fc g1 h100 jc-sb"}>
                <ul className="messages">
                    {messages.map((msg, index) => (
                        <li key={index} className={msg.from === 'user' ? 'user-message' : 'bot-message'}>
                            {msg.text}
                        </li>
                    ))}
                    {isBotTyping && <li className="bot-message typing">
                        <div className="ticontainer">
                            <div className="tiblock">
                                <div className="tidot"></div>
                                <div className="tidot"></div>
                                <div className="tidot"></div>
                            </div>
                        </div>
                    </li>}
                </ul>
                <div className="question-buttons">
                    {chat.realization.questions.map((q, index) => (
                        !askedQuestions.has(q.question) && (
                            <button key={index} onClick={() => sendQuestion(q.question)}>
                                {q.question}
                            </button>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ChatDetail;
