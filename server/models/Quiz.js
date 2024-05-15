const mongoose = require('mongoose');
const { Schema } = mongoose;

const quizSchema = new Schema({
    question: { type: String, required: true },
    parcours: { type: String, enum: ['crea', 'com', 'dev'], required: true },
    answers: [{
        response: { type: String, required: true },
        influence: { type: Number, required: true }
    }]
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
