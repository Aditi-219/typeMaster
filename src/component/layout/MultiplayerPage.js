import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from './firebase'; 
import { doc, setDoc, updateDoc, getDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'; // Firestore methods
import  './MultiplayerPage.css'; 

const MultiplayerPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [lobbyId, setLobbyId] = useState('');
  const [playerA, setPlayerA] = useState(null);
  const [playerB, setPlayerB] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [text, setText] = useState(''); 
  const [typedTextA, setTypedTextA] = useState(''); 
  const [typedTextB, setTypedTextB] = useState(''); 
  const [lobbyError, setLobbyError] = useState(null); 
  const [isLobbyValid, setIsLobbyValid] = useState(false); 
  const auth = getAuth();

  // Sample text for typing
  const sampleText = "The quick brown fox jumped over the lazy dog.";

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });
    return unsubscribe;
  }, [auth]);

  // Set sample text when lobby is created or joined
  useEffect(() => {
    if (lobbyId) {
      setText(sampleText);
    }
  }, [lobbyId]);

  useEffect(() => {
    if (!lobbyId) return;
    const unsubscribe = onSnapshot(doc(db, 'lobbies', lobbyId), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setText(data.text);
        setPlayerA(data.playerA);
        setPlayerB(data.playerB);
        setGameStarted(data.gameStarted);
        setCountdown(data.countdown);
        setLobbyError(null); // Reset error if lobby exists
        setIsLobbyValid(true); // Set lobby as valid
      } else {
        setLobbyError('Lobby not found. Please check the Lobby ID.');
        setPlayerA(null);
        setPlayerB(null);
        setGameStarted(false);
        setCountdown(0);
        setIsLobbyValid(false); // Set lobby as invalid
      }
    });
    return () => unsubscribe();
  }, [lobbyId]);

  // Handle the Create Lobby Button
  const createLobby = async () => {
    const newLobbyId = generateLobbyId(); // Generate a simpler lobby ID
    const player = {
      uid: user.uid,
      email: user.email,
      typedText: '',
      wpm: 0
    };
    const lobbyRef = doc(db, 'lobbies', newLobbyId);
    await setDoc(lobbyRef, {
      playerA: player,
      playerB: null,
      text: sampleText,
      countdown: 3,
      gameStarted: false,
      gameEnded: false,
    });
    setLobbyId(newLobbyId); // Set the current lobby ID to the new one
  };
  

  
  const joinLobby = async () => {
    if (!lobbyId || lobbyId.length < 6) return; 

    const lobbyRef = doc(db, 'lobbies', lobbyId);
    const lobbyDoc = await getDoc(lobbyRef);

    
    if (lobbyDoc.exists()) {
      const data = lobbyDoc.data();
      if (!data.playerB) {
        const player = {
          uid: user.uid,
          email: user.email,
          typedText: '',
          wpm: 0
        };
        await updateDoc(lobbyRef, {
          playerB: player
        });
      } else {
        setLobbyError('Lobby is already full.');
      }
    } else {
      setLobbyError('Lobby not found. Please check the Lobby ID.');
    }
  };

  
  const generateLobbyId = () => {
    return Math.random().toString(36).substring(2, 8); 
  };

  // Start the game
  const startGame = async () => {
    const lobbyRef = doc(db, 'lobbies', lobbyId);
    await updateDoc(lobbyRef, { gameStarted: true, countdownStart: serverTimestamp() });
    setGameStarted(true);

    
    let countdownValue = 3;
    const countdownInterval = setInterval(() => {
      if (countdownValue > 0) {
        setCountdown(countdownValue);
        countdownValue -= 1;
      } else {
        clearInterval(countdownInterval);
        setCountdown(0);
        
      }
    }, 1000);
  };

  return (
    <div className='multiplayer-page-container'>
      {!isLoggedIn ? (
        <div className='auth-container'>
          <p>Please log in to play multiplayer.</p>
        </div>
      ) : (
        <div className='multiplayer-container'>
          <h1>Multiplayer Game</h1>
          
          {/* Create/Join Lobby Section */}
          {!lobbyId ? (
            <div className='lobby-buttons'>
              <button onClick={createLobby} className='button'>Create Lobby</button>
              <div className='join-lobby'>
                <input
                  type="text"
                  placeholder="Enter Lobby ID"
                  value={lobbyId}
                  onChange={(e) => setLobbyId(e.target.value)}
                  className='input-lobby'
                />
                <button
                  onClick={joinLobby}
                  className='button'
                  disabled={!lobbyId || lobbyId.length < 6} 
                >
                  Join Lobby
                </button>
              </div>
              {lobbyError && <p className='error-message'>{lobbyError}</p>} {/* Show error if any */}
            </div>
          ) : (
            <div>
              <h2>Lobby ID: {lobbyId}</h2>
              {playerA && playerB ? (
                <div>
                  <p>Player A: {playerA.email}</p>
                  <p>Player B: {playerB.email}</p>
                  {countdown > 0 && !gameStarted && <div className='countdown'>Game starts in: {countdown} seconds</div>}
                  {gameStarted && <div className='game-started'>Game Started! 🎮</div>}
                </div>
              ) : (
                <div className='waiting'>Waiting for players to join...</div>
              )}
              {gameStarted ? (
                <div className='game-area'>
                  <div className='player'>
                    <h3>Player A</h3>
                    <textarea
                      value={typedTextA}
                      onChange={(e) => setTypedTextA(e.target.value)}
                      placeholder="Start typing..."
                      className='textarea'
                    />
                  </div>

                  <div className='player'>
                    <h3>Player B</h3>
                    <textarea
                      value={typedTextB}
                      onChange={(e) => setTypedTextB(e.target.value)}
                      placeholder="Start typing..."
                      className='textarea'
                    />
                  </div>

                  <div className='game-text'>
                    <p>{text}</p>
                  </div>
                </div>
              ) : (
                <button onClick={startGame} className='button'>Start Game</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiplayerPage;
