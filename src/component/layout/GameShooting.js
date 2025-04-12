import React, { useState, useEffect } from 'react';
import './GameShooting.css';


const wordsList = [
    "galaxy", "orbit", "keyboard", "react", "alien", "space", "debug", "launch", "comet", "rocket",
    "code", "javascript", "planet", "starship", "binary", "meteor", "syntax", "deploy", "cluster",
    "function", "loop", "variable", "nebula", "compile", "pixel", "reactor", "api", "server", "logic",
    "array", "object", "cyber", "galactic", "syntax", "terminal", "python", "frontend", "backend",
    "fusion", "cosmic", "gravity", "void", "module", "export", "import", "virtual", "render", "element",
    "shoot", "target", "explode", "enemy", "laser", "spaceship", "power", "boost", "shield", "mission",
    "explorer", "thruster", "hover", "drift", "asteroid", "moon", "sun", "system", "velocity", "warp",
    "quasar", "nova", "hyperdrive", "interface", "glitch", "probe", "cluster", "signal", "upload", "download",
    "energy", "freeze", "burn", "shift", "ignite", "zoom", "clone", "crash", "refactor", "execute", "build",
    "reboot", "portal", "dimension", "interstellar", "transmit", "command", "console", "spacebar", "debugger",
    "timeline", "matrix", "avatar", "stream", "launchpad", "byte", "cache", "index", "firewall", "encrypt",
    "mission", "ship", "blast", "zebra", "cannon", "neon", "ghost", "phantom", "flare", "cyborg"
  ];
  

const GameShooting = () => {
  const [words, setWords] = useState([]);
  const [typedWord, setTypedWord] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const restartGame = () => {
    setWords([]);
    setScore(0);
    setTypedWord('');
    setGameOver(false);
  };
  

  const handleTyping = (e) => {
    if (gameOver) return; // stop if game is over
  
    const value = e.target.value;
    setTypedWord(value);
  
    const matchedWord = words.find((word) => word.text === value);
    if (matchedWord) {
      setWords(words.filter((word) => word.id !== matchedWord.id));
      setScore((prev) => prev + 1);
      setTypedWord('');
    }
  };

  useEffect(() => {
    setWords([]);
    setScore(0);
    setTypedWord('');
    setGameOver(false);
  }, []);
  
  
  // Generate a new word every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomWord = wordsList[Math.floor(Math.random() * wordsList.length)];
      setWords((prev) => [...prev, { text: randomWord, id: Date.now(),position: Math.random(), motion: Math.floor(Math.random() * 3),  }]);
    },3000);
    
    return () => clearInterval(interval);
  }, [words, gameOver]);

 
  return (
    <div className="shooting-game">
       
      <h1>🔥 Typing Shooter Game</h1>
      <h2>Score: {score}</h2>
      <div className="falling-words">
  {words.map((word) => (
    <div key={word.id} className={`alien-container  motion-${word.motion}`}
    style={{ "--rand": word.position,
        animationDuration: `${8 + Math.random() * 4}s`
    }}
    >
    
      <div className="alien-word">{word.text}</div>
      {/* <div className="alien-body">
  <img src="/images/alien1.png" alt="alien" style={{ width: '40px' }} />
</div> */}
      <div className="alien-body">👽</div> 
    </div>
    
  ))}
</div>
{gameOver && (
  <div className="game-over">
    <h2>💀 Game Over!</h2>
    <p>Your score: {score}</p>
    <button onClick={restartGame}>Restart</button>
  </div>
)}


      
      <input
        type="text"
        value={typedWord}
        onChange={handleTyping}
        placeholder="Type here..."
        autoFocus
      />
    </div>
  );
};

export default GameShooting;