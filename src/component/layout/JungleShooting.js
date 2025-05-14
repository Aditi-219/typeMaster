import React, { useState, useEffect,useRef } from 'react';
import './JungleShooting.css';

const wordsList =[
  "tree", "vine", "leaf", "jungle", "rainforest", "canopy", "parrot", "monkey", 
  "tiger", "elephant", "snake", "gorilla", "camouflage", "palm", "forest", 
  "shrub", "flower", "bamboo", "waterfall", "safari", "wild", "tropical", 
  "coconut", "mango", "banana", "chimpanzee", "panda", "zebra", "leopard", 
  "antelope", "cheetah", "lion", "rhino", "bird", "butterfly", "spider", 
  "insect", "toucan", "jaguar", "liana", "underbrush", "mosquito", "beetle", 
  "tarantula", "frog", "reptile", "crocodile", "lizard", "bush", "fern", 
  "moss", "humidity", "rain", "thunder", "lightning", "fog", "swamp", 
  "creek", "river", "mud", "roots", "climber", "orchid", "wildlife", 
  "predator", "herbivore", "nocturnal", "terrain", "expedition", "tribe", 
  "bat", "sloth", "panther", "bison", "armadillo", "anteater", "tapir", 
  "deer", "waterfall", "rainstorm", "treetop", "jungle gym", "bushfire", 
  "jungle cat", "nightshade", "cypress", "cedar", "safari", "monsoon", 
  "leafhopper", "chameleon", "termites", "skunk", "tortoise", "ants", "woodpecker", 
  "basil", "sunlight", "fungus", "mangrove", "hyacinth", "sunshine", "bat cave", 
  "tropical fruit", "blue morpho", "black panther", "leech", "jungle trail", 
  "wild boar", "climbing ivy", "bananas", "poison ivy", "mudslide", "saguaro", 
  "dewdrops", "tropical fish", "camouflage", "safari tour", "wild orangutan", 
  "fossa", "solitary", "amphibian", "shaman", "ancient trees", "jungle tribe", 
  "pitcher plant", "algae", "sugarcane", "wilderness", "wildflower", "baboons", 
  "ivory", "jungle drums", "wild hunts", "pitcher vines", "cayman", "wildberries", 
  "stone path", "forest floor", "saber-tooth tiger", "gecko", "fruit bat", "elephant grass", 
  "wild boar", "snakeskin", "ivy-covered", "jungle mist", "rainforest canopy", "sunset jungle", 
  "vultures", "gecko", "forest canopy", "wild stream", "tropical storm", "fishing nets", 
  "frostbite", "jungle fever", "bamboo grove", "rainy season", "tropical birds", "rainforest leaves", 
  "hummingbird", "swarm", "leafy vines", "gibbon", "armadillo", "rainforest hike", "woodland", 
  "jungle path", "thick undergrowth", "swooping owl", "beehive", "giraffe", "poison dart frog", 
  "jackfruit", "hardwood", "cocoa", "coffee", "cocoa pods", "leaf cutter", "water lilies", 
  "flamingo", "cliffside", "palm fronds", "baobab tree", "monsoon rain", "water hole", "forest fire", 
  "camouflage clothing", "jungle survival", "forest retreat", "sundew", "black mamba", "tarzan", 
  "shamanic", "jungle trek", "sacred grove", "night in the jungle", "birdsong", "nature sounds"
];


const jungleAnimals = [
  '🌴', '🌲', '🌳', '🌿', '🍃', '🍂', '🪵', '🌱', '🍄', // Jungle Nature & Plants
  '🐒', '🐵', '🐍', '🐅', '🐆', '🦧', '🐘', '🦓', '🦜', '🐊', '🦎', '🦋', '🕷️', // Jungle Animals
   '🌧️', '⚡', '🦁', '💧', '🔥', '🪨', '🕸️' // Jungle Weather & Environment
];

// Updated jungle theme colors
const colors = {
  jungleDark: '#2f4f2f',
  mossGreen: '#6b8e23',
  fernLight: '#c8e1a1',
  earthBrown: '#8b4513',
  jungleSun: '#f4a261',
  textLight: '#e6f1ff',
  dangerRed: '#ff6347'
};

