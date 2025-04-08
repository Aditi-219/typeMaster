import React, { useState, useEffect, useRef } from "react";
import "./Typing.css";
import { Chart } from 'chart.js/auto';

const TypingArea = () => {
  // Array of predefined paragraphs
  const wordsList = [
    "The sun sets slowly behind the mountains casting long shadows that stretch across the valley as the day begins to give way to night the colors in the sky shift from bright blue to warm oranges and reds the breeze begins to cool as it moves gently through the trees rustling their leaves the sounds of birds singing fade into the background and a sense of calm takes over the land it feels like time has slowed and for a brief moment everything in the world is at peace the air is fresh and crisp and the stars begin to make their appearance one by one in the darkening sky",
    "Walking through the park early in the morning the ground is still damp with the dew that settles overnight the air is cool and carries the fresh scent of grass and earth the mist lingers low to the ground and weaves its way around the trees creating an ethereal atmosphere the path ahead is peaceful and inviting with flowers scattered along the edges their bright colors a contrast against the green of the grass and the quiet hum of nature all around it is a moment of solitude and tranquility that gives space to clear thoughts and peaceful reflection",
    "he city is alive with energy as people hustle and bustle along the busy streets the sidewalks are crowded with individuals all heading in different directions their faces filled with purpose and determination the sounds of honking cars and bus engines filling the air as traffic flows through the heart of the city at every corner there’s something new to see something new to experience from the street vendors selling fresh fruit to the brightly lit stores calling for attention each moment is filled with the rhythm of life that never seems to stop the city seems to breathe and move with its people always alive always changing",
    "Inside the house the evening settles in and there is a quiet stillness that surrounds everything the lights are soft and warm casting a gentle glow over the rooms the kitchen is a mix of warmth and comfort with the smell of last night’s meal lingering in the air dishes scattered across the counter and the hum of the refrigerator providing the only sound in the room it is a moment of calm between the rush of the day and the quiet of the night as the world outside continues on its way this place feels like an anchor in a busy world providing rest and solace to anyone who steps inside",
    "The ocean is endless as it stretches far beyond the horizon the waves crash rhythmically against the shore their constant movement a reminder of the power of nature the air smells of salt and seaweed and carries the fresh coolness of the water the moon hangs low in the sky casting a silvery glow on the ocean’s surface the sound of the waves is soothing almost hypnotic as they roll in and retreat leaving the sand smooth and untouched the vastness of the ocean is both humbling and peaceful as you stand on the shore looking out at the endless expanse of water it feels like standing on the edge of the world",
    "Walking through the forest feels like stepping into another world the towering trees rise high above casting shadows that stretch across the forest floor their leaves rustle gently in the wind creating a peaceful melody that blends with the chirps of hidden birds and the occasional rustle of small creatures moving through the underbrush the air smells rich with the scent of earth and moss and the ground beneath your feet is soft from years of fallen leaves and branches the forest feels ancient filled with life and stories untold waiting for someone to listen",
    "The market is full of life and color every stall is overflowing with fresh produce flowers and spices the air is thick with the smells of freshly baked bread sizzling street food and sweet fruit the vendors shout to draw attention to their goods while the buyers move quickly through the crowd haggling over prices and inspecting the wares the energy is palpable and the variety of sounds is endless from the chatter of the people to the rustling of paper bags and the clinking of coins it is a place where everything comes together the sights the smells the sounds all combine to create a lively atmosphere that makes the market feel like the heart of the town",
    "In the classroom the air is filled with the quiet buzz of students discussing their lessons the chalkboard is covered in scribbled notes equations and diagrams as the teacher stands at the front guiding everyone through the material some students are absorbed in their work furiously taking notes while others sit back and reflect quietly on what has been taught the classroom feels like a place of discovery where ideas and knowledge are shared and discussed freely the students listen intently their minds absorbing new information as they ask questions challenge ideas and build a deeper understanding of the world around them",
  ];
  const punctuationList = [
    "As the rain poured down, the streets began to fill with puddles, reflecting the lights from nearby buildings. People hurried along the sidewalks, umbrellas held high to shield themselves from the downpour. The sound of raindrops tapping against windows created a soothing rhythm, while the occasional car drove by, splashing water onto the curbs. The air smelled fresh, with a slight earthy undertone that only a rainstorm can bring. For a brief moment, the world seemed to slow down, wrapped in the calm that only rain can create. The rhythm of the rain on the rooftops and the distant rumble of thunder added to the atmosphere, making the whole world feel like it was holding its breath, waiting for the storm to pass, and in the stillness that followed, there was a quiet sense of peace that filled the air. The sky was a canvas of shifting grays, with only the occasional glimmer of sunlight peeking through the clouds, hinting at the calm that would come after the storm.",
    "The garden was alive with color, from the bright yellow daffodils to the deep red roses. Bees buzzed from flower to flower, gathering nectar, while butterflies fluttered gracefully through the air. The sun was high in the sky, casting warm light across the vibrant blooms. The scent of jasmine filled the air, mingling with the fresh grass and earth. It was a perfect day to sit and enjoy the simple beauty of nature, watching as each petal danced in the gentle breeze. The fragrance of flowers blended with the earthy aroma of the garden, creating a natural perfume that enveloped the senses. Birds chirped in the distance, adding a melody to the scene, while the breeze whispered through the trees, making the leaves rustle as if sharing secrets with the wind. Everything about the garden felt timeless, a serene escape from the bustle of everyday life, where one could lose track of time in the gentle embrace of nature’s beauty.",
    "The kitchen was busy with the clatter of pots and pans as dinner was being prepared. The smell of garlic and onions sizzling in olive oil filled the room, making everyone’s mouth water. The stove hummed softly, and the oven door opened with a gentle whoosh as the heat escaped. Laughter echoed in the background as family members moved around the room, preparing different parts of the meal. It was a comforting chaos, a reminder of the joy that comes with sharing a meal together. The aroma of spices and roasting vegetables filled the air, signaling that dinner was near. The soft clink of cutlery and the rhythmic chopping of vegetables were accompanied by the hum of conversation, as everyone worked together to create something delicious. As the table was set, the room filled with anticipation, and the warmth of the kitchen seemed to invite everyone to linger, savoring not only the food but the sense of togetherness that came with it.",
    "The city park was peaceful at dawn, with only a few joggers and dog walkers scattered along the paths. The air was cool and crisp, and the first light of day painted the sky in soft pinks and purples. Birds perched in the trees, singing their morning songs, while the grass underfoot was still wet with dew. The park was a quiet retreat from the busyness of the city, a place where time seemed to stand still for a few moments. It was the perfect place for reflection or simply taking in the beauty of a new day. The stillness of the morning was broken only by the sound of footsteps crunching on the gravel path and the occasional rustle of leaves in the trees. The world felt fresh and untouched, as if the park had been waiting for the sun to rise before it came to life, and in that peaceful solitude, everything felt right. The distant hum of the city seemed far away, replaced by the gentle whisper of the wind and the soft chirping of the birds, creating a serene harmony that made the early morning walk feel like a gentle meditation.",
    "The library was a haven of silence, with rows upon rows of books neatly arranged on shelves. The smell of paper and ink was faint but comforting, a sign of the knowledge contained within. People sat at tables, immersed in their reading, while others flipped through pages, looking for the next great story. The soft sound of turning pages filled the room, blending with the occasional cough or sneeze. It was a place where one could escape into another world, leaving the hustle and bustle of everyday life behind. The walls seemed to absorb the sounds, creating an almost reverent atmosphere where every whispered word seemed out of place. The soft glow of desk lamps illuminated the pages of books, and the quiet rustle of pages was the only sound that broke the stillness. It was a sanctuary of thought, a place where time seemed to slow down, allowing for a deep dive into the world of imagination, knowledge, or reflection. Each book on the shelf was a doorway to a different world, and in the quiet corners of the library, one could lose themselves in stories waiting to be discovered.",
    "The snow fell gently, covering the ground in a soft white blanket. Trees were adorned with delicate icicles, sparkling in the weak winter sunlight. The air was cold, but not harsh, and the world seemed quieter under the weight of the snow. Footprints appeared in the fresh powder as people walked by, leaving temporary marks on the otherwise untouched landscape. Children could be heard laughing in the distance, building snowmen and having snowball fights, their joy infectious as it echoed through the stillness of the winter day. The soft crunch of snow underfoot was the only sound that filled the otherwise hushed air. The world seemed to pause for a moment, wrapped in a serene quiet, as if the snow had cast a peaceful spell over everything. The trees, now heavy with snow, bent slightly under the weight, their branches adorned in glistening white. The crisp air was refreshing, and the cold did little to deter the spirit of the day, as laughter and shouts of joy rang through the frosty air, filling the scene with life and energy.",
    "The museum was filled with people admiring the art, each piece telling a unique story. Sculptures stood tall, casting shadows on the polished floors, while paintings covered the walls, each brushstroke a testament to the artist’s vision. The air was heavy with the scent of old wood and the faint smell of paint. Some visitors stood in awe before the works, while others discussed their interpretations with friends. It was a place where time seemed to slow down, allowing for reflection and appreciation of the beauty that humanity had created over centuries. The quiet murmur of conversation blended with the occasional gasp of admiration as people experienced the art in their own way. Each room of the museum offered something new, a new perspective or a new feeling, and as the visitors moved from one exhibit to the next, it felt as though they were journeying through time, exploring different eras and cultures, all encapsulated in the masterpieces on display.",
    "The night was alive with the sound of music and laughter as people gathered in the town square for the festival. Colorful lights strung across the trees flickered in the evening breeze, creating a festive atmosphere. Street vendors sold treats, from cotton candy to roasted nuts, while children ran through the crowd, their faces lit with excitement. The smell of popcorn and warm bread filled the air, and the distant sound of a band playing added to the sense of celebration. It was a night of joy and togetherness, where everyone seemed to come together to make memories. The square was alive with energy, as families, friends, and strangers all mingled in the glow of the lights, dancing, laughing, and enjoying the simple pleasures of the night. The air was filled with a sense of camaraderie, and for a few hours, the world outside the square seemed to disappear, replaced by the warmth and vibrancy of the festival atmosphere. The joy of the crowd was contagious, and the celebration felt endless, as if the night would go on forever in a continuous loop of fun and laughter.",
  ];

  const numbersList = [
    "At 7 AM I woke up feeling energized and ready for the day ahead I had a list of 5 tasks to complete before noon and I knew I had to stay focused if I wanted to finish everything on time the first thing on my list was a 30 minute workout which I had been doing regularly to stay fit I finished the workout by 730 AM and felt great afterwards then I went to the kitchen to make breakfast I had some eggs and toast which I ate by 8 AM after eating I started working on a coding project that I had been putting off for weeks it was a small personal project but it was something I had wanted to finish for a while at 10 AM I took a 15 minute break to clear my mind and grab some water then I resumed my work until I had completed the project by 1130 AM and I felt a sense of accomplishment for getting it done",
    "The class started at 9 AM and we had 4 hours of lectures scheduled for the day the first topic was about machine learning and it took about 2 hours we discussed the basics of supervised and unsupervised learning and some real world applications the second topic was data analysis and it took the remaining 2 hours we went over different techniques for analyzing datasets including regression and classification by 1 PM we had finished all of the material for the day and I felt like I had learned a lot I really enjoyed the class and felt motivated to dive deeper into both topics after class I met with some friends we grabbed lunch together and talked about our plans for the weekend",
    "I had a flight scheduled for 5 PM so I left my house at 2 PM to make sure I would arrive at the airport on time I had packed 3 bags and needed to check them in by 3 PM when I got to the airport I went through security which took a little longer than expected but I still had some time to spare so I grabbed a coffee and sat down to relax at 4 PM I boarded the plane and found my seat I had a window seat which I always prefer because I love the view from above at 7 PM I had arrived at my destination and was ready for the business trip I took a cab to the hotel where I was staying and checked in before heading to the meeting location",
    "I had an appointment at 3 PM so I arrived at the clinic at 230 PM I was feeling a little anxious because it had been a while since my last visit the appointment took about 45 minutes and I was done by 4 15 PM after the appointment I felt relieved and decided to go for a walk in the nearby park for 30 minutes the weather was perfect for a walk and I enjoyed the fresh air before heading home at 5 PM I started reviewing the notes I had taken during the appointment and made sure to follow the instructions for my treatment I felt confident that I was on track with my health goals",
    "At 10 AM I began my 12 kilometer run through the park I had been training for a few weeks and was aiming to improve my time for this distance I started off at a steady pace making sure not to push myself too hard at first by 1030 AM I had already covered 5 kilometers and was feeling good I stopped for a water break at 11 AM and continued running until I reached the 10 kilometer mark by 1130 AM I finished my run feeling accomplished and happy I spent a few minutes stretching to cool down before heading home I felt proud of myself for completing the run and knew it was a step toward reaching my fitness goals",
    "I was assigned to a new project that was due in 10 days and I was determined to finish it on time I spent the first 3 days gathering data and reviewing the sources by day 4 I began analyzing it and identifying key insights I worked hard to make sure the analysis was thorough and accurate by day 7 I had finished half of the analysis and started preparing the presentation I worked on it for the next 2 days making sure everything was clear and concise by day 10 I had completed the project and submitted it on time I felt a great sense of achievement for completing the project within the deadline and was proud of the quality of work I had produced",
    "The event was scheduled to begin at 6 PM and I arrived at 545 PM I was one of the first guests to arrive and the venue was still being set up by 6 PM the event started and there were 100 guests in attendance we spent the next 2 hours networking and listening to speakers who shared valuable insights into the industry after the event at 8 PM there was a dinner where everyone had a chance to relax and chat with colleagues the food was delicious and I had a great time catching up with people I hadn't seen in a while we all shared stories about our work and life experiences and it was a great way to unwind after a busy day",
    "I planned to complete 20 tasks today starting at 8 AM I had a clear plan and was determined to stay focused and productive the first 10 tasks were simple and I finished them by 11 AM it was a good start and I took a short break to recharge before continuing the next set of tasks by 2 PM I had completed all 20 tasks and felt satisfied with my productivity it was a productive day and I was happy with how much I had accomplished I spent the rest of the day relaxing and preparing for tomorrow by reviewing my to-do list and making sure everything was in order for the next day",
  ];

  const wordsPunctuationNumberList = [
    "At 7:00 AM, I stepped outside to begin my morning jog. The sun had just risen, casting a warm glow over the city, and I felt the fresh air fill my lungs as I began my run. I had planned to run 5 kilometers today, aiming to beat my previous record of 30 minutes. The streets were quiet, except for a few other joggers and early risers who were out enjoying the calm of the morning. By 7:30 AM, I had completed 3 kilometers, feeling good and on pace to beat my target. As I pushed myself harder, I was determined to finish the full distance in under 30 minutes. At 7:50 AM, I crossed the 5-kilometer mark, feeling accomplished with a time of 28 minutes, proud of myself for achieving a new personal best.",
    "The meeting was scheduled for 10:00 AM, and by 9:45 AM, the conference room had already started to fill. A total of 12 people were in attendance, each one prepared to discuss the progress of the current project. The first agenda item took 20 minutes to review, while the second, which involved analyzing recent data, lasted for 35 minutes. By the time the clock struck 11:30 AM, we had completed all of the topics on the agenda. The meeting ended promptly, leaving everyone with 30 minutes of free time before the next session. We all left the conference room feeling accomplished, knowing we had covered everything we needed to in the time we had.",
    "In the library, there were over 500 books on the shelf, but I was searching for one specific novel that had been recommended to me. I spent 15 minutes browsing the fiction section, hoping to find it, but I couldn't. After 20 minutes of searching online, I discovered that the book was available in the digital collection. I immediately checked it out and made a plan to finish reading the 300-page novel in the next 5 days. At 2:00 PM, I began reading the first chapter, excited to dive into the story and curious to see if it would live up to the praise it had received.",
    "The marathon was scheduled to start at 6:00 AM, and by 5:30 AM, over 500 runners were gathered at the starting line, all eager to begin. The weather was cool, with temperatures around 15°C, making it ideal for running. The race would span 42 kilometers, and participants were hoping to finish within 4 hours. I had trained for months, pushing myself through countless long runs and rigorous training sessions. I was aiming for a personal best time of 3 hours and 45 minutes. At 9:30 AM, after hours of intense effort, I crossed the finish line with a time of 3 hours and 42 minutes. Exhausted but thrilled, I celebrated having achieved my goal, knowing all the hard work had paid off.",
    "The concert was set to begin at 8:00 PM, and by 7:45 PM, the venue was nearly full with 2,000 excited attendees. The opening act took the stage, performing for 45 minutes and warming up the crowd for the main show. The energy in the room was electric, and the anticipation was building as the headliner prepared to perform. At 9:00 PM, the band took the stage, and the audience erupted in cheers. For the next 90 minutes, they played their greatest hits, and the crowd was fully engaged, singing along to every song. The concert ended at 10:30 PM, leaving everyone buzzing with excitement, still feeling the high from the live music long after it was over.",
    "I had a tight deadline to meet by 3:00 PM, and it was already 12:30 PM when I started working on the report. The project required me to analyze 15 datasets and write a detailed summary of the findings. By 1:30 PM, I had completed 7 of the datasets and was feeling confident that I would finish in time. After 2 hours of focused work, I had completed the analysis and spent the next 30 minutes writing the report. At 2:55 PM, I submitted the final document, just five minutes before the deadline, feeling proud of how efficiently I had worked under pressure.",
    "On the road trip, we planned to drive 500 kilometers over the course of 10 hours, making stops along the way to stretch and grab food. We made our first stop after 2 hours to stretch our legs and grab some coffee. By 3:00 PM, we had already covered 150 kilometers and were halfway through our journey. The scenery was breathtaking, with mountains on one side and forests on the other. After 6 hours of driving, we stopped for lunch at a small town diner, refueled, and got back on the road. By 7:30 PM, we arrived at our destination, exhausted but happy after a successful road trip, ready to relax after the long drive.",
    "The test started promptly at 9:00 AM, and we were given 2 hours to complete it. The exam consisted of 50 multiple-choice questions, 10 short-answer questions, and 3 essay questions. I decided to start with the multiple-choice section, finishing it in 30 minutes. By 10:30 AM, I had completed all the short-answer questions and moved on to the essays. I spent the remaining time carefully crafting my responses, ensuring I answered everything thoroughly. At 11:55 AM, I submitted my paper, feeling confident that I had done my best and was ready to relax after such an intense test.",
  ];

  const [isBlurred, setIsBlurred] = useState(true); 
  const [showButton, setShowButton] = useState(true); 
  const [text, setText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [started, setStarted] = useState(false); 
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [selectedTime, setSelectedTime] = useState(15);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeUp, setTimeUp] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [showResults, setShowResults] = useState(false);
  const [wpmHistory, setWpmHistory] = useState([]);
  const [accuracyHistory, setAccuracyHistory] = useState([]);
  const [testHistory, setTestHistory] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {

    const typingContainer = document.querySelector('.typing-container');
    if (isBlurred) {
      typingContainer.classList.add('blurred');
    } else {
      typingContainer.classList.remove('blurred');
    }


    setShowButton(isBlurred);

  }, [isBlurred]);


  
  const handleFocusClick = () => {
    setIsBlurred(false);
  };

  useEffect(() => {
    // const container = document.querySelector('.container');
    // container.classList.add('blurred');

    const randomParagraph =
      wordsPunctuationNumberList[
        Math.floor(Math.random() * wordsPunctuationNumberList.length)
      ];
      // setTimeout(() => {
      //   container.classList.remove('blurred');
      // }, 1500); 
    setText(randomParagraph);
  }, []);

  useEffect(() => {
    let interval;
    if (timerActive && time < selectedTime) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          
          // Only update stats (and history) every second
          calculateStats();
          return newTime;
        });
      }, 1000);
    } else if (time >= selectedTime) {
      clearInterval(interval);
      setTimeUp(true);
    }
    return () => clearInterval(interval);
  }, [timerActive, time, selectedTime]);

  useEffect(() => {
    if (time === selectedTime) {
      setTimerActive(false);
      calculateStats();
    }
  }, [time]);

  // const calculateStats = () => {
  //   const typedWords = typedText.trim().split(/\s+/).length;
  //   const wpmValue = Math.floor(typedWords / (time / 60));
  
  //   let correctCount = 0;
  //   for (let i = 0; i < Math.min(typedText.length, text.length); i++) {
  //     if (typedText[i] === text[i]) {
  //       correctCount++;
  //     }
  //   }
  
  //   const accuracyValue = Math.floor((correctCount / typedText.length) * 100);
  
  //   setWpm(wpmValue);
  //   setAccuracy(accuracyValue);
  // };
  
  const calculateStats = () => {
    const typedWords = typedText.trim().split(/\s+/).length;
    const wpmValue = Math.floor(typedWords / (time / 60));
  
    let correctCount = 0;
    for (let i = 0; i < Math.min(typedText.length, text.length); i++) {
      if (typedText[i] === text[i]) {
        correctCount++;
      }
    }
  
    const accuracyValue = typedText.length > 0 
      ? Math.floor((correctCount / typedText.length) * 100)
      : 0;
  
    setWpm(wpmValue);
    setAccuracy(accuracyValue);
  
    // ✅ Only update history if time is still running
    if (timerActive && time < selectedTime) {
      setWpmHistory(prev => 
        prev.length < selectedTime 
          ? [...prev, wpmValue] 
          : [...prev.slice(1), wpmValue] // Remove oldest entry if exceeding
      );
      setAccuracyHistory(prev => 
        prev.length < selectedTime 
          ? [...prev, accuracyValue] 
          : [...prev.slice(1), accuracyValue]
      );
    }
  };
  
  
  useEffect(() => {
    if (time === selectedTime) {
      setTimerActive(false);
      calculateStats();
      setShowResults(true);
      
      // Save test results to history
      setTestHistory(prev => {
        const newHistory = [
          ...prev,
          {
            wpm,
            accuracy,
            correctChars,
            totalChars,
            time: selectedTime,
            date: new Date().toISOString()
          }
        ];
        return newHistory.slice(-3); // Only keep last 3 items
      });
    }
  }, [time]);

  
  // Update your chart configuration in the useEffect where you create the chart
