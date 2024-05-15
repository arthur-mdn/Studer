import React, { useState } from 'react';
import config from './config';

function NewQuiz() {
    const [quiz, setQuiz] = useState({
        question: '',
        parcours: '',
        answers: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setQuiz({ ...quiz, [name]: value });
    };

    const handleAnswerChange = (index, field, value) => {
        const updatedAnswers = quiz.answers.map((answer, i) => {
            if (i === index) {
                return { ...answer, [field]: value };
            }
            return answer;
        });
        setQuiz({ ...quiz, answers: updatedAnswers });
    };

    const addAnswer = () => {
        setQuiz({
            ...quiz,
            answers: [...quiz.answers, { response: '', influence: 0 }]
        });
    };

    const removeAnswer = (index) => {
        const newAnswers = quiz.answers.filter((_, i) => i !== index);
        setQuiz({
            ...quiz,
            answers: newAnswers
        });
    };

    const validateInfluences = () => {
        const totalInfluence = quiz.answers.reduce((acc, answer) => acc + Number(answer.influence), 0);
        return totalInfluence.toFixed(2) === '1.00';
    };

    const validateAnswers = () => {
        return quiz.answers.every(answer =>
            Number(answer.influence) >= 0 && Number(answer.influence) <= 1
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (quiz.answers.length === 0) {
            alert("Ajoutez au moins une réponse.");
            return;
        }

        if (!validateInfluences()) {
            alert("La somme des influences doit être exactement 1.");
            return;
        }

        if (!validateAnswers()) {
            alert("Chaque influence doit être un nombre décimal entre 0 et 1.");
            return;
        }

        try {
            const response = await fetch(`${config.serverUrl}/quizzes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(quiz)
            });
            if (response.ok) {
                const result = await response.json();
                console.log('Quiz added successfully:', result);
                alert('Quiz ajouté avec succès');
                setQuiz({ question: '', parcours: '', answers: [] });
            } else {
                throw new Error('Failed to add quiz');
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Impossible d'ajouter le quiz. Veuillez réessayer.");
        }
    };

    return (
        <div className="new-quiz-container">
            <h1>Ajouter un Nouveau Quiz</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="question">Question: </label>
                    <input
                        type="text"
                        id="question"
                        name="question"
                        value={quiz.question}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="parcours">Parcours: </label>
                    <select
                        id="parcours"
                        name="parcours"
                        value={quiz.parcours}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Sélectionner un parcours</option>
                        <option value="crea">Création</option>
                        <option value="com">Communication</option>
                        <option value="dev">Développement</option>
                    </select>
                </div>
                <div className="answers-section">
                    <label>Réponses:</label>
                    {quiz.answers.map((answer, index) => (
                        <div key={index} className="answer-input">
                            <input
                                type="text"
                                placeholder="Réponse"
                                value={answer.response}
                                onChange={(e) => handleAnswerChange(index, 'response', e.target.value)}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Influence"
                                value={answer.influence}
                                onChange={(e) => handleAnswerChange(index, 'influence', parseFloat(e.target.value))}
                                step="0.1"
                                min="0"
                                max="1"
                                required
                            />
                            <button type="button" onClick={() => removeAnswer(index)}>Supprimer</button>
                        </div>
                    ))}
                    <button type="button" onClick={addAnswer}>Ajouter une Réponse</button>
                </div>
                <button type="submit">Soumettre le Quiz</button>
            </form>
        </div>
    );
}

export default NewQuiz;
