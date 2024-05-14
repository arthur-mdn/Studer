import React, { useEffect, useState } from 'react';

function ChatDetail({ chat, onSendQuestion, onBackToList }) {
    const [askedQuestions, setAskedQuestions] = useState(new Set(chat.askedQuestions || []));

    useEffect(() => {
        // Update askedQuestions from the chat prop which is managed by App.js
        setAskedQuestions(new Set(chat.askedQuestions || []));
    }, [chat]);

    const sendQuestion = (questionText) => {
        if (!askedQuestions.has(questionText)) {
            onSendQuestion(questionText);
            const updatedAskedQuestions = new Set(askedQuestions).add(questionText);
            setAskedQuestions(updatedAskedQuestions);
        }
    };

    return (
        <div className="chat-detail">
            <div className={"fr g1"}>
                <button className="back-to-chat-list" onClick={onBackToList}>Retour</button>
                <h2>{chat.realization.title}</h2>
            </div>
            <div className={"fc g1 h100 jc-sb"}>
                <ul className="messages">
                    {chat.messages.map((msg, index) => (
                        <li key={index} className={msg.from === 'user' ? 'user-message' : 'bot-message'}>
                            {msg.text}
                        </li>
                    ))}
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
