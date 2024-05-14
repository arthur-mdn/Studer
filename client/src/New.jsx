import React, { useState, useRef } from 'react';
import config from "./config.js";

function New() {
    const [realization, setRealization] = useState({
        firstImage: null,
        images: [],
        title: '',
        description: '',
        questions: [],
        scores: {
            crea: 0,
            com: 0,
            dev: 0
        },
        type: '',
        difficulty: 1,
        duration: 1,
        year: (new Date()).getFullYear()
    });

    const formRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRealization({ ...realization, [name]: value });
    };

    const handleScoreChange = (e) => {
        const { name, value } = e.target;
        const numValue = Math.min(5, Math.max(0, Number(value)));  // Ensure the value is between 0 and 5
        setRealization({
            ...realization,
            scores: { ...realization.scores, [name]: numValue }
        });
    };

    const handleImageChange = (e) => {
        const { name, files } = e.target;
        if (name === 'firstImage') {
            setRealization({ ...realization, firstImage: files[0] });
        } else {
            setRealization({ ...realization, images: Array.from(files) });
        }
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = realization.questions.map((q, i) => {
            if (i === index) return { ...q, [field]: value };
            return q;
        });
        setRealization({ ...realization, questions: updatedQuestions });
    };

    const addQuestion = () => {
        setRealization({
            ...realization,
            questions: [...realization.questions, { question: '', answer: '' }]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const totalScore = Object.values(realization.scores).reduce((acc, score) => acc + score, 0);
        if (totalScore !== 5) {
            alert("Le total des scores doit être exactement 5.");
            return;
        }

        if (!realization.firstImage) {
            alert("Veuillez fournir au moins une image principale.");
            return;
        }

        const formData = new FormData();
        formData.append('title', realization.title);
        formData.append('description', realization.description);
        if (realization.firstImage) {
            formData.append('firstImage', realization.firstImage);
        }
        realization.images.forEach((image, index) => {
            formData.append(`images`, image);
        });
        formData.append('type', realization.type);
        formData.append('difficulty', realization.difficulty);
        formData.append('duration', realization.duration);
        formData.append('year', realization.year);
        formData.append('scores', JSON.stringify(realization.scores));
        realization.questions.forEach((q, index) => {
            formData.append(`questions[${index}][question]`, q.question);
            formData.append(`questions[${index}][answer]`, q.answer);
        });

        try {
            const response = await fetch(`${config.serverUrl}/realizations/`, {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                const result = await response.json();
                console.log('Success:', result);
                alert('Realization ajoutée avec succès');

                // Reset the form using the form reference
                formRef.current.reset();

                // Also reset the state
                setRealization({
                    firstImage: null,
                    images: [],
                    title: '',
                    description: '',
                    questions: [],
                    scores: {
                        crea: 0,
                        com: 0,
                        dev: 0
                    },
                    type: '',
                    difficulty: 1,
                    duration: 1,
                    year: (new Date()).getFullYear()
                });
            } else {
                throw new Error('Réponse du serveur incorrecte.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Impossible d'ajouter la réalisation. Veuillez réessayer.");
        }
    };

    return (
        <div className={"fc ta-l g0-5 p1"}>
            <h1>Ajouter un Nouveau Projet</h1>
            <p>Interface pour ajouter de nouvelles informations.</p>
            <form ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label htmlFor="title">Titre: </label>
                    <input type="text" id="title" name="title" required value={realization.title} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="description">Description: </label>
                    <textarea id="description" style={{resize:"vertical", height:"5rem"}} name="description" required value={realization.description} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="firstImage">Image Principale: </label>
                    <input type="file" id="firstImage" name="firstImage" onChange={handleImageChange} />
                </div>
                <div>
                    <label htmlFor="images">Images: </label>
                    <input type="file" id="images" name="images" multiple onChange={handleImageChange} />
                </div>
                <div>
                    <label>Type de Projet: </label>
                    <input type="text" name="type" value={realization.type} required onChange={handleChange} placeholder="Projet universitaire" />
                </div>
                <div>
                    <label htmlFor="difficulty">Difficulté (1-5): </label>
                    <select id="difficulty" name="difficulty" value={realization.difficulty} onChange={handleChange}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="duration">Durée (1-5): </label>
                    <select id="duration" name="duration" value={realization.duration} onChange={handleChange}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="year">Année de Réalisation: </label>
                    <input type="number" id="year" name="year" value={realization.year} required onChange={handleChange} />
                </div>
                <div>
                    <label>Scores (répartir un total max de 5 points):</label>
                    <div>
                        <label htmlFor="crea">Création: </label>
                        <input type="number" id="crea" name="crea" value={realization.scores.crea} required onChange={handleScoreChange} />
                    </div>
                    <div>
                        <label htmlFor="com">Communication: </label>
                        <input type="number" id="com" name="com" value={realization.scores.com} required onChange={handleScoreChange} />
                    </div>
                    <div>
                        <label htmlFor="dev">Développement: </label>
                        <input type="number" id="dev" name="dev" value={realization.scores.dev} required onChange={handleScoreChange} />
                    </div>
                </div>
                <div>
                    <label>Questions & Réponses:</label>
                    {realization.questions.map((q, index) => (
                        <div key={index} className={"fc"}>
                            <input type="text" placeholder="Question" value={q.question} onChange={(e) => handleQuestionChange(index, 'question', e.target.value)} />
                            <textarea placeholder="Réponse" value={q.answer} onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)} />
                        </div>
                    ))}
                    <button type="button" onClick={addQuestion}>Ajouter une Question</button>
                </div>
                <button type="submit">Soumettre</button>
            </form>
        </div>
    );
}

export default New;