useEffect(() => {
  if (showResults && chartRef.current) {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const paddedWpmHistory = 
      wpmHistory.length < selectedTime
        ? [...wpmHistory, ...Array(selectedTime - wpmHistory.length).fill(wpmHistory[wpmHistory.length - 1] || 0)]
        : wpmHistory.slice(0, selectedTime);

    const paddedAccuracyHistory = 
      accuracyHistory.length < selectedTime
        ? [...accuracyHistory, ...Array(selectedTime - accuracyHistory.length).fill(accuracyHistory[accuracyHistory.length - 1] || 100)]
        : accuracyHistory.slice(0, selectedTime);

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      
      type: 'line',
      data: {
        // labels: Array.from({length: wpmHistory.length}, (_, i) => i + 1),
        // labels : wpmHistory.map((_, index) => index + 1), // 1, 2, 3, ..., up to selectedTime
        labels: Array.from({ length: selectedTime }, (_, i) => i + 1), // 1, 2, ..., selectedTime

        datasets: [
          {
            label: 'WPM',
            data: paddedWpmHistory,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            yAxisID: 'y',
            pointRadius: 2, // Smaller points
            pointHoverRadius: 4,
            pointBackgroundColor: 'rgb(75, 192, 192)',
          },
          {
            label: 'Accuracy %',
            data: paddedAccuracyHistory,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            yAxisID: 'y1',
            pointRadius: 2,
            pointHoverRadius: 4,
            pointBackgroundColor: 'rgb(255, 99, 132)',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              padding: 20,
              font: {
                size: 14
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleFont: {
              size: 14
            },
            bodyFont: {
              size: 12
            },
            padding: 10
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time (in seconds)',
            },
            ticks: {
              color: '#666',
              font: {
                size: 12
              },

             stepSize: 1,
             callback: (val) => val, 
            },
            title: {
              display: true,
              text: 'Time (seconds)',
              color: '#666',
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          },
          y: {
            beginAtZero: true,
            type: 'linear',
            display: true,
            position: 'left',
            grid: {
              color: 'rgba(0,0,0,0.05)'
            },
            ticks: {
              color: '#666',
              font: {
                size: 12
              }
            },
            title: {
              display: true,
              text: 'WPM',
              color: '#666',
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            min: 0,
            max: 100,
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              color: '#666',
              font: {
                size: 12
              }
            },
            title: {
              display: true,
              text: 'Accuracy %',
              color: '#666',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
          }
        }
      }
    });
  }
}, [showResults, wpmHistory, accuracyHistory, selectedTime]);

  // Add a reset function
  const resetTest = () => {
    setTime(0);
    setTypedText("");
    setStarted(false);
    setTimerActive(false);
    setTimeUp(false);
    setWpm(0);
    setAccuracy(100);
    setCorrectChars(0);
    setTotalChars(0);
    setWpmHistory([]);
    setAccuracyHistory([]);
    setShowResults(false);
    
    // Get new random text
    setText(getFilteredParagraphs());
  };

  const calculateConsistency = () => {
    if (wpmHistory.length < 2) return 100;
    
    const avg = wpmHistory.reduce((a, b) => a + b, 0) / wpmHistory.length;
    const variance = wpmHistory.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / wpmHistory.length;
    const stdDev = Math.sqrt(variance);
    
    return Math.max(0, 100 - Math.floor((stdDev / avg) * 100));
  };

  const handleKeyDown = (e) => {
    if (timeUp) return;
    if (!started) {
      setStarted(true);
      setTimerActive(true);
      setWpmHistory([0]);
    setAccuracyHistory([100]);
    }
  
    const { key } = e;
    if (key === "Backspace") {
      setTypedText((prev) => prev.slice(0, -1));
    }
    
    // Updated condition to allow numbers and punctuation
    else if (/^[a-zA-Z0-9\s!.,?;:()&%$#@^*+=_-]$/.test(key)) {
      setTypedText((prev) => prev + key);
      const currentChar = text[typedText.length]; 
      if (key === currentChar) {
        setCorrectChars((prev) => prev + 1);
      }
      setTotalChars((prev) => prev + 1);
    }
    calculateStats();
  };
  

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleTimeChange = (timeLimit) => {
    setSelectedTime(timeLimit);
    setTime(0);
    setTypedText("");
    setStarted(false);
    setTimerActive(false);
    setTimeUp(false);
    setWpm(0);
    setAccuracy(100);
    setCorrectChars(0);
    setTotalChars(0);
  };

  const getFilteredParagraphs = () => {
    let filteredParagraphs = [];

    if (
      selectedOptions.includes("words") &&
      selectedOptions.includes("punctuation") &&
      selectedOptions.includes("numbers")
    ) {
      filteredParagraphs = filteredParagraphs.concat(
        wordsPunctuationNumberList
      );
    } else {
      if (
        selectedOptions.includes("words") &&
        selectedOptions.includes("punctuation")
      ) {
        filteredParagraphs = filteredParagraphs.concat(punctuationList);
      } else if (
        selectedOptions.includes("words") &&
        selectedOptions.includes("numbers")
      ) {
        filteredParagraphs = filteredParagraphs.concat(numbersList);
      } else if (
        selectedOptions.includes("punctuation") &&
        selectedOptions.includes("numbers")
      ) {
        filteredParagraphs = filteredParagraphs.concat(
          wordsPunctuationNumberList
        );
      } else {
        if (selectedOptions.includes("words")) {
          filteredParagraphs = filteredParagraphs.concat(wordsList);
        }
        if (selectedOptions.includes("punctuation")) {
          filteredParagraphs = filteredParagraphs.concat(punctuationList);
        }
        if (selectedOptions.includes("numbers")) {
          filteredParagraphs = filteredParagraphs.concat(numbersList);
        }
      }
    }

    if (selectedOptions.length === 0) {
      filteredParagraphs = filteredParagraphs.concat(wordsList);
    }
    const randomParagraph =
      filteredParagraphs[Math.floor(Math.random() * filteredParagraphs.length)];

    return randomParagraph;
  };

  useEffect(() => {
    setText(getFilteredParagraphs());
  }, [selectedOptions]);

  const handleOptionChange = (option) => {
    setSelectedOptions((prevOptions) => {
      if (prevOptions.includes(option)) {
        return prevOptions.filter((opt) => opt !== option);
      } else {
        return [...prevOptions, option];
      }
    });
  };

  return (
    <div className="container"> 

    {showButton && (
        <button onClick={handleFocusClick} className="focus-button">
           Click here to focus
        </button>
      )}
      <div className="header">
        <h1 className="mt-4">Typing Test</h1>
        <div className="stats">
          <div className="options-container">
            <div className="timer-options">
              {[15, 30, 60, 120].map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeChange(time)}
                  className={selectedTime === time ? "active" : ""}
                  disabled={timerActive}
                >
                  {time}s
                </button>
              ))}
            </div>
            <div className=" options timer-options word-options">
              {["words", "punctuation", "numbers"].map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionChange(option)}
                  className={selectedOptions.includes(option) ? "active" : ""}
                >
                  {option === "words" && "Words"}
                  {option === "punctuation" && "Punctuation"}
                  {option === "numbers" && "Numbers"}
                </button>
              ))}
            </div>
          </div>

          <div className="timer-display">
            <span>
              ⏱️ {time}s / {selectedTime}s
            </span>
          </div>

          <div className="additional-stats">
            <div>⚡ {wpm} WPM</div>
            <div>🎯 {accuracy}% Accuracy</div>
          </div>
        </div>
      </div>
      {!showResults ? (
      <div className="typing-container" tabIndex={0} onKeyDown={handleKeyDown}>
        <div className="text">
          {(Array.isArray(text) ? text : text.split("")).map((char, index) => {
            const isCorrect =
              index < typedText.length && typedText[index] === text[index];
            const isIncorrect =
              index < typedText.length && typedText[index] !== text[index];

            return (
              <span
                key={index}
                className={`${isCorrect ? "green" : ""} ${
                  isIncorrect ? "red" : ""
                }`}
              >
                {char}
                {index === typedText.length - 1 && <span className="cursor" />}
              </span>
            );
          })}
          {typedText.length < text.length && !timeUp && (
            <span className="cursor" />
          )}
        </div>
      </div>
       ) : (
        <div className="results-container">
          <h2>Test Results</h2>
          
          <div className="summary-stats">
            <div className="stat-box">
              <div className="stat-value">{wpm}</div>
              <div className="stat-label">WPM</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{accuracy}%</div>
              <div className="stat-label">Accuracy</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{correctChars}/{totalChars}</div>
              <div className="stat-label">Chars</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{selectedTime}s</div>
              <div className="stat-label">Time</div>
            </div>
          </div>
          
          <div className="graph-container">
            <canvas ref={chartRef}></canvas>
          </div>
          
          <div className="detailed-stats">
            <div>
              <h3>Raw WPM: {Math.floor((typedText.trim().split(/\s+/).length * 60) / selectedTime)}</h3>
              <h3>Consistency: {calculateConsistency()}%</h3>
            </div>
            
            <div className="test-history">
              <h3>Recent Tests</h3>
              {testHistory.slice().reverse().map((test, index) => (
                <div key={index} className="history-item">
                  <span>{test.wpm} wpm</span>
                  <span>{test.accuracy}%</span>
                  <span>{test.time}s</span>
                </div>
              ))}
            </div>
          </div>
          
          <button onClick={resetTest} className="restart-button">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default TypingArea;
