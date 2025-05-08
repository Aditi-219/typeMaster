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
  deleteDoc,
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
  const largeSampleText = `
The quick brown fox jumps over the lazy dog. This sentence contains all the letters in the English alphabet. 
Programming is the process of creating a set of instructions that tell a computer how to perform a task. 
React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies.
TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
The best way to learn to code is by actually coding. Practice makes perfect when it comes to programming.
Algorithms are step-by-step procedures for calculations. Data structures are ways to organize and store data.
Clean code is code that is easy to understand and easy to change. Always write code as if the person who ends up maintaining it is a violent psychopath who knows where you live.
The only way to go fast is to go well. Quality is never an accident; it is always the result of intelligent effort.
JavaScript is the world's most popular programming language. It is the programming language of the Web.
Computer science is no more about computers than astronomy is about telescopes. It's about solving problems.
The most disastrous thing that you can ever learn is your first programming language. The second one always seems easier.
Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.
There are two ways of constructing a software design: One way is to make it so simple that there are obviously no deficiencies, and the other way is to make it so complicated that there are no obvious deficiencies.
Measuring programming progress by lines of code is like measuring aircraft building progress by weight.
The most important property of a program is whether it accomplishes the intention of its user.
Any fool can write code that a computer can understand. Good programmers write code that humans can understand.
First, solve the problem. Then, write the code. Programming isn't about what you know; it's about what you can figure out.
Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code.
The best thing about a boolean is even if you are wrong, you are only off by a bit.
If debugging is the process of removing software bugs, then programming must be the process of putting them in.
It's not a bug - it's an undocumented feature. The computer was born to solve problems that did not exist before.
Python is an interpreted, high-level, general-purpose programming language known for its readability and simplicity.
Object-oriented programming is a paradigm based on the concept of objects which can contain data and code.
Functional programming treats computation as the evaluation of mathematical functions and avoids changing state.
Version control systems like Git help developers track and manage changes to their code over time.
Continuous integration and continuous delivery are practices that enable teams to release code changes more frequently.
Test-driven development is a software development process that relies on repeating a very short development cycle.
Design patterns are typical solutions to commonly occurring problems in software design.
Microservices architecture structures an application as a collection of loosely coupled services.
Containerization allows applications to be packaged with their dependencies and run consistently across environments.
Cloud computing provides on-demand availability of computer system resources without direct active management.
Machine learning is the study of computer algorithms that improve automatically through experience.
Artificial intelligence is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans.
Big data refers to data sets that are too large or complex for traditional data-processing application software.
The Internet of Things describes the network of physical objects embedded with sensors and software.
Blockchain is a growing list of records, called blocks, that are linked using cryptography.
Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks.
DevOps is a set of practices that combines software development and IT operations.
Agile software development emphasizes iterative development, where requirements evolve through collaboration.
User experience design is the process of enhancing user satisfaction by improving usability and accessibility.
Responsive web design makes web pages render well on a variety of devices and window sizes.
Progressive web apps are web applications that load like regular web pages but offer additional functionality.
Single-page applications interact with the user by dynamically rewriting the current page.
REST is an architectural style for designing networked applications using simple, stateless operations.
GraphQL is a query language for APIs that gives clients the power to ask for exactly what they need.
NoSQL databases provide a mechanism for storage and retrieval of data that is modeled differently from relational databases.
SQL is a domain-specific language used in programming and designed for managing relational databases.
The waterfall model is a sequential design process used in software development.
Scrum is an agile framework for developing, delivering, and sustaining complex products.
Kanban is a visual system for managing work as it moves through a process.
Pair programming is an agile software development technique where two programmers work together at one workstation.
Code review is a software quality assurance activity where one or more people check a program.
Refactoring is the process of restructuring existing computer code without changing its external behavior.
Technical debt reflects the implied cost of additional rework caused by choosing an easy solution now instead of a better approach.
The Linux kernel is a free and open-source, monolithic, modular, multitasking Unix-like operating system kernel.
The Windows operating system is a group of several proprietary graphical operating system families.
macOS is a series of proprietary graphical operating systems developed by Apple.
Android is a mobile operating system based on a modified version of the Linux kernel.
iOS is a mobile operating system created and developed by Apple exclusively for its hardware.
Virtual reality is a simulated experience that can be similar to or completely different from the real world.
Augmented reality is an interactive experience of a real-world environment enhanced by computer-generated perceptual information.
Quantum computing is the use of quantum phenomena such as superposition and entanglement to perform computation.
The command line interface is a means of interacting with a computer program where the user issues commands.
The graphical user interface allows users to interact with electronic devices through graphical icons.
Natural language processing is a subfield of linguistics, computer science, and artificial intelligence.
Computer vision is an interdisciplinary field that deals with how computers can gain understanding from digital images.
Robotics is an interdisciplinary branch of engineering and science that includes mechanical engineering.
Bioinformatics is an interdisciplinary field that develops methods and software tools for understanding biological data.
Computational physics is the study and implementation of numerical analysis to solve problems in physics.
Computational chemistry is a branch of chemistry that uses computer simulation to assist in solving chemical problems.
Computational biology involves the development and application of data-analytical and theoretical methods.
Neural networks are a series of algorithms that attempt to recognize underlying relationships in data.
Deep learning is part of a broader family of machine learning methods based on artificial neural networks.
Computer graphics are pictures and films created using computers, often with specialized hardware and software.
Human-computer interaction researches the design and use of computer technology focused on interfaces.
Ubiquitous computing is a concept in software engineering where computing is made to appear everywhere.
Edge computing is a distributed computing paradigm that brings computation closer to data sources.
Fog computing extends cloud computing to the edge of an enterprise's network.
Serverless computing is a cloud computing execution model where the cloud provider runs the server.
Quantum supremacy is the potential ability of quantum computing devices to solve problems.
The singularity is a hypothetical future point when technological growth becomes uncontrollable.
Nanotechnology is manipulation of matter on an atomic, molecular, and supramolecular scale.
Biometrics is the technical term for body measurements and calculations related to human characteristics.
Cryptography is the practice and study of techniques for secure communication.
Digital forensics is a branch of forensic science encompassing recovery and investigation.
Information security protects information from unauthorized access to avoid identity theft.
Network security consists of policies and practices to prevent unauthorized access.
Application security focuses on keeping software and devices free of threats.
Operational security includes processes and decisions for handling and protecting data assets.
Disaster recovery involves a set of policies and procedures to recover from natural or human-induced disasters.
Business continuity is the process of creating systems of prevention and recovery.
Risk management is the identification, evaluation, and prioritization of risks.
Incident response is an organized approach to addressing and managing a security breach.
Ethical hacking involves an authorized attempt to gain unauthorized access.
Penetration testing is a simulated cyber attack against a computer system.
Vulnerability assessment is the process of identifying and quantifying vulnerabilities.
Security information and event management provides real-time analysis of security alerts.
Intrusion detection system monitors network or system activities for malicious activities.
Intrusion prevention system monitors network or system activities for malicious activity.
Firewall is a network security system that monitors incoming and outgoing network traffic.
Virtual private network extends a private network across a public network.
Two-factor authentication is a method of confirming users' identities using two different factors.
Multi-factor authentication is an authentication method requiring multiple verification methods.
Biometric authentication is a security process that relies on unique biological characteristics.
Public key infrastructure is a set of roles, policies, and procedures to manage digital certificates.
Digital signature is a mathematical scheme for verifying the authenticity of digital messages.
Blockchain technology is a decentralized, distributed ledger that records transactions.
Smart contracts are self-executing contracts with the terms directly written into code.
Cryptocurrency is a digital asset designed to work as a medium of exchange.
Bitcoin is a decentralized digital currency without a central bank or single administrator.
Ethereum is an open-source, blockchain-based platform featuring smart contract functionality.
Litecoin is a peer-to-peer cryptocurrency and open-source software project.
Ripple is a real-time gross settlement system, currency exchange and remittance network.
Initial coin offering is a type of funding using cryptocurrencies.
Security token offering is a type of public offering in which tokenized digital securities.
Decentralized finance aims to create an open-source, permissionless financial service ecosystem.
Stablecoin is a type of cryptocurrency designed to minimize price volatility.
Tokenization is the process of substituting a sensitive data element with a non-sensitive equivalent.
Distributed ledger is a consensus of replicated, shared, and synchronized digital data.
Consensus algorithm is a process used to achieve agreement on a single data value.
Proof of work is a form of cryptographic proof in which one party proves to others.
Proof of stake is a type of consensus algorithm by which a cryptocurrency blockchain network.
Delegated proof of stake is a variation of the proof of stake consensus mechanism.
Byzantine fault tolerance is a property of systems that can resist failures.
Sharding is a database partitioning technique used to improve performance.
Sidechain is a separate blockchain that is attached to its parent blockchain.
Atomic swap is a smart contract technology enabling exchange of one cryptocurrency for another.
Zero-knowledge proof is a method by which one party can prove to another party.
Homomorphic encryption is a form of encryption allowing computation on ciphertexts.
Quantum cryptography is the science of exploiting quantum mechanical properties.
Post-quantum cryptography refers to cryptographic algorithms thought to be secure.
Secure multi-party computation is a subfield of cryptography with the goal of creating methods.
Trusted execution environment is a secure area of a main processor guaranteeing code execution.
Hardware security module is a physical computing device that safeguards digital keys.
Root of trust is a source that can always be trusted within a cryptographic system.
Trusted platform module is a specialized chip on an endpoint device that stores RSA keys.
Secure enclave is a hardware-based isolated computing environment.
Confidential computing protects data in use by performing computation in a hardware-based environment.
Differential privacy is a system for publicly sharing information while withholding private data.
Federated learning is a machine learning technique that trains an algorithm.
Transfer learning is a research problem in machine learning focusing on applying knowledge.
Self-supervised learning is a paradigm for unsupervised learning using the data itself.
Reinforcement learning is an area of machine learning concerned with how agents ought to take actions.
Semi-supervised learning is a class of machine learning techniques using both labeled and unlabeled data.
Active learning is a special case of machine learning where the learning algorithm can query.
Meta-learning is a subfield of machine learning where automatic learning algorithms are applied.
Ensemble learning uses multiple learning algorithms to obtain better predictive performance.
Online learning is a method of machine learning where data becomes available in a sequential order.
Multi-task learning is an approach to inductive transfer that improves generalization.
Curriculum learning is a type of learning where tasks are presented in a meaningful order.
Explainable AI refers to methods and techniques making AI decisions understandable.
Fairness in machine learning is the study of how to prevent algorithms from discriminating.
AI safety is an interdisciplinary field concerned with the long-term impacts of artificial intelligence.
AI alignment is the problem of ensuring AI systems achieve their intended goals.
Artificial general intelligence is the hypothetical ability of an intelligent agent to understand.
Superintelligence is a hypothetical agent possessing intelligence surpassing that of humans.
Singularitarianism is a movement that believes a technological singularity will occur.
Transhumanism is a philosophical movement that advocates for the transformation of the human condition.
Posthumanism is a philosophical concept addressing the aftermath of the human condition.
Digital twin is a digital replica of a living or non-living physical entity.
Cyber-physical system is a mechanism controlled or monitored by computer-based algorithms.
Industrial Internet of Things refers to interconnected sensors and other devices networked together.
Industry 4.0 is the current trend of automation and data exchange in manufacturing technologies.
Smart factory is a highly digitized and connected production facility.
Digital transformation is the adoption of digital technology to transform services or businesses.
Business process reengineering is the analysis and redesign of workflows within an organization.
Enterprise architecture is a conceptual blueprint defining the structure and operation of an organization.
Service-oriented architecture is a style of software design where services are provided.
Microservices are a variant of service-oriented architecture structuring an application.
API gateway is an API management tool that sits between a client and a collection of backend services.
Event-driven architecture is a software architecture pattern promoting production and detection.
Command query responsibility segregation is a pattern that separates read and write operations.
Domain-driven design is an approach to software development for complex needs.
Test automation is the use of software to control the execution of tests.
Continuous testing is the process of executing automated tests as part of the software delivery pipeline.
Behavior-driven development is an agile software development process encouraging collaboration.
Acceptance test-driven development is a development methodology based on communication.
Exploratory testing is an approach to software testing that emphasizes personal freedom.
Load testing is the process of putting demand on a system and measuring its response.
Stress testing determines the robustness of software by testing
`;
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
  const getRandomTextSegment = () => {
    // Split the large text into sentences
    const sentences = largeSampleText.split('. ').filter(s => s.trim().length > 0);
    
    // Determine how many sentences to include (between 3-6)
    const sentenceCount = Math.floor(Math.random() * 4) + 3;
    
    // Select random sentences
    let selectedSentences = [];
    for (let i = 0; i < sentenceCount; i++) {
      const randomIndex = Math.floor(Math.random() * sentences.length);
      selectedSentences.push(sentences[randomIndex] + (i < sentenceCount - 1 ? '. ' : '.'));
    }
    
    return selectedSentences.join('');
  };
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
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const container =
  //       playerA?.uid === user?.uid
  //         ? typingContainerARef.current
  //         : typingContainerBRef.current;
  //     if (container && document.activeElement !== container) {
  //       container.focus();
  //     }
  //   }, 50);

  //   return () => clearInterval(interval);
  // }, [playerA, playerB, user]);
  useEffect(() => {
    if (gameStarted) {
      // Use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        const container = 
          playerA?.uid === user?.uid 
            ? typingContainerARef.current 
            : typingContainerBRef.current;
        
        if (container) {
          container.focus();
          // Ensure the container is scrollable and visible
          container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }
  }, [gameStarted, playerA, playerB, user]);

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
      text: getRandomTextSegment(),
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
        text: getRandomTextSegment(),
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
    if (gameStarted) {
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
      const chatData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .reverse();
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
                      <div
                        className={`player-badge ${
                          playerA?.uid === user?.uid ? "you" : ""
                        }`}
                      >
                        <span className="player-name">{playerA?.email}</span>
                        {playerA?.uid === user?.uid && (
                          <span className="you-indicator">YOU</span>
                        )}
                      </div>
                      {playerB && (
                        <div
                          className={`player-badge ${
                            playerB?.uid === user?.uid ? "you" : ""
                          }`}
                        >
                          <span className="player-name">{playerB?.email}</span>
                          {playerB?.uid === user?.uid && (
                            <span className="you-indicator">YOU</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {!gameStarted && (
                    <div className="lobby-state">
                      {playerB ? (
                        <div className="status-tag full">Ready</div>
                      ) : (
                        <div className="status-tag waiting">
                          Waiting for opponent
                        </div>
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
                          <span className="stat-value">
                            {playerA?.wpm || 0}
                          </span>
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
                            <span className="stat-value">
                              {playerB?.wpm || 0}
                            </span>
                          </div>
                          <div className="stat">
                            <span className="stat-label">Accuracy:</span>
                            <span className="stat-value">
                              {calculateAccuracy(
                                playerB?.typedText || "",
                                text
                              )}
                              %
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
                        {(playerA?.uid === user?.uid ||
                          playerB?.uid === user?.uid) && (
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
                        <span className="time-left">{timeLeft}</span> seconds
                        remaining
                      </div>
                      <div className="wpm-display">
                        Your WPM:{" "}
                        {playerA?.uid === user?.uid
                          ? playerA?.wpm || 0
                          : playerB?.wpm || 0}
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
                                className =
                                  index === typedTextA.length
                                    ? "current-char"
                                    : "pending-char";
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
                                className =
                                  index === typedTextB.length
                                    ? "current-char"
                                    : "pending-char";
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
                    className={`message ${
                      msg.senderId === user?.uid ? "sent" : "received"
                    }`}
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
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 2L11 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 2L15 22L11 13L2 9L22 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
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
