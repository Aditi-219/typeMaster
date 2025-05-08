import React, { useState, useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";
import { db } from "./firebase";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  getDocs,
  deleteDoc
} from "firebase/firestore"; // Firestore methods
import "./MultiplayerPage.css";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { MessageCircle, Send, User } from "lucide-react";

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
  const [gameTime] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25);
  const [gameEnded, setGameEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const typingContainerARef = React.useRef(null);
  const typingContainerBRef = React.useRef(null);
  const auth = getAuth();
  const [showChart, setShowChart] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Sample text for typing
  const sampleText = "The quick brown fox jumped over the lazy dog.";

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
      // countdown: 3,
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
      // let countdownValue = 3;
      // const countdownInterval = setInterval(() => {
      //   if (countdownValue > 0) {
      //     setCountdown(countdownValue);
      //     countdownValue -= 1;
      //   } else {
      //     clearInterval(countdownInterval);
      //     setCountdown(0);
      //   }
      // }, 1000);
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
        // countdown: 3,
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
    if (gameStarted ) {
      // Small timeout to ensure the container is rendered
      setTimeout(() => {
        if (playerA?.uid === user?.uid && typingContainerARef.current) {
          typingContainerARef.current.focus();
        } else if (playerB?.uid === user?.uid && typingContainerBRef.current) {
          typingContainerBRef.current.focus();
        }
      }, 100);
    }
  }, [gameStarted, playerA, playerB, user]);

  const GameResultChart = ({ playerA, playerB, text, onClose }) => {
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
      labels: ["WPM", "Accuracy"],
      datasets: [
        {
          label: playerA?.email || "Player A",
          data: [
            playerA?.wpm || 0,
            calculateAccuracy(playerA?.typedText || "", text),
          ],
          backgroundColor: "rgba(54, 162, 235, 0.7)",
        },
        {
          label: playerB?.email || "Player B",
          data: [
            playerB?.wpm || 0,
            calculateAccuracy(playerB?.typedText || "", text),
          ],
          backgroundColor: "rgba(255, 99, 132, 0.7)",
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    };

    return (
      <div className="chart-modal">
        <div className="chart-content">
          <button
            className="chart-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            ×
          </button>
          <div className="chart-container">
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    );
  };

  // Chat Firestore listener
  useEffect(() => {
    if (!lobbyId) return;

    const q = query(
      collection(db, "lobbies", lobbyId, "messages"),
      orderBy("timestamp", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })).reverse();
      setMessages(chatData);
    });

    return () => unsubscribe();
  }, [lobbyId]);

  const sendMessage = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed || !user?.uid || !lobbyId) return;
    const messagesRef = collection(db, "lobbies", lobbyId, "messages");
    await addDoc(collection(db, "lobbies", lobbyId, "messages"), {
      text: trimmed,
      senderId: user.uid,
      senderEmail: user.email,
      timestamp: serverTimestamp(),
    });
    // Delete messages if over 50
    const snapshot = await getDocs(
      query(messagesRef, orderBy("timestamp", "asc"))
    );
  
    if (snapshot.size > 50) {
      const excess = snapshot.size - 50;
      const deletions = snapshot.docs
        .slice(0, excess)
        .map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletions);
    }
    setNewMessage("");
  };

  const cleanupChat = async () => {
    const messagesRef = collection(db, "lobbies", lobbyId, "messages");
    const snapshot = await getDocs(messagesRef);
    const deletes = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletes);
  };


  return (
    <div className="multiplayer-page-container">
      {!isLoggedIn ? (
        <div className="auth-container">
          <p>Please log in to play multiplayer.</p>
        </div>
      ) : (
        <div className="multiplayer-layout">
          <div className="game-container">
            <h1 className="game-title">Multiplayer Typing Duel</h1>

            {!lobbyId ? (
              <div className="lobby-creation">
                <div className="lobby-actions">
                  <button
                    onClick={createLobby}
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Create Lobby"}
                  </button>
                  <div className="divider">OR</div>
                  <div className="join-section">
                    <input
                      type="text"
                      placeholder="Enter Lobby ID"
                      value={lobbyInput}
                      onChange={(e) => setLobbyInput(e.target.value)}
                      className="lobby-input"
                    />
                    <button
                      onClick={() => {
                        setLobbyId(lobbyInput);
                        setShouldJoinLobby(true);
                      }}
                      className=" btn-secondary"
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
                </div>
                {lobbyError && <p className="error-message">{lobbyError}</p>}
              </div>
            ) : (
              <div className="game-content">
                <div className="lobby-header">
                  <div className="lobby-info">
                    <h2>
                      Lobby: <span className="lobby-id">{lobbyId}</span>
                    </h2>
                    <div className="player-status">
                      <div className={`player-badge ${playerA?.uid === user?.uid ? "you" : ""}`}>
                        <span className="player-name">{playerA?.email}</span>
                        {playerA?.uid === user?.uid && <span className="you-indicator">YOU</span>}
                      </div>
                      {playerB && (
                        <div className={`player-badge ${playerB?.uid === user?.uid ? "you" : ""}`}>
                          <span className="player-name">{playerB?.email}</span>
                          {playerB?.uid === user?.uid && <span className="you-indicator">YOU</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {!gameStarted && (
                    <div className="lobby-state">
                      {playerB ? (
                        <div className="status-tag full">Ready</div>
                      ) : (
                        <div className="status-tag waiting">Waiting for opponent</div>
                      )}
                    </div>
                  )}
                </div>

                {gameEnded ? (
                  <div className="game-results">
                    <h2 className="results-title">Game Over!</h2>
                    <p className="winner-announcement">{determineWinner()}</p>

                    <div className="performance-stats">
                      <div className="player-stats">
                        <h3>Player A</h3>
                        <div className="stat">
                          <span className="stat-label">WPM:</span>
                          <span className="stat-value">{playerA?.wpm || 0}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Accuracy:</span>
                          <span className="stat-value">
                            {calculateAccuracy(playerA?.typedText || "", text)}%
                          </span>
                        </div>
                      </div>
                      {playerB && (
                        <div className="player-stats">
                          <h3>Player B</h3>
                          <div className="stat">
                            <span className="stat-label">WPM:</span>
                            <span className="stat-value">{playerB?.wpm || 0}</span>
                          </div>
                          <div className="stat">
                            <span className="stat-label">Accuracy:</span>
                            <span className="stat-value">
                              {calculateAccuracy(playerB?.typedText || "", text)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="results-actions">
                      <button
                        className="btn btn-chart"
                        onClick={() => setShowChart(true)}
                      >
                        View Performance Chart
                      </button>
                      <div className="rematch-options">
                        {(playerA?.uid === user?.uid || playerB?.uid === user?.uid) && (
                          <button
                            onClick={handleRematch}
                            className="btn btn-primary"
                            disabled={isLoading}
                          >
                            {isLoading ? "Preparing..." : "Rematch"}
                          </button>
                        )}
                        <button 
                          onClick={async () => {
                            await cleanupChat();
                            setLobbyId("");
                          }} 
                          className="btn btn-exit btnLobby"
                        >
                          Exit Lobby
                        </button>
                      </div>
                    </div>

                    {showChart && (
                      <GameResultChart
                        playerA={playerA}
                        playerB={playerB}
                        text={text}
                        onClose={() => setShowChart(false)}
                      />
                    )}
                  </div>
                ) : gameStarted ? (
                  <div className="typing-game">
                    <div className="game-meta">
                      <div className="timer">
                        <span className="time-left">{timeLeft}</span> seconds remaining
                      </div>
                      <div className="wpm-display">
                        Your WPM: {playerA?.uid === user?.uid ? playerA?.wpm || 0 : playerB?.wpm || 0}
                      </div>
                    </div>

                    <div className="typing-arena">
                      {playerA?.uid === user?.uid && (
                        <div className="typing-section">
                          <h3 className="player-label">Your Typing</h3>
                          <div
                            className="typing-field"
                            tabIndex={0}
                            onKeyDown={handleTypingA}
                            ref={typingContainerARef}
                          >
                            {text.split("").map((char, index) => {
                              const typedChar = typedTextA[index];
                              let className = "";
                              if (typedChar == null) {
                                className = index === typedTextA.length ? "current-char" : "pending-char";
                              } else if (typedChar === char) {
                                className = "correct-char";
                              } else {
                                className = "incorrect-char";
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
                        <div className="typing-section">
                          <h3 className="player-label">Your Typing</h3>
                          <div
                            className="typing-field"
                            tabIndex={0}
                            onKeyDown={handleTypingB}
                            ref={typingContainerBRef}
                          >
                            {text.split("").map((char, index) => {
                              const typedChar = typedTextB[index];
                              let className = "";
                              if (typedChar == null) {
                                className = index === typedTextB.length ? "current-char" : "pending-char";
                              } else if (typedChar === char) {
                                className = "correct-char";
                              } else {
                                className = "incorrect-char";
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
                  </div>
                ) : (
                  <div className="game-start">
                    {playerA?.uid === user?.uid && (
                      <button
                        onClick={startGame}
                        className="btn btn-start"
                        disabled={isLoading || !playerB}
                      >
                        {isLoading
                          ? "Starting..."
                          : playerB
                          ? "Start Game"
                          : "Waiting for opponent..."}
                      </button>
                    )}
                    {playerB?.uid === user?.uid && (
                      <div className="waiting-message">
                        <div className="spinner"></div>
                        <p>Waiting for host to start the game...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {lobbyId && (
            <div className="chat-panel">
              <div className="chat-header">
                <h3>Game Chat</h3>
              </div>
              <div className="messages-container">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.senderId === user?.uid ? "sent" : "received"}`}
                  >
                    <div className="message-sender">{msg.senderEmail}</div>
                    <div className="message-content">{msg.text}</div>
                  </div>
                ))}
              </div>
              <form
                className="message-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="message-input"
                />
                <button type="submit" className="send-button">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiplayerPage;