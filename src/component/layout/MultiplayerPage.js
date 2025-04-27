import React, { useState, useEffect, useRef} from "react";
import { getAuth } from "firebase/auth";
import { db } from "./firebase";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore"; // Firestore methods
import "./MultiplayerPage.css";

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);


const MultiplayerPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [lobbyId, setLobbyId] = useState("");
  const [playerA, setPlayerA] = useState(null);
  const [playerB, setPlayerB] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [text, setText] = useState("");
  const [typedTextA, setTypedTextA] = useState("");
  const [typedTextB, setTypedTextB] = useState("");
  const [lobbyError, setLobbyError] = useState(null);
  const [isLobbyValid, setIsLobbyValid] = useState(false);
  const [lobbyInput, setLobbyInput] = useState("");
  const [shouldJoinLobby, setShouldJoinLobby] = useState(false);
  const [gameTime] = useState(60); // default timer (60 seconds)
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameEnded, setGameEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const typingContainerARef = React.useRef(null);
  const typingContainerBRef = React.useRef(null);
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

  // Add this to your existing useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      const container =
        playerA?.uid === user?.uid
          ? typingContainerARef.current
          : typingContainerBRef.current;
      if (container && document.activeElement !== container) {
        container.focus();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [playerA, playerB, user]);

  useEffect(() => {
    if (!lobbyId) return;
    const unsubscribe = onSnapshot(doc(db, "lobbies", lobbyId), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setText(data.text);
        setPlayerA(data.playerA);
        setPlayerB(data.playerB);
        setGameStarted(data.gameStarted);
        setCountdown(data.countdown);
        setGameEnded(data.gameEnded);

        // Update typed text from Firestore
        if (data.playerA?.uid === user?.uid) {
          setTypedTextA(data.playerA?.typedText || "");
        }
        if (data.playerB?.uid === user?.uid) {
          setTypedTextB(data.playerB?.typedText || "");
        }

        setLobbyError(null);
        setIsLobbyValid(true);
      } else {
        setLobbyError("Lobby not found. Please check the Lobby ID.");
        setPlayerA(null);
        setPlayerB(null);
        setGameStarted(false);
        setCountdown(0);
        setIsLobbyValid(false);
      }
    });
    return () => unsubscribe();
  }, [lobbyId]);

  // Handle the Create Lobby Button
  const createLobby = async () => {
    const newLobbyId = generateLobbyId();
    const player = {
      uid: user.uid,
      email: user.email,
      typedText: "",
      wpm: 0,
    };
    
    const lobbyRef = doc(db, "lobbies", newLobbyId);
    await setDoc(lobbyRef, {
      playerA: player,
      playerB: null,
      text: sampleText,
      countdown: 3,
      gameStarted: false,
      gameEnded: false,
      canJoin: true, // Add this field to track join status
    });
    setLobbyId(newLobbyId);
  };

  // In your joinLobby function:
  const joinLobby = async () => {
    if (!lobbyId || lobbyId.length < 6) return;

    const lobbyRef = doc(db, "lobbies", lobbyId);
    const lobbyDoc = await getDoc(lobbyRef);

    if (lobbyDoc.exists()) {
      const data = lobbyDoc.data();

      // Prevent joining if game started or lobby full
      if (data.gameStarted || !data.canJoin) {
        setLobbyError("Game has already started. Cannot join now.");
        return;
      }

      if (!data.playerB) {
        const player = {
          uid: user.uid,
          email: user.email,
          typedText: "",
          wpm: 0,
        };
        await updateDoc(lobbyRef, {
          playerB: player,
          canJoin: false, // Close the lobby after Player B joins
        });
      } else {
        setLobbyError("Lobby is already full.");
      }
    } else {
      setLobbyError("Lobby not found. Please check the Lobby ID.");
    }
  };

  

  useEffect(() => {
    if (shouldJoinLobby && lobbyId.length >= 6) {
      joinLobby();
      setShouldJoinLobby(false); // reset flag
    }
  }, [shouldJoinLobby, lobbyId]);

  const generateLobbyId = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const startGame = async () => {
    const lobbyRef = doc(db, "lobbies", lobbyId);
    const lobbyDoc = await getDoc(lobbyRef);

    if (lobbyDoc.exists()) {
      const data = lobbyDoc.data();

      // Prevent starting if Player B hasn't joined
      if (!data.playerB) {
        setLobbyError("Waiting for Player B to join");
        return;
      }

      const gameEndTime = new Date();
      gameEndTime.setSeconds(gameEndTime.getSeconds() + gameTime);

      await updateDoc(lobbyRef, {
        gameStarted: true,
        countdownStart: serverTimestamp(),
        gameEndTime: gameEndTime,
        canJoin: false, // Ensure no more players can join
      });

      setGameStarted(true);

      // Start countdown
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
    }
  };

  useEffect(() => {
    if (!gameStarted) return;

    const syncTimer = async () => {
      try {
        const lobbyRef = doc(db, "lobbies", lobbyId);
        const lobbyDoc = await getDoc(lobbyRef);

        if (!lobbyDoc.exists()) {
          console.warn("Lobby document doesn't exist");
          return;
        }

        const data = lobbyDoc.data();
        if (!data.gameEndTime) {
          console.warn("No gameEndTime found in lobby data");
          return;
        }

        // Use serverTimestamp if available for better synchronization
        const serverNow = data.serverTime || serverTimestamp();
        const now = serverNow instanceof Date ? serverNow : new Date();
        const endTime = data.gameEndTime.toDate();

        const secondsLeft = Math.max(0, Math.round((endTime - now) / 1000));

        setTimeLeft(secondsLeft);

        if (secondsLeft <= 0 && !gameEnded) {
          setGameEnded(true);
          // Update Firestore to mark game as ended
          await updateDoc(lobbyRef, { gameEnded: true });
        }
      } catch (error) {
        console.error("Error in syncTimer:", error);
      }
    };

    const timer = setInterval(syncTimer, 1000);
    return () => clearInterval(timer);
  }, [gameStarted, lobbyId]);

  // Modify handleTypingA and handleTypingB to update Firestore
  const handleTypingA = async (e) => {
    if (!gameStarted) return;

    e.preventDefault();
    const key = e.key;

    let newTypedText = typedTextA;

    if (key.length === 1 && key.match(/^[a-zA-Z0-9 .,!?'"-]$/)) {
      newTypedText += key;
    } else if (key === "Backspace") {
      newTypedText = newTypedText.slice(0, -1);
    }

    setTypedTextA(newTypedText);

    // Update Firestore
    const lobbyRef = doc(db, "lobbies", lobbyId);
    await updateDoc(lobbyRef, {
      "playerA.typedText": newTypedText,
      "playerA.wpm": calculateWPM(newTypedText, gameTime - timeLeft),
    });
  };

  const handleTypingB = async (e) => {
    if (!gameStarted) return;

    e.preventDefault();
    const key = e.key;

    let newTypedText = typedTextB;

    if (key.length === 1 && key.match(/^[a-zA-Z0-9 .,!?'"-]$/)) {
      newTypedText += key;
    } else if (key === "Backspace") {
      newTypedText = newTypedText.slice(0, -1);
    }

     setTypedTextB(newTypedText);

    // Update Firestore
    const lobbyRef = doc(db, "lobbies", lobbyId);
    await updateDoc(lobbyRef, {
      "playerB.typedText": newTypedText,
      "playerB.wpm": calculateWPM(newTypedText, gameTime - timeLeft),
    });
  };

  // Add this helper function
  const calculateWPM = (typedText, elapsedSeconds) => {
    if (elapsedSeconds === 0) return 0;
    const words = typedText.trim().split(/\s+/).length;
    const minutes = elapsedSeconds / 60;
    return Math.round(words / minutes);
  };

  const determineWinner = () => {
    if (!gameEnded) return null;
    if (!playerA || !playerB) return "Not enough players";

    const playerAScore = calculateScore(playerA, text);
    const playerBScore = calculateScore(playerB, text);

    if (playerAScore > playerBScore) {
      return `${playerA.email} wins with ${
        playerA.wpm
      } WPM and ${calculateAccuracy(playerA.typedText || "", text)}% accuracy!`;
    } else if (playerBScore > playerAScore) {
      return `${playerB.email} wins with ${
        playerB.wpm
      } WPM and ${calculateAccuracy(playerB.typedText || "", text)}% accuracy!`;
    } else {
      return `It's a tie! Both scored ${
        playerA.wpm
      } WPM and ${calculateAccuracy(playerA.typedText || "", text)}% accuracy`;
    }
  };

  // Add this helper function
  const calculateAccuracy = (typedText, originalText) => {
    if (!typedText || !originalText || originalText.length === 0) return 0;

    let correctChars = 0;
    const minLength = Math.min(typedText.length, originalText.length);

    for (let i = 0; i < minLength; i++) {
      if (typedText[i] === originalText[i]) {
        correctChars++;
      }
    }

    const accuracy = (correctChars / originalText.length) * 100;
    return Math.round(accuracy);
  };

  const handleRematch = async () => {
    setIsLoading(true);
    try {
      const lobbyRef = doc(db, "lobbies", lobbyId);
      await updateDoc(lobbyRef, {
        gameStarted: false,
        gameEnded: false,
        countdown: 3,
        "playerA.typedText": "",
        "playerA.wpm": 0,
        "playerB.typedText": "",
        "playerB.wpm": 0,
        gameEndTime: null,
      });

      setTypedTextA("");
      setTypedTextB("");
      setTimeLeft(gameTime);
    } catch (error) {
      console.error("Error starting rematch:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const calculateScore = (player, originalText) => {
    const wpm = player.wpm || 0;
    const accuracy = calculateAccuracy(player.typedText || "", originalText);
    return wpm * 0.7 + accuracy * 0.3;
  };

  useEffect(() => {
    if (gameStarted && countdown === 0) {
      // Small timeout to ensure the container is rendered
      setTimeout(() => {
        if (playerA?.uid === user?.uid && typingContainerARef.current) {
          typingContainerARef.current.focus();
        } else if (playerB?.uid === user?.uid && typingContainerBRef.current) {
          typingContainerBRef.current.focus();
        }
      }, 100);
    }
  }, [gameStarted, countdown, playerA, playerB, user]);


  const GameResultChart = ({ playerA, playerB, text }) => {
    const calculateAccuracy = (typedText, originalText) => {
      if (!typedText || !originalText || originalText.length === 0) return 0;
      let correctChars = 0;
      const minLength = Math.min(typedText.length, originalText.length);
      for (let i = 0; i < minLength; i++) {
        if (typedText[i] === originalText[i]) correctChars++;
      }
      return Math.round((correctChars / originalText.length) * 100);
    };
  
    const data = {
      labels: ['WPM', 'Accuracy'],
      datasets: [
        {
          label: playerA?.email || 'Player A',
          data: [
            playerA?.wpm || 0,
            calculateAccuracy(playerA?.typedText || '', text),
          ],
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
        },
        {
          label: playerB?.email || 'Player B',
          data: [
            playerB?.wpm || 0,
            calculateAccuracy(playerB?.typedText || '', text),
          ],
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
        },
      ],
    };
  
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    };
  
    return (
      <div style={{ maxWidth: '600px', margin: 'auto', paddingTop: '20px' }}>
        <Bar data={data} options={options} />
      </div>
    );
  };
  

    return (
    <div className="multiplayer-page-container dark-theme">
      {!isLoggedIn ? (
        <div className="auth-container">
          <p>Please log in to play multiplayer.</p>
        </div>
      ) : (
        <div className="multiplayer-container">
          <h1>Multiplayer Typing Game</h1>
  
          {!lobbyId ? (
            <div className="lobby-buttons">
              <button
                onClick={createLobby}
                className="button primary"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Lobby"}
              </button>
              <div className="join-lobby">
                <input
                  type="text"
                  placeholder="Enter Lobby ID"
                  value={lobbyInput}
                  onChange={(e) => setLobbyInput(e.target.value)}
                  className="input-lobby"
                />
                <button
                  onClick={() => {
                    setLobbyId(lobbyInput);
                    setShouldJoinLobby(true);
                  }}
                  className="button secondary"
                  disabled={
                    !lobbyInput ||
                    lobbyInput.length < 6 ||
                    isLoading ||
                    (playerB && playerB.uid !== user?.uid) ||
                    gameStarted
                  }
                >
                  {isLoading ? "Joining..." : "Join Lobby"}
                </button>
              </div>
              {lobbyError && <p className="error-message">{lobbyError}</p>}
            </div>
          ) : (
            <div className="game-container">
              <div className="lobby-info">
                <h2>
                  Lobby: <span className="lobby-id">{lobbyId}</span>
                </h2>
                <div className="player-list">
                  <div
                    className={`player-tag ${
                      playerA?.uid === user?.uid ? "you" : ""
                    }`}
                  >
                    <span className="player-label">Player A:</span>
                    <span className="player-email">{playerA?.email}</span>
                    {playerA?.uid === user?.uid && (
                      <span className="you-badge">YOU</span>
                    )}
                  </div>
                  {playerB && (
                    <div
                      className={`player-tag ${
                        playerB?.uid === user?.uid ? "you" : ""
                      }`}
                    >
                      <span className="player-label">Player B:</span>
                      <span className="player-email">{playerB?.email}</span>
                      {playerB?.uid === user?.uid && (
                        <span className="you-badge">YOU</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="lobby-status">
                  {!gameStarted && (
                    <div className="lobby-status">
                      {playerB ? (
                        <p className="status-badge lobby-full">Lobby full</p>
                      ) : (
                        <p className="status-badge waiting-for-player">
                          Waiting for Player B
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
  
              {/* Game Area Content */}
              {gameEnded ? (
                <div className="game-ended">
                  <h2>Game Over ⏰</h2>
                  <p className="winner-message">{determineWinner()}</p>
                  {/* 👇 Floating chart overlay here */}
                  {gameEnded && (
                      <div className="chart-backdrop">
                      <div className="chart-overlay">
                        <GameResultChart playerA={playerA} playerB={playerB} text={text} />
                      </div>
                    </div>
                      )}
                  <div className="player-results">
                    <div>
                      <h3>Player A: {playerA?.email}</h3>
                      <p>WPM: {playerA?.wpm || 0}</p>
                      <p>
                        Accuracy: {calculateAccuracy(playerA?.typedText || "", text)}%
                      </p>
                    </div>
                    {playerB && (
                      <div>
                        <h3>Player B: {playerB?.email}</h3>
                        <p>WPM: {playerB?.wpm || 0}</p>
                        <p>
                          Accuracy: {calculateAccuracy(playerB?.typedText || "", text)}%
                        </p>
                      </div>
                    )}
                   
                  
                  </div>
                  <div className="rematch-buttons">
                    {(playerA?.uid === user?.uid || playerB?.uid === user?.uid) && (
                      <button
                        onClick={handleRematch}
                        className="button"
                        disabled={isLoading}
                      >
                        {isLoading ? "Loading..." : "Rematch"}
                      </button>
                    )}
                    <button onClick={() => setLobbyId("")} className="button">
                      Leave Lobby
                    </button>
                  </div>
                </div>
              ) : gameStarted ? (
                <div className="game-area">
                  <div className="game-info">
                    <h3>Time Left: {timeLeft} seconds</h3>
                  </div>
                  <div >
                    <h5>
                      Your WPM:{" "}
                      {playerA?.uid === user?.uid
                        ? playerA?.wpm || 0
                        : playerB?.wpm || 0}
                    </h5>
                  </div>


                  {playerA?.uid === user?.uid && (
                    <div className="player">
                      <h3>Player A (You)</h3>
                      <div
                        className="typing-containerr"
                        tabIndex={0}
                        onKeyDown={handleTypingA}
                        ref={typingContainerARef}
                      >
                        {text.split("").map((char, index) => {
                          const typedChar = typedTextA[index];
                          let className = "";
                          if (typedChar == null) {
                            className =
                              index === typedTextA.length ? "current" : "pending";
                          } else if (typedChar === char) {
                            className = "correct";
                          } else {
                            className = "incorrect";
                          }
                          return (
                            <span key={index} className={className}>
                              {char}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
  
                  {playerB?.uid === user?.uid && (
                    <div className="player">
                      <h3>Player B (You)</h3>
                      <div className="typing-containerr" tabIndex={0} onKeyDown={handleTypingB} ref={typingContainerBRef}>
                        {text.split("").map((char, index) => {
                          const typedChar = typedTextB[index];
                          let className = "";
                          if (typedChar == null) {
                            className =
                              index === typedTextB.length ? "current" : "pending";
                          } else if (typedChar === char) {
                            className = "correct";
                          } else {
                            className = "incorrect";
                          }
                          return (
                            <span key={index} className={className}>
                              {char}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {countdown > 0 && (
                    <div className="countdown">Game starts in: {countdown} seconds</div>
                  )}
                  {playerA?.uid === user?.uid && !gameStarted && (
                    <button
                      onClick={startGame}
                      className="button"
                      disabled={isLoading || !playerB}
                    >
                      {isLoading
                        ? "Starting..."
                        : playerB
                        ? "Start Game"
                        : "Waiting for Player B"}
                    </button>
                  )}
                  {playerB?.uid === user?.uid && (
                    <p className="waiting">Waiting for host to start the game...</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MultiplayerPage;
