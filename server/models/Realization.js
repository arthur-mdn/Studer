const mongoose = require('mongoose');
const { Schema } = mongoose;

const realizationSchema = new Schema({
    image: String,
    title: String,
    description: String,
    questions: [{
        question: String,
        answer: String
    }],
    scores: {
        crea: { type: Number, default: 0 },
        com: { type: Number, default: 0 },
        dev: { type: Number, default: 0 }
    },
    type: String,
    difficulty: Number,
    duration: Number,
    year: Number
});

module.exports = mongoose.model('Realization', realizationSchema);
