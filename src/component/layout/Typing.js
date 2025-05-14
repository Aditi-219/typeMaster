import React, { useState, useEffect, useRef } from "react";
import "./Typing.css";
import { Chart } from "chart.js/auto";
import {
  getAuth,
  provider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "./firebase";
import { Link } from "react-router-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const TypingArea = () => {
  // Array of predefined paragraphs
  const wordsList = [
    "the sun sets slowly behind the mountains casting long shadows that stretch across the valley as the day begins to give way to night the colors in the sky shift from bright blue to warm oranges and reds the breeze begins to cool as it moves gently through the trees rustling their leaves the sounds of birds singing fade into the background and a sense of calm takes over the land it feels like time has slowed and for a brief moment everything in the world is at peace the air is fresh and crisp and the stars begin to make their appearance one by one in the darkening sky",
    "walking through the park early in the morning the ground is still damp with the dew that settles overnight the air is cool and carries the fresh scent of grass and earth the mist lingers low to the ground and weaves its way around the trees creating an ethereal atmosphere the path ahead is peaceful and inviting with flowers scattered along the edges their bright colors a contrast against the green of the grass and the quiet hum of nature all around it is a moment of solitude and tranquility that gives space to clear thoughts and peaceful reflection",
    "he city is alive with energy as people hustle and bustle along the busy streets the sidewalks are crowded with individuals all heading in different directions their faces filled with purpose and determination the sounds of honking cars and bus engines filling the air as traffic flows through the heart of the city at every corner there something new to see something new to experience from the street vendors selling fresh fruit to the brightly lit stores calling for attention each moment is filled with the rhythm of life that never seems to stop the city seems to breathe and move with its people always alive always changing",
    "inside the house the evening settles in and there is a quiet stillness that surrounds everything the lights are soft and warm casting a gentle glow over the rooms the kitchen is a mix of warmth and comfort with the smell of last night meal lingering in the air dishes scattered across the counter and the hum of the refrigerator providing the only sound in the room it is a moment of calm between the rush of the day and the quiet of the night as the world outside continues on its way this place feels like an anchor in a busy world providing rest and solace to anyone who steps inside",
    "the ocean is endless as it stretches far beyond the horizon the waves crash rhythmically against the shore their constant movement a reminder of the power of nature the air smells of salt and seaweed and carries the fresh coolness of the water the moon hangs low in the sky casting a silvery glow on the ocean surface the sound of the waves is soothing almost hypnotic as they roll in and retreat leaving the sand smooth and untouched the vastness of the ocean is both humbling and peaceful as you stand on the shore looking out at the endless expanse of water it feels like standing on the edge of the world",
    "walking through the forest feels like stepping into another world the towering trees rise high above casting shadows that stretch across the forest floor their leaves rustle gently in the wind creating a peaceful melody that blends with the chirps of hidden birds and the occasional rustle of small creatures moving through the underbrush the air smells rich with the scent of earth and moss and the ground beneath your feet is soft from years of fallen leaves and branches the forest feels ancient filled with life and stories untold waiting for someone to listen",
    "the market is full of life and color every stall is overflowing with fresh produce flowers and spices the air is thick with the smells of freshly baked bread sizzling street food and sweet fruit the vendors shout to draw attention to their goods while the buyers move quickly through the crowd haggling over prices and inspecting the wares the energy is palpable and the variety of sounds is endless from the chatter of the people to the rustling of paper bags and the clinking of coins it is a place where everything comes together the sights the smells the sounds all combine to create a lively atmosphere that makes the market feel like the heart of the town",
    "in the classroom the air is filled with the quiet buzz of students discussing their lessons the chalkboard is covered in scribbled notes equations and diagrams as the teacher stands at the front guiding everyone through the material some students are absorbed in their work furiously taking notes while others sit back and reflect quietly on what has been taught the classroom feels like a place of discovery where ideas and knowledge are shared and discussed freely the students listen intently their minds absorbing new information as they ask questions challenge ideas and build a deeper understanding of the world around them",
    "the morning begins with soft golden light stretching across the fields as birds rise into the sky and trees sway gently in the breeze people move quietly through their routines with calm minds and hopeful energy each step taken in rhythm with the world around them a dog runs across the open park chasing nothing in particular just happy to move and explore a woman walks beside a small child holding hands and laughing at something only they understand the bakery opens its doors releasing the scent of warm bread into the fresh air the sound of voices grows as the town slowly awakens to a new day ideas form plans unfold and the promise of something meaningful lingers in the air students gather outside their school carrying books and wide dreams eyes bright with wonder a farmer tends to his crops humming a familiar tune from his childhood",
    "the leaves rustle in agreement and the sun climbs higher casting light on every corner of the earth a painter sets up her canvas under a tree brushing colors into meaning slowly patiently with quiet joy the city continues to move not too fast not too slow just steady and alive the sky changes its shade as the hours pass and the horizon glows in hues of fire and calm night begins to take shape the stars return one by one and the world exhales ready to sleep again and begin once more information as they ask questions challenge ideas and build a deeper understanding",
    "every morning begins with the rising sun casting its golden light over the quiet world as people wake and stretch and prepare for the day ahead the air is filled with the soft sounds of nature leaves rustling birds singing and distant footsteps moving along sleepy streets the sky shifts from deep blue to pale gold as the day unfolds with slow steady grace children laugh as they run through open fields their joy echoing like music across the land a gentle breeze moves through the trees carrying the scent of flowers and fresh grass the world feels calm and alive as moments",
    "pass gently one into the next people gather to share stories to work to learn and to grow together in simple harmony every action every word every step adds to the rhythm of the day building toward something meaningful even in its smallest details as the sun climbs higher the world hums with quiet energy and silent promises waiting to be discovered and when the evening comes with its cool shadows and soft light the earth rests once again wrapped in a blanket of stillness and wonder ready to begin again when the morning returns moment is filled with the rhythm of life that never seems to stop the city seems to breathe and move with its people always alive always changing",
    "every day at college begins with the sound of alarms ringing in dorm rooms followed by sleepy footsteps rushing through narrow hallways as students grab their backpacks and head toward their morning lectures the campus slowly fills with energy as friends greet each other with tired smiles and casual waves the classrooms buzz with quiet chatter as professors set up their notes and laptops while students scribble down reminders and open their notebooks with half focused minds the corridors echo with footsteps coffee mugs clutched tightly as everyone tries to stay awake and stay on track under the trees outside students gather in circles discussing projects cracking jokes sharing",
    "snacks and sometimes just sitting in peaceful silence the library becomes a second home a place where some find focus others find distraction and a few just close their eyes for a minute of rest lab sessions bring a different kind of chaos wires tangled codes half working screens flickering with both success and failure laughter and frustration live side by side in the same moment and somehow it all becomes part of the learning by evening the sun casts golden light across the courtyard as clubs meet events begin and the air fills with music dance and voices full of passion and hope the night arrives slowly with heads buried in books lights glowing in windows and the steady tap of keyboards filling the silence as dreams are built one line of code at a time",
    "laughter and letting the slow rhythm of the day guide them forward the sunlight filters through the leaves casting moving patterns on the ground as a few pages turn and conversations drift from classes to weekend plans the scent of rain from the night before still lingers in the air blending with the smell of coffee and fresh notebooks while time moves without rush each moment stacking gently on the next casts golden light across the courtyard as clubs meet events begin and the air fills with music dance and voices full of passion and hope the night arrives slowly with heads buried in books lights glowing in windows and the steady tap of keyboards filling the silence as dreams are built one line of code at a",
    "as afternoon settles in the library becomes a quiet sanctuary filled with soft whispers and the gentle tapping of keyboards students search for focus in their notes their eyes tracing lines of code and definitions hoping to make sense of something before the next test someone sits by the window lost in thought while others trade snacks and stories trying to keep their energy from fading as the day stretches on the wares the energy is palpable and the variety of sounds is endless from the chatter of the people to the rustling of paper bags an walks beside a small child holding hands and laughing at something only they understand the bakery opens its doors releasing the scent of warm bread into the fresh air the sound of voices grows as the town slowly awakens to a new day ideas form plans unfold and the promise of something meaningful lingers in the air students gather outside their school carrying books and wide dreams eyes bright with wonder a farmer tends to his crops humming a familiar tune from his childhood",
    "the leaves rustle in agreement and the sun climbs higher casting light on every corner of the earth a painter sets up her canvas under a tree brushing colors into meaning slowly patiently with quiet joy the city continues to move not too fast not too slow just steady and alive the sky changes its shade as the hours pass and the horizon glows in hues of fire and calm night begins to take shape the stars return one by one and the world exhales ready to sleep again and begin once more information as they ask questions challenge ideas and build a deeper understanding side the dorms lights flicker on one by one as music begins to play in the background soft lo fi or old school pop depending on whose speaker wins for the night there are shared meals and last minute assignment panic quiet laughter in the hallway and someone trying to ex",
    "by evening the sky turns a soft orange and the campus begins to slow down a little footsteps grow lighter conversations drift into softer tones and groups begin to dissolve into smaller clusters some head to the sports field to play under the last bit of light others find a quiet bench to sit and reflect on everything and nothing the air is cooler now brushing gently against tired faces between the rush of the day and the quiet of the night as the world outside continues on its way this place feels as they run through open fields their joy echoing like music across the land a gentle breeze moves through the trees carrying the scent of flowers and fresh grass the world feels calm and ali",
    "inside the dorms lights flicker on one by one as music begins to play in the background soft lo fi or old school pop depending on whose speaker wins for the night there are shared meals and last minute assignment panic quiet laughter in the hallway and someone trying to explain a concept they just learned five minutes ago the walls carry stories in every direction and the night begins to unfold feels like time has slowed and for a brief moment everything in the world is at peace the air is fresh and crisp and the stars begin to make their  the fresh air the sound of voices grows as the town slowly awakens to a new day ideas form plans unfold and the promise of something meaningful lingers in the air students gather outside their school carrying books and wide dreams eyes bright with wonder a farmer tends to his crops humming a familiar tune from ",
    "when it grows late and the world outside goes still screens dim down and beds grow warm with sleep waiting to settle in there is a silence that is not empty but full of all the things the day brought with it a soft kind of peace settles in rooms where dreams begin to form quietly gently like a whisper reminding everyone that tomorrow is just a few hours away streets the sidewalks are crowded with individuals all heading in different directions their faces filled with purpose and determination the sounds of honking cars and bus engines filling the air as traffic flows through the heart of the city at every corner there something new to see something new to experience from the street vendors selling fresh fruit to the brightly lit stores calling for attention each moment is filled with the rhythm of life that never seems to stop the city seems to breathe and move with its people always"

  ];
  const punctuationList = [
    "As the rain poured down, the streets began to fill with puddles, reflecting the lights from nearby buildings. People hurried along the sidewalks, umbrellas held high to shield themselves from the downpour. The sound of raindrops tapping against windows created a soothing rhythm, while the occasional car drove by, splashing water onto the curbs. The air smelled fresh, with a slight earthy undertone that only a rainstorm can bring. For a brief moment, the world seemed to slow down, wrapped in the calm that only rain can create. The rhythm of the rain on the rooftops and the distant rumble of thunder added to the atmosphere, making the whole world feel like it was holding its breath, waiting for the storm to pass, and in the stillness that followed, there was a quiet sense of peace that filled the air. The sky was a canvas of shifting grays, with only the occasional glimmer of sunlight peeking through the clouds, hinting at the calm that would come after the storm.",
    "The garden was alive with color, from the bright yellow daffodils to the deep red roses. Bees buzzed from flower to flower, gathering nectar, while butterflies fluttered gracefully through the air. The sun was high in the sky, casting warm light across the vibrant blooms. The scent of jasmine filled the air, mingling with the fresh grass and earth. It was a perfect day to sit and enjoy the simple beauty of nature, watching as each petal danced in the gentle breeze. The fragrance of flowers blended with the earthy aroma of the garden, creating a natural perfume that enveloped the senses. Birds chirped in the distance, adding a melody to the scene, while the breeze whispered through the trees, making the leaves rustle as if sharing secrets with the wind. Everything about the garden felt timeless, a serene escape from the bustle of everyday life, where one could lose track of time in the gentle embrace of nature s beauty.",
    "The kitchen was busy with the clatter of pots and pans as dinner was being prepared. The smell of garlic and onions sizzling in olive oil filled the room, making everyone s mouth water. The stove hummed softly, and the oven door opened with a gentle whoosh as the heat escaped. Laughter echoed in the background as family members moved around the room, preparing different parts of the meal. It was a comforting chaos, a reminder of the joy that comes with sharing a meal together. The aroma of spices and roasting vegetables filled the air, signaling that dinner was near. The soft clink of cutlery and the rhythmic chopping of vegetables were accompanied by the hum of conversation, as everyone worked together to create something delicious. As the table was set, the room filled with anticipation, and the warmth of the kitchen seemed to invite everyone to linger, savoring not only the food but the sense of togetherness that came with it.",
    "The city park was peaceful at dawn, with only a few joggers and dog walkers scattered along the paths. The air was cool and crisp, and the first light of day painted the sky in soft pinks and purples. Birds perched in the trees, singing their morning songs, while the grass underfoot was still wet with dew. The park was a quiet retreat from the busyness of the city, a place where time seemed to stand still for a few moments. It was the perfect place for reflection or simply taking in the beauty of a new day. The stillness of the morning was broken only by the sound of footsteps crunching on the gravel path and the occasional rustle of leaves in the trees. The world felt fresh and untouched, as if the park had been waiting for the sun to rise before it came to life, and in that peaceful solitude, everything felt right. The distant hum of the city seemed far away, replaced by the gentle whisper of the wind and the soft chirping of the birds, creating a serene harmony that made the early morning walk feel like a gentle meditation.",
    "The library was a haven of silence, with rows upon rows of books neatly arranged on shelves. The smell of paper and ink was faint but comforting, a sign of the knowledge contained within. People sat at tables, immersed in their reading, while others flipped through pages, looking for the next great story. The soft sound of turning pages filled the room, blending with the occasional cough or sneeze. It was a place where one could escape into another world, leaving the hustle and bustle of everyday life behind. The walls seemed to absorb the sounds, creating an almost reverent atmosphere where every whispered word seemed out of place. The soft glow of desk lamps illuminated the pages of books, and the quiet rustle of pages was the only sound that broke the stillness. It was a sanctuary of thought, a place where time seemed to slow down, allowing for a deep dive into the world of imagination, knowledge, or reflection. Each book on the shelf was a doorway to a different world, and in the quiet corners of the library, one could lose themselves in stories waiting to be discovered.",
    "The snow fell gently, covering the ground in a soft white blanket. Trees were adorned with delicate icicles, sparkling in the weak winter sunlight. The air was cold, but not harsh, and the world seemed quieter under the weight of the snow. Footprints appeared in the fresh powder as people walked by, leaving temporary marks on the otherwise untouched landscape. Children could be heard laughing in the distance, building snowmen and having snowball fights, their joy infectious as it echoed through the stillness of the winter day. The soft crunch of snow underfoot was the only sound that filled the otherwise hushed air. The world seemed to pause for a moment, wrapped in a serene quiet, as if the snow had cast a peaceful spell over everything. The trees, now heavy with snow, bent slightly under the weight, their branches adorned in glistening white. The crisp air was refreshing, and the cold did little to deter the spirit of the day, as laughter and shouts of joy rang through the frosty air, filling the scene with life and energy.",
    "The museum was filled with people admiring the art, each piece telling a unique story. Sculptures stood tall, casting shadows on the polished floors, while paintings covered the walls, each brushstroke a testament to the artist s vision. The air was heavy with the scent of old wood and the faint smell of paint. Some visitors stood in awe before the works, while others discussed their interpretations with friends. It was a place where time seemed to slow down, allowing for reflection and appreciation of the beauty that humanity had created over centuries. The quiet murmur of conversation blended with the occasional gasp of admiration as people experienced the art in their own way. Each room of the museum offered something new, a new perspective or a new feeling, and as the visitors moved from one exhibit to the next, it felt as though they were journeying through time, exploring different eras and cultures, all encapsulated in the masterpieces on display.",
    "The night was alive with the sound of music and laughter as people gathered in the town square for the festival. Colorful lights strung across the trees flickered in the evening breeze, creating a festive atmosphere. Street vendors sold treats, from cotton candy to roasted nuts, while children ran through the crowd, their faces lit with excitement. The smell of popcorn and warm bread filled the air, and the distant sound of a band playing added to the sense of celebration. It was a night of joy and togetherness, where everyone seemed to come together to make memories. The square was alive with energy, as families, friends, and strangers all mingled in the glow of the lights, dancing, laughing, and enjoying the simple pleasures of the night. The air was filled with a sense of camaraderie, and for a few hours, the world outside the square seemed to disappear, replaced by the warmth and vibrancy of the festival atmosphere. The joy of the crowd was contagious, and the celebration felt endless, as if the night would go on forever in a continuous loop of fun and laughter.",
    "The sky was soft this morning, painted in shades of gold and pale blue. A quiet breeze drifted through the trees, carrying with it the faint scent of flowers and something warm, like home. People walked with a slower pace, sipping tea or coffee, bundled in hoodies and quiet thoughts. It felt like the kind of morning that lets you start again, without pressure, just peace. It was a night of joy and togetherness, where everyone seemed to come together to make memories. The square was alive with energy, as families, friends, and strangers all mingled in the glow of the lights, dancing, laughing, and enjoying the simple pleasures of the night. The air was filled with a sense of camaraderie, and for a few hours, the world outside the square seemed to disappear, replaced by the warmth and vibrancy of the festival atmosphere. The joy of the crowd was contagious, and the celebration felt endless, as if the night would go on forever in a continuous loop of fun and laughter.",
    "Inside a quiet room, a student sat with a notebook open, pen in hand, headphones on. Music played gently lo-fi beats and mellow guitar strings. Ideas came and went like waves, some sticking, some drifting. There was no rush. No deadline. Just curiosity and the soft urge to understand something new. Learning felt lighter when it came without pressure.powder as people walked by, leaving temporary marks on the otherwise untouched landscape. Children could be heard laughing in the distance, building snowmen and having snowball fights, their joy infectious as it echoed through the stillness of the winter day. The soft crunch of snow underfoot was the only sound that filled the otherwise hushed air. The world seemed to pause for a moment, wrapped in a serene quiet, as if the snow had cast a peaceful spell over everything. The trees, now heavy with snow, bent slightly under the weight, their branches adorned in glistening white. The crisp air was refreshing, and the cold did",
    "Outside, the world kept moving. Friends gathered under the old tree on campus, laughing at something silly, probably an inside joke that made no sense to anyone else. A cat wandered through the group, unbothered, probably looking for snacks or sun. The air was full of life footsteps, echoes, someone playing guitar somewhere in the background.or a deep dive into the world of imagination, knowledge, or reflection. Each book on the shelf was a doorway to a different world, and in the quiet corners of the library, one could lose themselves in stories waiting to be discovered. casional cough or sneeze. It was a place where one could escape into another world, leaving the hustle and bustle of everyday life behind. The walls seemed to absorb the sounds, creating an almost reverent atmosphere where every whispered word seemed out of place. The soft glow of desk lamps illuminated the pages of books, and the quiet rustle of pages was the only sound that broke the stillness. It was a sanctuary of thought, a place where time seemed to slow down, allowing for a deep dive into the world",
    "Later in the day, everything slowed down. Books were closed, laptops shut, and the golden hour settled over everything like a filter. Someone sat alone on a bench, earbuds in, eyes closed, letting the moment breathe. No messages, no tasks just the sound of birds and breeze and the quiet hum of being alive.sign of the knowledge contained within. People sat at tables, immersed in their reading, while others flipped through pages, looking for the next great story. The soft sound of turning pages filled the room, blending with the occasional cough or sneeze. It was a place where one could escape into another world, leaving the hustle and bustle of everyday life behind. The walls seemed to absorb the sounds, creating an almost reverent atmosphere where every whispered word seemed out of place. The soft glow of desk lamps illuminated the pages of books, and the quiet rustle of pages was the only sound that broke the stillness. It was a sanctuary of thought, a place where time seemed to slow down, allowing for a deep dive into the world of imagination, knowledge, or reflection.",
    "As night arrived, the city lit up with soft lights and scattered stars. Stories played out in cafés, dorm rooms, rooftops, and quiet streets. People shared food, screens, playlists, secrets, and dreams. Somewhere in all of it, the world kept turning softly, steadily reminding everyone that even in chaos, there’s rhythm, and even in noise, there’s space to just be.he museum was filled with people admiring the art, each piece telling a unique story. Sculptures stood tall, casting shadows on the polished  quiet sense of peace that filled the air. The sky was a canvas of shifting grays, with only the occasional glimmer of sunlight peeking through the clouds, hinting at the calm that would come after",
    "The sun dipped lower behind the buildings, casting golden light on the windows and pavements below. Somewhere nearby, someone was humming a tune, just loud enough to drift into the moment without disrupting it. A couple sat on a bench sharing a snack, barely speaking, just enjoying the stillness between them. The city was slower than usual, like it had taken a deep breath and decided to rest for a while. ched landscape. Children could be heard laughing in the distance, building snowmen and having snowball fights, their ell of popcorn and warm bread filled the air, and the distant sound of a band playing added to the sense of celebration. It was a night of joy and togetherness, where everyone seemed to come together to make memories. The square was alive with energy, as families, friends, and strangers all mingled in the glow of the lights, dancing, laughing, and enjoying the simple pleasures of the night. The air was filled with a sense of camaraderie, and for a few hours, the world outside the square seemed to disappear, replaced by the warmth and vibrancy of the festival atmo",
    "Books lay open on the grass while a group of students lay sprawled in a quiet patch of the quad. Some read, some scrolled, others simply looked at the sky as if trying to memorize its color. One person pointed at a cloud and laughed at how it looked like a badly drawn turtle. It was the kind of afternoon where everything felt exactly enough not too loud, not too quiet, just right seemed to slow down, allowing for reflection and appreciation of the beauty that humanity had created over centuries. The quiet murmur of conversation blended with the occasional gasp of admiration as people experienced the art in their own way. Each room of the museum offered something new, a new perspective or a new feeli.",
    "Rain began to fall in soft whispers against the window panes, making the room feel smaller and cozier. Inside, a kettle boiled while a playlist of soft jazz and indie folk played in the background. A journal lay half-filled with doodles and half-sentences, like thoughts in motion. Outside, umbrellas popped open like tiny boats sailing through a sea of grey and green. d onions sizzling in olive oil filled the room, making everyone’s mouth water. The stove hummed softly, and the oven door opened with a gentle whoosh as the heat escaped. Laughter echoed in the background as family members moved around the room, preparing different parts of the meal. It was a comforting chaos, a reminder of the joy that comes with sharing a meal together. The aroma of spices a",
    "The café near the corner buzzed with quiet chatter and the clinking of cups. A barista smiled as she handed someone a drink with their name spelled slightly wrong, but neither of them minded. Laptops glowed on wooden tables while playlists looped on low volume. The air smelled like cinnamon and espresso, and time seemed to move just a little slower inside. e snow fell gently, covering the ground in a soft white blanket. Trees were adorned with delicate icicles, sparkling in the weak winter sunlight. The air was cold, but not harsh, and the world seemed quieter under the weight of the snow. Footprints appeared in the fresh powder as people walked by, leaving temporary marks on the otherwise untouched landscape. Children could be heard laughing in the distance, building snowmen and having snowball fights, their joy infectious as it echoed through the stillness of the winter day. The ",
    "Evening arrived again like a friend returning home. Lights turned on in windows one by one, casting warm rectangles onto the pavement. A dog barked in the distance, answered by another a few streets away. People walked back to their homes, tired but content, carrying groceries and stories from the day. It felt ordinary, but in the best possible way soft, real, and alive tance, building snowmen and having snowball fights, their joy infectious as it echoed through the stillness of the winter day. The soft crunch of snow underfoot was the only sound that filled the otherwise hushed air. The world seemed to pause for a moment, wrapped in a serene quiet, as if the snow had cast a peaceful spell over everything. The trees, now heavy with snow, bent slightly under the weight, their branches adorned."

  ];

  const numbersList = [
    "At 7 AM I woke up feeling energized and ready for the day ahead I had a list of 5 tasks to complete before noon and I knew I had to stay focused if I wanted to finish everything on time the first thing on my list was a 30 minute workout which I had been doing regularly to stay fit I finished the workout by 730 AM and felt great afterwards then I went to the kitchen to make breakfast I had some eggs and toast which I ate by 8 AM after eating I started working on a coding project that I had been putting off for weeks it was a small personal project but it was something I had wanted to finish for a while at 10 AM I took a 15 minute break to clear my mind and grab some water then I resumed my work until I had completed the project by 1130 AM and I felt a sense of accomplishment for getting it done",
    "The class started at 9 AM and we had 4 hours of lectures scheduled for the day the first topic was about machine s of supervised and unsupervised learning and some real world applications the second topic was data analysis and it took the remaining 2 hours we went over different techniques for analyzing datasets including regression and classification by 1 PM we had finished all of the material for the day and I felt like I had learned a lot I rI really enjoyed the class and felt motivated to dive deeper into both topics after class I met with some friends we grabbed lunch together and talked about our plans for the weekend",
    "I had a flight scheduled for 5 PM so I left my house at 2 PM to make sure I would arrive at the airport on time I had packed 3 bags and needed to check them in by 3 PM when I got to the airport I went through security which took a little longer than expected but I still had some time to spare so I grabbed a coffee and sat down to relax at 4 PM I boarded the plane and found my seat I had a window seat which I always prefer because I love the view from above at 7 PM I had arrived at my destination and was ready for the business trip I took a cab to the hotel where I was staying and checked in before heading to the meeting location",
    "I had an appointment at 3 PM so I arrived at the clinic at 230 PM I was feeling a little anxious because it had been a while since my last visit the appointment took about 45 minutes and I was done by 4 15 PM after the appointment I felt relieved and decided to go for a walk in the nearby park for 30 minutes the weather was perfect for a walk and I enjoyed the fresh air before heading home at 5 PM I started reviewing the notes I had taken during the appointment and made sure to follow the instructions for my treatment I felt confident that I was on track with my health goals",
    "At 10 AM I began my 12 kilometer run through the park I had been training for a few weeks and was aiming to improve my time for this distance I started off at a steady pace making sure not to push myself too hard at first by 1030 AM I had already covered 5 kilometers and was feeling good I stopped for a water break at 11 AM and continued running until I reached the 10 kilometer mark by 1130 AM I finished my run feeling accomplished and happy I spent a few minutes stretching to cool down before heading home I felt proud of myself for completing the run and knew it was a step toward reaching my fitness goals",
    "I was assigned to a new project that was due in 10 days and I was determined to finish it on time I spent the first 3 days gathering data and reviewing the sources by day 4 I began analyzing it and identifying key insights I worked hard to make sure the analysis was thorough and accurate by day 7 I had finished half of the analysis and started preparing the presentation I worked on it for the next 2 days making sure everything was clear and concise by day 10 I had completed the project and submitted it on time I felt a great sense of achievement for completing the project within the deadline and was proud of the quality of work I had produced",
    "The event was scheduled to begin at 6 PM and I arrived at 545 PM I was one of the first guests to arrive and the venue was still being set up by 6 PM the event started and there were 100 guests in attendance we spent the next 2 hours networking and listening to speakers who shared valuable insights into the industry after the event at 8 PM there was a dinner where everyone had a chance to relax and chat with colleagues the food was delicious and I had a great time catching up with people I hadn't seen in a while we all shared stories about our work and life experiences and it was a great way to unwind after a busy day",
    "I planned to complete 20 tasks today starting at 8 AM I had a clear plan and was determined to stay focused and productive ths of supervised and unsupervised learning and some real world applications the second topic was data analysis and it took the remaining 2 hours we went over different techniques for analyzing datasets including regression and classification by 1 PM we had finished all of the material for the day and I felt like I had learned a lot I rf the day relaxing and preparing for tomorrow by reviewing my to-do list and making sure everything was in order for the next day",
    "Today is day 1 of the new semester and everything feels fresh and a bit overwhelming There are 5 new subjects to study and each one has its own challenges and excitement The library opened at 8 in the morning and by 830 students were already lining up to grab the best spots The classroom was full by 9 and the teacher started with a list of 10 things to remember throughout the course tment I felt relieved and decided to go for a walk in the nearby park for 30 minutes the weather was perfect for a walk and I enjoyed the fresh air before heading home at 5 PM I started reviewing the notes I had taken during the appointment and made sure to follow the instructions for my treatment I felt c",
    "By 11 the first class ended and everyone rushed to the canteen Some bought 2 cups of coffee while others went straight for lunch which usually costs around 50 to 100 depending on what you take The tables were all taken within 4 minutes and the noise level hit 100 quickly There was a group of 6 friends playing cards and laughing as if they had already forgotten about the quiz at   last visit the appointment took about 45 minutes and I was done by 4 15 PM after the appointment I felt relieved and decided to go for a walk in the nearby park for 30 minutes the weather was perfect for a walk and I enjoyed the fresh air before heading home at 5 PM I started reviewing the notes I had taken during the appointment and made sur3",
    "At 2 the library was almost full again People were either solving 20 DSA problems or revising 3 chapters before the test A few had headphones in listening to playlists with over 200 songs just to stay focused Some were scribbling on 5 sheets of paper and others were staring at the same page for 30 minutes hoping something would click s of supervised and unsupervised learning and some real world applications the second topic was data analysis and it took the remaining 2 hours we went over different techniques for analyzing datasets including regression and classification by 1 PM we had finished all of the material for the day and I felt like I had learned a lot I r",
    "After the quiz ended at 4 there was a mix of relief and confusion Some said the paper was easy and would get 9 out of 10 while others knew they might barely get 3 marks People walked out discussing question 6 and whether option B or C was correct There were 12 of them sitting under the same tree arguing about it until the sun started to set around s of supervised and unsupervised learning and some real world applications the second topic was data analysis and it took the remaining 2 hours we went over different techniques for analyzing datasets including regression and classification by 1 PM we had finished all of the material for the day and I felt like I had learned a lot I r",
    "By 7 everyone had different plans Some were going for a coding session that would last till 10 while others joined the dance practice in the auditorium where at least 15 people had signed up One person decided to watch 4 episodes of a new series while their roommate took a nap for 2 hours The day ended like that full of small moments and silent wins ready to repeat again tomorro s of supervised and unsupervised learning and some real world applications the second topic was data analysis and it took the remaining 2 hours we went over different techniques for analyzing datasets including regression and classification by 1 PM we had finished all of the material for the day and I felt like I had learned a lot I rw",
    "By 9 the next morning people had already gathered near the seminar hall waiting for the speaker to arrive Some had been there since 845 hoping to grab front seats while others strolled in at the last minute with iced coffee in hand The topic was about building scalable systems and the speaker mentioned 7 real world case studies that got everyone taking notes especially when he talked about how company revenue grew 5 times in 2 years he event at 8 PM there was a dinner where everyone had a chance to relax and chat with colleagues the food was delicious and I had a great time catching up with people I hadn't seen in a while we all shared stori",
    "At 12 sharp the cafeteria launched a special menu and word spread like wildfire Within 15 minutes there were 30 people in line waiting for the limited edition pasta bowl which only had 20 servings available Those who missed it settled for sandwiches and cold drinks and sat in groups of 4 or 5 talking about the session earlier and how it might help with placement prep this semeste d would get 9 out of 10 while others knew they might barely get 3 marks People walked out discussing question 6 and whether option B or C was correct There were 12 of them sitting under the same tree arguing about it until the sun started to set around s of supervised r",
    "Around 3 a few students went to the workshop room to build their resumes They had to pick between 2 formats and write summaries that didn’t exceed 300 words The mentor gave them 4 tips to stand out and pointed out 6 common mistakes students make One guy finished his draft in 25 minutes while another kept editing for more than 1 hour trying to perfect each line s there were 30 people in line waiting for the limited edition pasta bowl which only had 20 servings available Those who missed it settled for sandwiches and cold drinks and sat in groups of 4 or 5 talking about the session earlier and how it might help with placement prep this semeste d would get 9 out of 10 while othe",
    "At 5 there was a quick team meeting for the hackathon happening next weekend The leader listed out 8 tasks and assigned them to 4 members in pairs Each task had a soft deadline of 2 days and everyone agreed to meet again on Friday evening to share progress One member was still unsure about the tech stack so the team suggested 3 tutorials and a sample GitHub repo to get started I went through security which took a little longer than expected but I still had some time to spare so I grabbed a coffee and sat down to relax at 4 PM I boarded the plane and found my seat I had a window seat which I always prefer because I love the view from above at 7 PM I had arrived at my destination and was ready for the business trip I took a cab t",
    "By 9 the dorm lounge was alive again with 10 students sitting in a circle playing a trivia game One round had 25 questions and the winning team scored 18 points while the others laughed off their wrong answers Someone ordered 3 large pizzas and the boxes disappeared in less than 6 minutes The day slowly quieted down as the clock ticked past 11 leaving only the sound of footsteps and late night keyboard typing echoing through the halls had a flight scheduled for 5 PM so I left my house at 2 PM to make sure I would arrive at the airport on time I had packed 3 bags and needed to check them in by 3 PM when I got to the airport I went through security which took a little longer than expected but I still had some time to spare so I grabbed a coffee and sat down to relax at 4 PM I boarded the plane a"

  ];

  const wordsPunctuationNumberList = [
    "At 7:00 AM, I stepped outside to begin my morning jog. The sun had just risen, casting a warm, golden hue over the sleepy city, its rays filtering through the thin veil of mist that still clung to the ground. The air was crisp, and each inhale filled my lungs with a refreshing sense of clarity. I was armed with my fitness tracker, a water bottle, and sheer determination. I had mapped out a 5-kilometer loop the night before, and today was the day to break my 30-minute record. The streets were nearly silent, save for the rhythmic pounding of shoes from a few fellow runners and the chirping of birds marking the start of a new day. I kept a steady pace, feeling the muscles in my legs loosen with each step. By 7:30 AM, I had crossed the 3-kilometer mark, slightly ahead of schedule and fueled by the encouraging metrics on my smartwatch. I shifted into high gear, my heart pounding with a mix of fatigue and adrenaline. By 7:50 AM, drenched in sweat but filled with a sense of euphoric triumph, I sprinted across the 5-kilometer finish line in 28 minutes. It was more than a jog it was a mental victory.",
    "The meeting was scheduled for 10:00 AM, and by 9:45 AM, the sleek glass conference room had started to buzz with quiet conversations, coffee cups clinking gently against saucers. A total of 12 professionals, each representing different verticals of the project pipeline, were seated around a polished oak table, their laptops open, documents highlighted, and presentation decks queued. We started promptly at 10:00 AM with a crisp overview of the deliverables. The first agenda item involved a deep dive into Q2 metrics, taking roughly 20 minutes as we dissected graphs, trends, and anomalies. The second topic, far more complex, focused on predictive analytics based on recent datasets and stretched into a 35-minute discussion marked by brainstorming and sharp back-and-forths. At 11:30 AM, with a collective sigh of accomplishment, we concluded the final point and left the room with 30 minutes to regroup before the follow-up session. The sense of alignment was palpable. Everyone walked out feeling synced and energized ready to translate insights into action, strategy into execution.",
    "The moment I stepped onto the pavement for my morning run, the city was still wrapped in a soft, golden haze. It was 6:30 AM just early enough that the streets whispered rather than roared. With each stride, my sneakers tapped a steady rhythm against the asphalt, syncing with my breath, syncing with my thoughts. This wasn’t just exercise it was a ritual, a way to clear mental clutter and inject clarity before the noise of the day set in. I took the familiar turn near the park, where sunlight filtered through tall trees like a spotlight on the path ahead. For 30 minutes, I wasn’t worried about deadlines or expectations. I was just present. By the time I looped back to my front gate, lungs full, mind sharp, I felt grounded. That run didn’t just start my day it reset me. It reminded me that showing up for myself, even in small, sweaty ways, pays off in focus, energy, and grit.",
    "The marathon was scheduled to start at 6:00 AM, and by 5:30 AM, over 500 runners were gathered at the starting line, all eager to begin. The weather was cool, with temperatures around 15°C, making it ideal for running. The race would span 42 kilometers, and participants were hoping to finish within 4 hours. I had trained for months, pushing myself through countless long runs and rigorous training sessions. I was aiming for a personal best time of 3 hours and 45 minutes. At 9:30 AM, after hours of intense effort, I crossed the finish line with a time of 3 hours and 42 minutes. Exhausted but thrilled, I celebrated having achieved my goal, knowing all the hard work had paid off.",
    "The meeting had been scheduled for 10:00 AM, and by 9:45 AM, the sleek glass conference room had started to buzz with quiet conversations, coffee cups clinking gently against saucers. A total of 12 professionals, each representing different verticals of the project pipeline, were seated around a polished oak table, their laptops open, documents highlighted, and presentation decks queued. We started promptly at 10:00 AM with a crisp overview of the deliverables. The first agenda item involved a deep dive into Q2 metrics, taking roughly 20 minutes as we dissected graphs, trends, and anomalies. The second topic, far more complex, focused on predictive analytics based on recent datasets and stretched into a 35-minute discussion marked by brainstorming and sharp back-and-forths. At 11:30 AM, with a collective sigh of accomplishment, we concluded the final point and left the room with 30 minutes to regroup before the follow-up session. The sense of alignment was palpable. Everyone walked out feeling synced and energized ready to translate insights into action, strategy into execution.",
    "I had a tight deadline to meet by 3:00 PM, and it was already 12:30 PM when I started working on the report. The project required me to analyze 15 datasets and write a detailed summary of the findings. By 1:30 PM, I had completed 7 of the datasets and was feeling confident that I would finish in time. After 2 hours of focused work, I had completed the analysis and spent the next 30 minutes writing the report. At 2:55 PM, I submitted the final document, just five minutes before the deadline, feeling proud of how efficiently I had worked under pressure. clarity before the noise of the day set in. I took the familiar turn near the park, where sunlight filtered through tall trees like a spotlight on the path ahead. For 30 minutes, I wasn’t worried about deadlines or expectations. I was just present. By the",
    "By 12:30 PM, I had already sent out replies to half a dozen emails and skimmed through a few task reminders. I knew that by 3:00 PM, I had a report due, but the time had somehow slipped away. The pressure was mounting, but as I sat down to begin, I focused on the task at hand. The project required analyzing 15 separate datasets, a task that seemed monumental at first. I spent the next hour working through the data, breaking it down into actionable insights. By 2:00 PM, I had completed the first half and felt a surge of confidence. A half hour later, the analysis was complete, and I shifted to drafting the report. By 2:55 PM, with only five minutes to spare, I submitted the document. The sense of relief was overwhelming just another day of staying ahead of the deadline.",
    "On the road trip, we planned to drive 500 kilometers over the course of 10 hours, making stops along the way to stretch and grab food. We made our first stop after 2 hours to stretch our legs and grab some coffee. By 3:00 PM, we had already covered 150 kilometers and were halfway through our journey. The scenery was breathtaking, with mountains on one side and forests on the other. After 6 hours of driving, we stopped for lunch at a small town diner, refueled, and got back on the road. By 7:30 PM, we arrived at our destination, exhausted but happy after a successful road trip, ready to relax after the long drive. ed of 50 multiple-choice questions, 10 short-answer questions, and 3 essay questions. I decided to start with the multiple-choice secti",
    "The test started promptly at 9:00 AM, and we were given 2 hours to complete it. The exam consisted of 50 multiple-choice questions, 10 short-answer questions, and 3 essay questions. I decided to start with the multiple-choice section, finishing it in 30 minutes. By 10:30 AM, I had completed all the short-answer questions and moved on to the essays. I spent the remaining time carefully crafting my responses, ensuring I answered everything thoroughly. At 11:55 AM, I submitted my paper, feeling confident that I had done my best and was ready to relax after such an intense test e first half and felt a surge of confidence. A half hour later, the analysis was complete, and I shifted to drafting t.",
    "The day started at exactly 6:45 a.m., when the alarm went off for the third time. I had already snoozed it twice classic. By 7:10, I was finally out of bed, dragging myself to brush my teeth and get ready for an 8:00 a.m. class. The weather was surprisingly calm, with a light breeze and clouds drifting like they had nowhere to be. I made a quick breakfast just 2 slices of toast and a glass of cold coffee and rushed out s, pretending we were close ndees. The opening act took the stage, performing for 45 minutes and warming up the crowd for the main show. The energy in the room was electric, and the antici. ith the multiple-choice section, finishing it in 30 minutes. By 10:30 AM, I had completed all the short-answer questions and moved on to the essays. I spent the remaining time carefully crafting my responses, ensuring I answered everything thoroughly. At 11:55 AM, I submitted my paper, feeling confident that I had done my best and was ready to relax after such an intense test",
    "College was buzzing as usual. My first class had about 42 students, all half-asleep but trying to look alert. We discussed 3 major topics today, but honestly, I only remember 1 of them clearly. During the break, I met 2 friends near the canteen. We split a plate of fries, joked about yesterday’s lab mishap, and made vague plans to start our project 'soon' we say that every week. ed to start at 6:00 AM, and by 5:30 AM, over 500 runners were gathered at the starting line, all eager to begin. The weather was cool, with temperatures around 15°C, making it ideal for running. The race would span 42 kilometers, and participants were hoping to finish within 4 hours. I had trained for months, pushing myself through countless long runs and rigorous trainin",
    "By noon, I had already checked my phone over 15 times, which is actually less than usual. I replied to 7 messages, ignored 3, and posted a story of my coffee because, why not? In the afternoon lab, we had to debug 4 different pieces of code, and out of everyone, only 1 person actually got it working on the first try. The rest of us just stared at our screens, pretending we were close ndees. The opening act took the stage, performing for 45 minutes and warming up the crowd for the main show. The energy in the room was electric, and the anticipation was building as the headliner prepared to perform. At 9:00 PM, the band took the stage, and the audience erupted in cheers. For the next 90 minutes, they played their greatest hits, and the crowd was fully engaged, singing along to every .",
    "Around 5:30 p.m., I joined a peer coding group. We were supposed to practice 10 DSA questions, but we barely got through 4. Someone started playing lo-fi music, someone else started doodling, and before we knew it, we were deep in a random conversation about AI and whether robots would ever dream. Productivity? Debatable. Vibes? Immaculate. ed to start at 6:00 AM, and by 5:30 AM, over 500 runners were gathered at the starting line, all eager to begin. The weather was cool, with temperatures around 15°C, making it ideal for running. The race would span 42 kilometers, and participants were hoping to finish within 4 hours. I had trained for months, pushing myself through countless l",
    "By 8:00 p.m., I was back in my room, tired but weirdly satisfied. I had ticked off at least 6 tasks from my to-do list, watched 1 episode of my favorite series, and even cleaned my desk sort of. As I got into bed, I thought about how fast the day had gone. Not everything got done, but hey, progress is still progress even if it’s just 1 small step at a time. he sun had just risen, casting a warm glow over the city, and I felt the fresh air fill my lungs as I began my run. I had planned to run 5 kilometers today, aiming to beat my previous record of 30 minutes. The streets were quiet, except for a few other joggers and early risers who were out enjoying the calm of the morning. By 7:30 AM, I had completed 3 kilometers, feeling good and on pace to beat my target. As I pushed myself harder, I was determined to e hoping to finish within 4 hours. I had trained for a match--",
    "At 6 sharp, I headed to the mess hoping dinner wouldn’t be a disaster today The line was already 20 people long and someone ahead of me said the rice was over but they still had 8 rotis left I grabbed 2 and sat with 3 batchmates who were arguing about whether to use React or plain JavaScript for our upcoming mini project We didn't decide anything of course but we did rate the dal a solid 7 out of 10 e test started promptly at 9:00 AM, and we were given 2 hours to complete it. The exam consisted of 50 multiple-choice questions, 10 short-answer questions, and 3 essay questions. I decided to start with the multiple-choice section, finishing it in 30 minutes. By 10:30 AM,",
    "By 8 a few of us went up to the terrace for a quick break before diving into assignments There were 5 of us lying on a mat under the open sky counting stars and spotting 3 satellites Someone mentioned a startup idea they had last semester which had 0 progress but unlimited potential We all laughed and said we’d build it one day maybe after exams maybe after placements maybe neve  7:00 AM, I stepped outside to begin my morning jog. The sun had just risen, casting a warm glow over the city, and I felt the fresh air fill my lungs as I began my run. I had planned to run 5 kilometers today, aiming to beat my previous record of 30 minutes. The streets were quiet, except for a few otr",
    "At 9 I finally opened the assignment portal and realized I had 2 submissions due by midnight I messaged 1 friend asking for help and he replied with a screenshot that made absolutely no sense but somehow helped me get 60 percent of it done I told myself I’d finish the rest in 30 minutes and then scrolled through reels for 40 instead Classi on pace to beat my target. As I pushed myself harder, I was determined to finish the full distance in under 30 minutes. At 7:50 AM, I crossed the 5-kilometer mark, feeling accomplished with a time of 28 minutes, proud of myself for achieving a new personal best.c",
    "Around 10 the hostel common room turned into a FIFA battleground 4 people were locked in an intense match while 6 others were cheering from the beanbags Someone spilled a cold drink on the floor and slipped 2 seconds later and now there's a weird damp patch no one wants to clean Everyone agreed to meet again tomorrow for a rematch same time same chao submissions due by midnight I messaged 1 friend asking for help and he replied with a screenshot that made absolutely no sense but somehow helped me get 60 percent of it done I told myself I’d finish the rest in 30 minutes and then scrolled through reels for 40 instead Classi on pace to beat my target. As I pushed myself harder, I was determined ts",
    "By 1130 I was back at my desk trying to review the 5 key points from today’s lecture but only remembered 2 One of them was about time complexity and the other was just a random meme the prof accidentally showed in class I set 3 alarms for the morning and told myself tomorrow I’d wake up early and be productive Let’s see how that goes made our first stop after 2 hours to stretch our legs and grab some coffee. By 3:00 PM, we had already covered 150 kilometers and were halfway through our journey. The scenery was breathtaking, with mountains on one side and forests on the other. After 6 hours of driving, we--- ith the multiple-choice section, finishing it in 30 minutes. By 10:30 AM, I had completed all the short-answer questions and moved on to the essays. I spent the remaining time carefully crafting my responses, ensuring I answered everything thoroughly. At 11:55 AM, I submitted my paper, feeling confident that I had done my best and was ready to relax after such an intense test-"

  ];

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      setIsLoggedIn(true);
      setShowLogin(false);
      setIsBlurred(false);
      console.log("Logged in as:", user.displayName || user.email);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  const auth = getAuth();

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      setIsLoggedIn(true);
      setShowLogin(false); // Close the login popup
      setShowSignup(false); // Close the signup form
    } catch (error) {
      console.error("Error signing up with email and password", error);
      alert(error.message); // Display error to the user
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      setIsLoggedIn(true);
      setShowLogin(false); // Close the login popup
    } catch (error) {
      console.error("Error signing in with email and password", error);
      alert(error.message); // Display error to the user
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const [showAuthButton, setShowAuthButton] = useState(true);
  const [showFocusButton, setShowFocusButton] = useState(true);
  const [isBlurred, setIsBlurred] = useState(true);
  // const [showButton, setShowButton] = useState(true);
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
  const typingContainerRef = useRef(null);
  const [showThemeOptions, setShowThemeOptions] = useState(false);

  useEffect(() => {
    const typingContainer = typingContainerRef.current;
    if (isBlurred) {
      typingContainer?.classList.add("blurred");
      setShowFocusButton(true);
    } else {
      typingContainer?.classList.remove("blurred");
      // Auto-focus when unblurred
      setTimeout(() => {
        typingContainer?.focus();
      }, 50);
    }
    // setShowFocusButton(isBlurred);
  }, [isBlurred]);

  useEffect(() => {
    const typingContainer = typingContainerRef.current;

    const handleFocus = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    typingContainer?.addEventListener("focus", handleFocus, true);
    return () => {
      typingContainer?.removeEventListener("focus", handleFocus, true);
    };
  }, []);

  const handleFocusClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBlurred(false);
    setShowFocusButton(false);
    setTimeout(() => {
      typingContainerRef.current?.focus();
    }, 50);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown, { passive: false });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
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

  

  const calculateStats = () => {
    const typedWords = typedText.trim().split(/\s+/).length;
    const wpmValue = Math.floor(typedWords / (time / 60));

    let correctCount = 0;
    for (let i = 0; i < Math.min(typedText.length, text.length); i++) {
      if (typedText[i] === text[i]) {
        correctCount++;
      }
    }

    const accuracyValue =
      typedText.length > 0
        ? Math.floor((correctCount / typedText.length) * 100)
        : 0;

    setWpm(wpmValue);
    setAccuracy(accuracyValue);

    // Only update history if time is still running
    if (timerActive && time < selectedTime) {
      setWpmHistory(
        (prev) =>
          prev.length < selectedTime
            ? [...prev, wpmValue]
            : [...prev.slice(1), wpmValue] // Remove oldest entry if exceeding
      );
      setAccuracyHistory((prev) =>
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
      setTestHistory((prev) => {
        const newHistory = [
          ...prev,
          {
            wpm,
            accuracy,
            correctChars,
            totalChars,
            time: selectedTime,
            date: new Date().toISOString(),
          },
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
          ? [
              ...wpmHistory,
              ...Array(selectedTime - wpmHistory.length).fill(
                wpmHistory[wpmHistory.length - 1] || 0
              ),
            ]
          : wpmHistory.slice(0, selectedTime);

      const paddedAccuracyHistory =
        accuracyHistory.length < selectedTime
          ? [
              ...accuracyHistory,
              ...Array(selectedTime - accuracyHistory.length).fill(
                accuracyHistory[accuracyHistory.length - 1] || 100
              ),
            ]
          : accuracyHistory.slice(0, selectedTime);

      const ctx = chartRef.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          
          labels: Array.from({ length: selectedTime }, (_, i) => i + 1), // 1, 2, ..., selectedTime

          datasets: [
            {
              label: "WPM",
              data: paddedWpmHistory,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.1)",
              borderWidth: 2,
              tension: 0.3,
              yAxisID: "y",
              pointRadius: 2, // Smaller points
              pointHoverRadius: 4,
              pointBackgroundColor: "rgb(75, 192, 192)",
            },
            {
              label: "Accuracy %",
              data: paddedAccuracyHistory,
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.1)",
              borderWidth: 2,
              tension: 0.3,
              yAxisID: "y1",
              pointRadius: 2,
              pointHoverRadius: 4,
              pointBackgroundColor: "rgb(255, 99, 132)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false,
          },
          plugins: {
            legend: {
              position: "top",
              labels: {
                boxWidth: 12,
                padding: 20,
                font: {
                  size: 14,
                },
              },
            },
            tooltip: {
              backgroundColor: "rgba(0,0,0,0.8)",
              titleFont: {
                size: 14,
              },
              bodyFont: {
                size: 12,
              },
              padding: 10,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Time (in seconds)",
              },
              ticks: {
                color: "#666",
                font: {
                  size: 12,
                },

                stepSize: 1,
                callback: (val) => val,
              },
              title: {
                display: true,
                text: "Time (seconds)",
                color: "#666",
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
            },
            y: {
              beginAtZero: true,
              type: "linear",
              display: true,
              position: "left",
              grid: {
                color: "rgba(0,0,0,0.05)",
              },
              ticks: {
                color: "#666",
                font: {
                  size: 12,
                },
              },
              title: {
                display: true,
                text: "WPM",
                color: "#666",
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
            },
            y1: {
              type: "linear",
              display: true,
              position: "right",
              min: 0,
              max: 100,
              grid: {
                drawOnChartArea: false,
              },
              ticks: {
                color: "#666",
                font: {
                  size: 12,
                },
              },
              title: {
                display: true,
                text: "Accuracy %",
                color: "#666",
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
            },
          },
        },
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
    const variance =
      wpmHistory.reduce((a, b) => a + Math.pow(b - avg, 2), 0) /
      wpmHistory.length;
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

  const dropdownRef = useRef(null);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowThemeOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="container">
      <div className="auth-container-main">
        {showAuthButton && !isLoggedIn && (
          <button
            onClick={() => setShowLogin(true)}
            className="auth-button primary"
          >
            🔐 Login / Sign Up to play!
          </button>
        )}

        {(showLogin || showSignup) && !isLoggedIn && (
          <div className="auth-modal">
            <div className="auth-content">
              <button
                className="close-button"
                onClick={() => {
                  setShowLogin(false);
                  setShowSignup(false);
                }}
              >
                ×
              </button>

              <h2 style={{ color: "black" }}>{showSignup ? "Create Account" : "Welcome Back"}</h2>

              <form
                onSubmit={showSignup ? handleEmailSignup : handleEmailLogin}
                className="auth-form"
              >
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder={
                      showSignup ? "Choose a password" : "Your password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={showSignup ? "6" : ""}
                  />
                  {showSignup && <small>Minimum 6 characters</small>}
                </div>

                <button type="submit" className="auth-button primary">
                  {showSignup ? "Sign Up" : "Login"}
                </button>
              </form>

              {!showSignup && (
                <>
                  <div className="divider">or</div>
                  <button onClick={handleLogin} className="auth-button google">
                    <img
                      src="https://www.google.com/favicon.ico"
                      alt="Google"
                      width="16"
                    />
                    Continue with Google
                  </button>

                  <div className="auth-footer">
                    Don't have an account?{" "}
                    <button
                      onClick={() => setShowSignup(true)}
                      className="text-button"
                    >
                      Sign up
                    </button>
                  </div>
                </>
              )}

              {showSignup && (
                <div className="auth-footer">
                  Already have an account?{" "}
                  <button
                    onClick={() => setShowSignup(false)}
                    className="text-button"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

        
      {/* </div> */}
      {showFocusButton && (
        <button onClick={handleFocusClick} className="focus-button">
          🔍 Click here to focus
        </button>
      )}
      <div className="header">
  <h1 className="mt-4 typingTest">Typing Test</h1>
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
      
      {isLoggedIn && user && (
        <div className="user-controls-container">
          <div className="horizontal-user-panel">
            <div className="user-info-horizontal">
              <span className="username-horizontal">
                Welcome { user.displayName || user.email.split("@")[0]}
              </span>
            </div>

            <div className="game-actions-horizontal">
              <Link to="/multiplayer" className="game-button-horizontal multiplayer">
                <span className="button-text">🎮 Multiplayer</span>
              </Link>

              <div className="dropdown-container" ref={dropdownRef}>
                <button
                  className="game-button-horizontal"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowThemeOptions(!showThemeOptions);
                  }}
                >
                  <span className="button-text">
                    {showThemeOptions ? "▲" : "▼"} Typing Shooters 🎯
                  </span>
                </button>

                {showThemeOptions && (
                  <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                    <Link
                      to="/game"
                      className="dropdown-item cosmic"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowThemeOptions(false);
                      }}
                    >
                      <span>🚀 Cosmic</span>
                    </Link>
                    <Link
                      to="/jungle"
                      className="dropdown-item jungle"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowThemeOptions(false);
                      }}
                    >
                      <span>🌿 Jungle</span>
                    </Link>
                  </div>
                )}
              </div>

              <button
                onClick={() => auth.signOut().then(() => setIsLoggedIn(false))}
                className="logout-button-horizontal"
              >
                <span className="button-text">⎋ Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}{" "}
            
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
        <div
          className="typing-container"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          ref={typingContainerRef}
        >
          <div className="text">
            {(Array.isArray(text) ? text : text.split("")).map(
              (char, index) => {
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
                    {index === typedText.length - 1 && (
                      <span className="cursor" />
                    )}
                  </span>
                );
              }
            )}
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
              <div className="stat-value">
                {correctChars}/{totalChars}
              </div>
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
              <h3>
                Raw WPM:{" "}
                {Math.floor(
                  (typedText.trim().split(/\s+/).length * 60) / selectedTime
                )}
              </h3>
              <h3>Consistency: {calculateConsistency()}%</h3>
            </div>

            <div className="test-history">
              <h3>Recent Tests</h3>
              {testHistory
                .slice()
                .reverse()
                .map((test, index) => (
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
