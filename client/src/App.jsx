import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import config from './config';
import './App.css';
import CardActions from './components/CardActions.jsx';
import Card from "./components/Card.jsx";

function App() {
    const [socket, setSocket] = useState(null);
    const [status, setStatus] = useState('connecting');
    const [error, setError] = useState(null);
    const [userConfig, setUserConfig] = useState(null);
    const [realizations, setRealizations] = useState([]);

    useEffect(() => {
        const newSocket = io(config.serverUrl, {
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to server');
            const token = localStorage.getItem('userToken');
            if (token) {
                setStatus('updating_config');
                newSocket.emit('update_config', { userId: token });
                newSocket.emit('request_realizations', { userId: token });
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
        });

        newSocket.on('config_updated', (config) => {
            console.log('Config updated:', config);
            setUserConfig(config);
            setStatus('ready');
            newSocket.emit('request_realizations', { userId: config.token });
        });

        newSocket.on('realizations', (newRealizations) => {
            console.log('Realizations received:', newRealizations);
            setRealizations(prev => [...prev, ...newRealizations]);
        });

        newSocket.on('preferences_updated', ({ preferences }) => {
            console.log('Client side Preferences updated:', preferences);
            setUserConfig(config => ({ ...config, preferences }));
        });

        newSocket.on('disconnect', () => {
            setStatus('disconnected');
            console.log('Disconnected from server');
        });

        newSocket.on('connect_error', (err) => {
            console.error('Connection failed:', err);
            setStatus('connection_failed');
            setError(err.message);
        });

        newSocket.on('error', (err) => {
            console.error('Socket error:', err);
            setStatus('error');
            setError(err);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleRate = (action) => {
        if (realizations.length > 0 && socket) {
            const currentRealization = realizations[0]._id;
            console.log('Rating realization:', currentRealization, action);

            // Emit the rating event to the server
            socket.emit('rate_realization', {
                userId: localStorage.getItem('userToken'),
                realizationId: currentRealization,
                action
            });

            // Remove the rated realization from the list using filter
            setRealizations(prev => prev.filter(r => r._id !== currentRealization));
        }
    };



    const renderRealizations = () => {
        if (realizations.length > 0) {
            const currentRealization = realizations[0];
            return (
                <Card realization={currentRealization} />
            );
        } else {
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
                    <div className="status">
                        <div>Preferences: {JSON.stringify(userConfig?.preferences)}</div>
                        {renderRealizations()}
                        <CardActions onRate={handleRate} />
                    </div>
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
            <button onClick={() => {
                localStorage.clear();
                window.location.reload();
            }}>Reset
            </button>
            {renderContent()}
        </div>
    );
}

export default App;