const JungleShooting = () => {
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
    const spaceshipLeft = 50;
    const targetLeft = targetPosition;
    const angle = Math.atan2((targetProgress * 100) - 100, targetLeft - spaceshipLeft) * (180 / Math.PI);

    const laser = document.createElement('div');
    laser.className = 'laser-beam';
    laser.style.left = `${spaceshipLeft}%`;
    laser.style.bottom = '30px';
    laser.style.transform = `rotate(${angle}deg)`;

    const laserHit = document.createElement('div');
    laserHit.className = 'laser-hit';
    laserHit.style.left = `${targetPosition}%`;
    laserHit.style.top = `${targetProgress * 100}%`;

    gameArena.appendChild(laser);
    gameArena.appendChild(laserHit);

    setTimeout(() => {
      laser.remove();
      laserHit.remove();
    }, 500);
  };

  const getMaxWords = () => {
    if (level < 4) return 1;
    if (level < 7) return 2;
    if (level < 10) return 3;
    return 4;
  };

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
    const randomAlien = jungleAnimals[Math.floor(Math.random() * jungleAnimals.length)];
    
    const newWord = {
      id: Date.now() + Math.random(),
      text: randomWord,
      position: getRandomPosition(),
      alien: randomAlien,
      progress: 0,
      glowColor: colors.fernLight,
      rotation: Math.random() * 15 - 7.5
    };

    setCurrentWords(prev => [...prev, newWord]);
  };

  const showExplosion = (word) => {
    const explosionContainer = document.createElement('div');
    explosionContainer.className = 'explosion-container';
    explosionContainer.style.left = `${word.position}%`;
    explosionContainer.style.top = `${word.progress * 100}%`;
    new Audio('/shot_sound.mp3').play();

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'explosion-particle';
      particle.style.setProperty('--tx', Math.random() * 2 - 1);
      particle.style.setProperty('--ty', Math.random() * 2 - 1);
      particle.textContent = ['✦', '✧', '❂', '✺'][Math.floor(Math.random() * 4)];
      particle.style.color = colors.fernLight;
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
    notification.style.color = colors.jungleSun;
    document.querySelector('.jungle-header').appendChild(notification);
    new Audio('/Levelup_sound.mp3').play();
    setTimeout(() => notification.remove(), 2000);
  };

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      if (currentWords.length < gameParams.maxWords) {
        spawnNewWord();
      }
    }, gameParams.spawnDelay);
    return () => clearInterval(interval);
  }, [currentWords.length, gameOver, gameParams.maxWords, gameParams.spawnDelay]);

  useEffect(() => {
    if (gameOver || currentWords.length === 0) return;
    const speed = gameParams.baseSpeed + (level * gameParams.speedIncrease);
    const interval = setInterval(() => {
      setCurrentWords(prev => {
        const updated = prev.map(word => ({ ...word, progress: word.progress + speed }))
          .filter(word => {
            if (word.progress >= 1) {
              setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                  new Audio('/Gameover_sound.mp3').play();
                  setGameOver(true);
                } else {
                  new Audio('/lifelose_sound.mp3').play();
                }
                return newLives;
              });
              return false;
            }
            return true;
          });
        return updated;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [gameOver, level, currentWords.length]);

  useEffect(() => {
    spawnNewWord();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();  // Focus the input field when the component loads
    }
  }, []);

  return (
    <div className="jungle-game-root">
      {/* Game Container */}
      <div className="jungle-game-container">
        
        {/* Background Video (No blur) */}
         <video className="jungle-video-bg" autoPlay muted loop playsInline>
          <source src="/Jungle_bg.mp4" type="video/mp4" />
        </video> 

      {/* <img className="jungle-video-bg" src="/Jungleimage_bg.png" alt="Jungle Background" />*/}

  
        {/* Background Audio */}
        <audio id="bg-audio" src="/Junglebg_sound.mp3" autoPlay loop preload="auto" />
  
        {/* Game UI */}
        <div className="jungle-header">
          <h1 className="jungle-title">JUNGLE TYPER</h1>
          <div className="jungle-stats">
            <div className="stat">
              <span>SCORE</span>
              <span>{score}</span>
            </div>
            <div className="stat">
              <span>LEVEL</span>
              {/* <div className="level-bar">
                <div className="level-fill" style={{ width: `${levelProgress * 100}%` }}></div>
              </div> */}
              <div className="level-meter">
              <div className="level-number">{level}</div>
              <div className="level-bar">
                <div 
                  className="level-fill" 
                  style={{ 
                    width: `${levelProgress * 100}%`
                 // background: `linear-gradient(to right, ${colors.electricBlue}, ${colors.neonPink})`  
                  }}></div>
                
              </div>
            </div>
            </div>
            <div className="stat">
              <span>LIVES</span>
              <span style={{ color: colors.dangerRed }}>{"♥".repeat(lives)}</span>
            </div>
          </div>
        </div>
  
        <div className="game-arena">
          <div className="spaceship">
            <div className="ship-core">🧔🏽</div>
            <div className="engine-exhaust"></div>
          </div>
          {currentWords.map(word => (
            <div
              key={word.id}
              className="alien"
              style={{
                left: `${word.position}%`,
                top: `${word.progress * 100}%`,
                color: word.glowColor
              }}
            >
              <div className="alien-label">{word.text}</div>
              <div className="alien-char">{word.alien}</div>
              <div className="alien-aura" style={{ background: word.glowColor }} />
            </div>
          ))}
        </div>
  
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            value={typedWord}
            onChange={handleTyping}
            placeholder="TYPE THE WORD..."
          />
        </div>
  
        {gameOver && (
          <div className="game-over">
            <div className="game-over-content">
              <h2>GAME OVER</h2>
              <p>FINAL SCORE: {score}</p>
              <p>LEVEL REACHED: {level}</p>
              <button className="restart-btn" onClick={restartGame}>
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  
  
};

export default JungleShooting;
