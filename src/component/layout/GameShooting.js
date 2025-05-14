import React, { useState, useEffect,useRef } from 'react';
import './GameShooting.css';

// Word list remains the same
const wordsList = [
  "vex", "zap", "flux", "nano", "quant", "ion", "pix", "glow", "hack", "wire", "chip", "node", "grid", "loop", "pulse", "wave", "link", "meld", "sync", "glitch",
  "moon", "star", "sun", "earth", "mars", "venus", "jupiter", "saturn", "uranus", "neptune", "pluto", "ceres", "comet", "meteor", "asteroid", "nebula", "galaxy", 
  "quasar", "pulsar", "blackhole", "wormhole", "supernova", "cosmos", "void", "flare", "halo", "crater", "ring", "belt", "cloud", "rocket", "probe", "rover",
  "satellite", "lander", "module", "capsule", "thruster", "booster", "payload", "launch", "orbit", "reentry", "spacewalk", "dock", "mission", "voyager", "lander",
  "ion", "warp", "jump", "gate", "shield", "sensor", "antenna", "beacon", "transit", "thrust", "vector", "delta-v", "alien", "ufo", "et", "grays", "nordic",
  "reptoid", "hybrid", "abduct", "probe", "mothership", "saucer", "crash", "coverup", "artifact", "ancient", "visitor", "invader", "colonist", "observer", "entity",
  "specimen", "autopsy", "signal", "contact", "message", "warning", "harvest", "hybrid", "cloak", "scan", "phaser", "stun", "beam", "teleport", "tractor", "shield",
  "cloak", "hologram", "android", "cyborg", "AI", "drone", "nanobot", "stasis", "cryo", "FTL", "warp", "jump", "gate", "dimension", "tesseract", "singularity",
  "quantum", "plasma", "ion", "flux", "darkmatter", "antimatter", "gravity", "tachyon", "zero-g", "vacuum", "cosmic", "stellar", "lunar", "solar", "phase", "axis",
  "core", "dust", "gas", "ion", "flux", "field", "pulse", "burst", "flare", "wave", "rift", "anomaly", "extraterrestrial", "interstellar", "astronaut", "cosmonaut",
  "constellation", "spaceshuttle", "lightspeed", "parsec", "telepathy", "exoplanet", "wormhole", "eventhorizon", "singularity", "hypersleep", "cryostasis","zog",
  "vril", "xyr", "nyx", "qis", "mork", "vox", "zenn", "kyx", "jynx", "zyl", "wryn", "quor", "drax", "vork", "plix", "zurk", "glim", "snor", "flur"
];

const alienTypes = ['👽', '👾', '🤖', '☄️', '👹', '👺','😈','🌑','🛰️','🪐','⭐','🌙',' 🌕 '];

// Modern color scheme
const colors = {
  darkSpace: '#0b0a1a',
  deepSpace: '#1a1a2e',
  spaceBlue: '#16213e',
  electricBlue: '#00dbde',
  neonPink: '#fc00ff',
  plasmaYellow: '#f9f871',
  textLight: '#e6f1ff'
};

const GameShooting = () => {
  const [currentWords, setCurrentWords] = useState([]);
  const [typedWord, setTypedWord] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0);
  const inputRef = useRef(null);

  const fireLaser = (targetPosition, targetProgress) => {
    const gameArena = document.querySelector('.game-arena');
    
    // Calculate the angle from spaceship to target
    const spaceshipLeft = 50; // Spaceship is centered
    const targetLeft = targetPosition;
    const angle = Math.atan2(
      (targetProgress * 100) - 100, // Y difference (from bottom to target)
      targetLeft - spaceshipLeft    // X difference
    ) * (180 / Math.PI);
    
    // Create laser beam
    const laser = document.createElement('div');
    laser.className = 'laser-beam';
    laser.style.left = `${spaceshipLeft}%`;
    laser.style.bottom = '30px'; // Align with spaceship
    laser.style.transform = `rotate(${angle}deg)`;
    
    // Create laser hit effect at target position
    const laserHit = document.createElement('div');
    laserHit.className = 'laser-hit';
    laserHit.style.left = `${targetPosition}%`;
    laserHit.style.top = `${targetProgress * 100}%`;
    
    gameArena.appendChild(laser);
    gameArena.appendChild(laserHit);
    
    // Remove elements after animation
    setTimeout(() => {
      laser.remove();
      laserHit.remove();
    }, 500);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement.tagName;
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA';
  
      if (
        ['Space', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.code) &&
        !isTyping
      ) {
        e.preventDefault();
      }
    };
  
    // Attach listener to document, not window
    document.addEventListener('keydown', handleKeyDown, { passive: false });
  
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  

  // Game parameters with smooth progression
  const getMaxWords = () => {
    if (level < 4) return 1;
    if (level < 7) return 2;
    if (level < 10) return 3;
    return 4;
  };

  // 🔊 Resume audio when user first clicks anywhere
