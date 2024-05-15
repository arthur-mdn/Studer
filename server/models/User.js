const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    token: { type: String, required: true, unique: true },
    socketId: { type: String, required: true },
    preferences: {
        crea: { type: Number, default: 0 },
        com: { type: Number, default: 0 },
        dev: { type: Number, default: 0 }
    },
    seenRealizations: [{ type: Schema.Types.ObjectId, ref: 'Realization' }],
    seenQuizzes: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
    chatHistory: [{
        realizationId: { type: Schema.Types.ObjectId, ref: 'Realization' },
        openedAt: { type: Date, default: Date.now },
        questions: [{
            question: String,
            askedAt: { type: Date, default: Date.now }
        }]
    }],
    finished: {
        type: Boolean,
        default: false
    },
    finishAtActionsCount: {
        type: Number,
        default: 6
    }
});

module.exports = mongoose.model('User', userSchema);
