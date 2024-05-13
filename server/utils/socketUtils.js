// utils/socketUtils.js
let io = null;
const userSocketMap = {};

const setIo = (newIo) => {
    io = newIo;
};


const associateUserSocket = (screenId, socketId) => {
    userSocketMap[screenId] = socketId;
};

const getSocketId = (screenId) => {
    return userSocketMap[screenId];
};

const removeSocketId = (socketId) => {
    for (const screenId in userSocketMap) {
        if (userSocketMap[screenId] === socketId) {
            delete userSocketMap[screenId];
            return screenId;
        }
    }
    return null;
};


module.exports = { setIo, associateUserSocket, removeSocketId };