useEffect(() => {
  const resumeAudio = () => {
    const audio = document.getElementById('bg-audio');
    if (audio && audio.paused) {
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
    window.removeEventListener('click', resumeAudio);
  };
  window.addEventListener('click', resumeAudio);
  return () => window.removeEventListener('click', resumeAudio);
}, []);

useEffect(() => {
  const bgAudio = document.getElementById('bg-audio');
  if (!bgAudio) return;

  if (gameOver) {
    bgAudio.pause();
  } else {
    bgAudio.volume = 0.3;
    bgAudio.play().catch(err => {
      console.warn("Background music autoplay was blocked by the browser.");
    });
  }
}, [gameOver]);


  const gameParams = {
    baseSpeed: 0.0015,
    speedIncrease: 0.0001,
    maxWords: getMaxWords(),
    emojiSize: 1.5 + (level * 0.1),
    spawnArea: {
      minLeft: 15,
      maxLeft: 85
    },
    spawnDelay: Math.max(1200, 2000 - (level * 20))
  };

  const getFilteredWords = () => {
    const maxLength = 4 + Math.floor(level / 3);
    return wordsList.filter(word => word.length <= Math.min(maxLength, 7));
  };

  const filteredWords = getFilteredWords();

  const restartGame = () => {
    setCurrentWords([]);
    setScore(0);
    setTypedWord('');
    setGameOver(false);
    setLives(3);
    setLevel(1);
    setLevelProgress(0);
    spawnNewWord();
  };

  const getRandomPosition = () => {
    return gameParams.spawnArea.minLeft + 
           Math.random() * (gameParams.spawnArea.maxLeft - gameParams.spawnArea.minLeft);
  };

  const spawnNewWord = () => {
    if (currentWords.length >= gameParams.maxWords || gameOver) return;

    const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    const randomAlien = alienTypes[Math.floor(Math.random() * alienTypes.length)];
    
    const newWord = {
      id: Date.now() + Math.random(),
      text: randomWord,
      position: getRandomPosition(),
      alien: randomAlien,
      progress: 0,
      glowColor: `hsl(${Math.random() * 60 + 180}, 80%, 60%)`, // Cool colors only
      rotation: Math.random() * 15 - 7.5
    };

    setCurrentWords(prev => [...prev, newWord]);
  };

  const showExplosion = (word) => {
    const explosionContainer = document.createElement('div');
    explosionContainer.className = 'explosion-container';
    explosionContainer.style.left = `${word.position}%`;
    explosionContainer.style.top = `${word.progress * 100}%`;
    new Audio('/Laser_sound.mp3').play();
    
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'explosion-particle';
      particle.style.setProperty('--tx', Math.random() * 2 - 1);
      particle.style.setProperty('--ty', Math.random() * 2 - 1);
      particle.textContent = ['✦', '✧', '❂', '✺'][Math.floor(Math.random() * 4)];
      particle.style.color = [colors.electricBlue, colors.neonPink, colors.plasmaYellow][Math.floor(Math.random() * 3)];
      explosionContainer.appendChild(particle);
    }
    
    document.querySelector('.game-arena').appendChild(explosionContainer);
    setTimeout(() => explosionContainer.remove(), 1000);
  };

  const handleTyping = (e) => {
    if (gameOver) return;
    
    const value = e.target.value.toLowerCase();
    setTypedWord(value);

    const matchedWord = currentWords.find(word => word.text === value);
    if (matchedWord) {
      fireLaser(matchedWord.position, matchedWord.progress);
      const points = 10 * level;
      setScore(prev => prev + points);
      setTypedWord('');
      
      setCurrentWords(prev => {
        const newWords = prev.filter(word => word.id !== matchedWord.id);
        if (newWords.length < gameParams.maxWords) {
          setTimeout(spawnNewWord, 300);
        }
        return newWords;
      });

      showExplosion(matchedWord);
      
      setLevelProgress(prev => {
        const newProgress = prev + (points / (level * 100));
        if (newProgress >= 1) {
          setLevel(prev => prev + 1);
          showLevelUp();
          return 0;
        }
        return newProgress;
      });
    }
  };

  const showLevelUp = () => {
    const notification = document.createElement('div');
    notification.className = 'level-up';
    notification.textContent = `LEVEL ${level + 1}!`;
    notification.style.color = colors.electricBlue;
    document.querySelector('.game-header').appendChild(notification);
    new Audio('/Levelup_sound.mp3').play();
    setTimeout(() => notification.remove(), 2000);
  };

  // Word spawning
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      if (currentWords.length < gameParams.maxWords) {
        spawnNewWord();
      }
    }, gameParams.spawnDelay);
    return () => clearInterval(interval);
  }, [currentWords.length, gameOver, gameParams.maxWords, gameParams.spawnDelay]);

  // Word movement
  useEffect(() => {

    if (gameOver || currentWords.length === 0) return;
    
    const speed = gameParams.baseSpeed + (level * gameParams.speedIncrease);
    const interval = setInterval(() => {
      setCurrentWords(prev => {
        const updatedWords = prev.map(word => ({
          ...word,
          progress: word.progress + speed
        })).filter(word => {
          if (word.progress >= 1) {
          
            setLives(prev => {
              const newLives = prev - 1;
             if (newLives <= 0) {
                new Audio('/Gameover_sound.mp3').play();
                setGameOver(true);
             }else  {new Audio('/lifelose_sound.mp3').play();}
             

              return newLives;
            });
            return false;
          }
          return true;
        });
        return updatedWords;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [gameOver, level, currentWords.length]);


  // Initial word
  useEffect(() => {
    spawnNewWord();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();  // Focus the input field when the component loads
    }
  }, []);


  return (
    <div className="game-container" /*style={{ background: colors.darkSpace }}*/>
      {/* Space video background */}
      <video
      className="space-video-bg"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    >
      <source src="/Space_bg.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
      {/* Nebula background effect */}
      {/* <div className="nebula-bg">
        <div className="nebula-layer-1"></div>
        <div className="nebula-layer-2"></div>
      </div> */}

    <audio
      id="bg-audio"src="/Spacebg_sound.mp3" autoPlay loop preload="auto" />

      {/* Game header */}
      <div className="game-header">
        <h1 className="game-title">
          <span style={{ 
            background: `linear-gradient(135deg, ${colors.electricBlue}, ${colors.neonPink})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            COSMIC TYPER
          </span>
        </h1>
        
        <div className="game-stats">
          <div className="stat">
            <span>SCORE</span>
            <span style={{ color: colors.plasmaYellow }}>{score}</span>
          </div>
          
          <div className="stat">
            <span>LEVEL</span>
            <div className="level-meter">
              <div className="level-number">{level}</div>
              <div className="level-bar">
                <div 
                  className="level-fill" 
                  style={{ 
                    width: `${levelProgress * 100}%`,
                    background: `linear-gradient(to right, ${colors.electricBlue}, ${colors.neonPink})`
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="stat">
            <span>LIVES</span>
            <span style={{ color: '#ff5e5e' }}>{"♥".repeat(lives)}</span>
          </div>
        </div>
      </div>

      {/* Game arena */}
      <div className="game-arena">
        {/* Sleek spaceship */}
        <div className="spaceship">
          <div className="ship-core">🛸</div>
          <div className="engine-exhaust"></div>
        </div>

        {/* Aliens */}
        {currentWords.map(word => (
          <div 
            key={word.id}
            className="alien"
            style={{ 
              left: `${word.position}%`,
              top: `${word.progress * 100}%`,
              fontSize: `${gameParams.emojiSize}rem`,
              color: word.glowColor,
              transform: `rotate(${word.rotation}deg)`
            }}
          >
            <div className="alien-label">{word.text}</div>
            <div className="alien-char">{word.alien}</div>
            <div 
              className="alien-aura" 
              style={{ 
                boxShadow: `0 0 20px ${word.glowColor}`,
                background: word.glowColor
              }}
            />
          </div>
        ))}
      </div>

      {/* Input field */}
      <div className="input-container">
        <input
          ref={inputRef}
          type="text"
          value={typedWord}
          onChange={handleTyping}
          placeholder="TYPE THE WORD..."
          style={{
            border: `2px solid ${colors.electricBlue}`,
            boxShadow: `0 0 15px ${colors.electricBlue}`
          }}
        />
      </div>

      {/* Game over screen */}
      {gameOver && (
        <div className="game-over">
          <div className="game-over-content">
            <h2 style={{ color: colors.electricBlue }}>GAME OVER</h2>
            <div className="final-stats">
              <p>FINAL SCORE: <span>{score}</span></p>
              <p>LEVEL REACHED: <span>{level}</span></p>
            </div>
            <button 
              className="restart-btn"
              onClick={restartGame}
              style={{
                background: `linear-gradient(135deg, ${colors.electricBlue}, ${colors.neonPink})`
              }}
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameShooting;