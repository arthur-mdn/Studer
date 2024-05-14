require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const uuid = require('uuid');
const cors = require('cors');
const User = require('./models/User');
const Realization = require('./models/Realization');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const database = require('./others/database');
const config = require('./others/config');
const upload = multer({ dest: 'uploads/' });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: config.clientUrl,
        credentials: true
    },
    pingInterval: 10000,
    pingTimeout: 5000
});

// Connect to MongoDB
database.connect();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors((req, callback) => {
    const allowedOrigins = [config.clientUrl];
    let corsOptions;

    if (allowedOrigins.includes(req.header('Origin'))) {
        corsOptions = { origin: true, credentials: true};
    } else {
        corsOptions = { origin: false };
    }

    callback(null, corsOptions);
}));


async function getRandomRealizations(user, size = 1) {
    // Ensure the sample size is a number and greater than 0
    const sampleSize = Math.max(1, parseInt(size, 10));

    // Correctly instantiate ObjectId for each id in seenRealizations
    const seenIds = user.seenRealizations.map(id => new mongoose.Types.ObjectId(id));

    const realizations = await Realization.aggregate([
        { $match: { _id: { $nin: seenIds } } },
        { $sample: { size: sampleSize } }
    ]);
    return realizations;
}



// Socket.IO logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('request_code', async () => {
        try {
            // Create a new user with a unique token
            const newUser = new User({ token: uuid.v4() });
            newUser.socketId = socket.id;
            await newUser.save();

            // Emit the unique token to the user
            socket.emit('receive_code', newUser);
        } catch (error) {
            socket.emit('error', 'Error generating a unique token');
        }
    });

    socket.on('update_config', async (data) => {
        try {
            const user = await User.findOne({ token: data.userId });
            if (user) {
                // Update user's socket ID
                user.socketId = socket.id;
                await user.save();

                socket.emit('config_updated', user);
            } else {
                socket.emit('error', 'User not found');
            }
        } catch (error) {
            socket.emit('error', 'Error updating user configuration');
        }
    });

    socket.on('request_realizations', async (data) => {
        try {
            const user = await User.findOne({ token: data.userId });
            if (!user) {
                socket.emit('error', 'User not found');
                return;
            }
            const realizations = await getRandomRealizations(user, 50);
            socket.emit('realizations', realizations);
        } catch (error) {
            socket.emit('error', 'Error fetching realizations');
        }
    });


    socket.on('rate_realization', async (data) => {
        try {
            const { userId, realizationId, action } = data;
            const user = await User.findOne({ token: userId });
            const realization = await Realization.findById(realizationId);

            if (!user || !realization) {
                socket.emit('error', 'User or Realization not found');
                return;
            }

            // Update seenRealizations
            if (!user.seenRealizations.includes(realizationId)) {
                user.seenRealizations.push(realizationId);
            }

            const { crea, com, dev } = realization.scores;
            const total = crea + com + dev;
            const influence = { like: 2, superlike: 4, dislike: -2, nope: 0 }[action];

            if (influence === undefined) {
                socket.emit('error', 'Invalid rating action');
                return;
            }

            // Apply the scores based on the action
            user.preferences.crea += (crea / total) * influence;
            user.preferences.com += (com / total) * influence;
            user.preferences.dev += (dev / total) * influence;

            await user.save();

            // Fetch new realizations to send back to the user
            const newRealizations = await getRandomRealizations(user, 1);

            // Send the updated preferences and new realizations
            socket.emit('preferences_updated', { preferences: user.preferences });
            console.log('preferences_updated:', user.preferences)
            socket.emit('realizations', newRealizations);
        } catch (error) {
            console.error('Error rating realization:', error);
            socket.emit('error', 'Error rating realization');
        }
    });

    socket.on('ask_question', async (data) => {
        try {
            const { userId, realizationId, question } = data;
            const user = await User.findOne({ token: userId });
            const realization = await Realization.findById(realizationId);

            if (!user || !realization) {
                socket.emit('error', 'User or Realization not found');
                return;
            }

            const answer = realization.questions.find(q => q.question === question)?.answer;
            if (!answer) {
                socket.emit('error', 'Question not found');
                return;
            }

        } catch (error) {
            console.error('Error asking question:', error);
            socket.emit('error', 'Error asking question');
        }
    })

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.post('/realizations', upload.fields([{ name: 'firstImage' }, { name: 'images' }]), async (req, res) => {
    try {
        console.log('Received fields:', req.body);
        console.log('Received files:', req.files);

        // Parse scores safely
        let parsedScores;
        try {
            parsedScores = JSON.parse(req.body.scores);
        } catch (error) {
            console.error('Error parsing scores:', error);
            return res.status(400).json({ message: 'Invalid scores format' });
        }

        // Parse questions safely
        let parsedQuestions;
        if (typeof req.body.questions === 'string') {
            try {
                parsedQuestions = JSON.parse(req.body.questions);
            } catch (error) {
                console.error('Error parsing questions string:', error);
                return res.status(400).json({ message: 'Invalid questions format' });
            }
        } else {
            parsedQuestions = req.body.questions || [];
        }

        const realization = new Realization({
            title: req.body.title,
            description: req.body.description,
            firstImage: req.files['firstImage'] ? req.files['firstImage'][0].path : '',
            images: req.files['images'] ? req.files['images'].map(file => file.path) : [],
            type: req.body.type,
            difficulty: Number(req.body.difficulty),
            duration: Number(req.body.duration),
            year: Number(req.body.year),
            scores: parsedScores,
            questions: parsedQuestions
        });

        await realization.save();
        res.status(201).json({ message: 'Realization added successfully', realization });
    } catch (error) {
        console.error('Failed to add realization:', error);
        res.status(500).json({ message: 'Failed to add realization' });
    }
});


server.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port ${process.env.PORT || 3000}`);
});
