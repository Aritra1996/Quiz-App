const questions = [
  {
    questionText: "Commonly used data types DO NOT include:",
    options: ["1. strings", "2. booleans", "3. alerts", "4. numbers"],
    answer: "3. alerts",
  },
  {
    questionText: "Arrays in JavaScript can be used to store ______.",
    options: [
      "1. numbers and strings",
      "2. other arrays",
      "3. booleans",
      "4. all of the above",
    ],
    answer: "4. all of the above",
  },
  {
    questionText:
      "String values must be enclosed within _____ when being assigned to variables.",
    options: ["1. commas", "2. curly brackets", "3. quotes", "4. parentheses"],
    answer: "3. quotes",
  },
  {
    questionText:
      "A very useful tool used during development and debugging for printing content to the debugger is:",
    options: [
      "1. JavaScript",
      "2. terminal/bash",
      "3. for loops",
      "4. console.log",
    ],
    answer: "4. console.log",
  },
  {
    questionText:
      "Which of the following is a statement that can be used to terminate a loop, switch or label statement?",
    options: ["1. break", "2. stop", "3. halt", "4. exit"],
    answer: "1. break",
  },
];

// Get references to the elements
const startButton = document.getElementById('startQuiz');
const main = document.querySelector('main');

// Current question index
let currentQuestionIndex = 0;

// Store the user's answers for scoring
let userAnswers = [];

function handleEndOfQuiz() {
  // Clear the main element
  while(main.firstChild) {
    main.firstChild.remove();
  }

  // Calculate the score
  let score = 0;
  console.log(userAnswers);
  for(let i = 0; i < questions.length; i++) {
    if(userAnswers[i] === questions[i].answer.charAt(0)) {
      score++;
    }
  }

  // Create a new div for the score
  const scoreDiv = document.createElement('div');
  scoreDiv.textContent = `Your score is: ${score}`;
  main.appendChild(scoreDiv);

  // Create a form for the user's name
  const nameForm = document.createElement('form');
  const nameLabel = document.createElement('label');
  nameLabel.textContent = 'Enter your name:';
  nameForm.appendChild(nameLabel);
  const nameInput = document.createElement('input');
  nameForm.appendChild(nameInput);

  // Create a submit button
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';
  submitButton.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form from submitting normally
    // Get the leaderboard data from local storage
    let leaderboard = localStorage.getItem('leaderboard');
    
    // If the leaderboard data is not present, initialize an empty array
    if(!leaderboard) {
      leaderboard = [];
    } else {
      // Parse the leaderboard data to convert it back to an array
      leaderboard = JSON.parse(leaderboard);
    }

    // Create a new leaderboard entry
    const leaderboardEntry = {
      name: nameInput.value,
      score: score
    };

    // Add the new entry to the leaderboard
    leaderboard.push(leaderboardEntry);

    // Store the updated leaderboard data in local storage
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    showLeaderBoard();
  });
  nameForm.appendChild(submitButton);

  // Add the form to the main element
  main.appendChild(nameForm);
}


// Function to display a question
function displayQuestion(questionIndex) {
  // Clear the main element
  while(main.firstChild) {
    main.firstChild.remove();
  }

  // Get the question
  const question = questions[questionIndex];

  // Create a new div for the question
  const questionDiv = document.createElement('div');
  
  // Set the text of the question div
  questionDiv.textContent = question.questionText;

  // Set the id of the question div
  questionDiv.id = "question";

  // Append the question div to the main
  main.appendChild(questionDiv);

  // Loop through the options
  question.options.forEach(function(option, index) {
    // Create a new button for the option
    const optionButton = document.createElement('button');

    // Set the text of the button
    optionButton.textContent = option;

    // Set a data attribute on the button with the option index
    optionButton.setAttribute('data-option', index + 1);

    // Set class name to the option button
    optionButton.classList.add("quiz-option");

    // Add event listener to the button
    optionButton.addEventListener('click', function(event) {
      event.preventDefault();
      // Store the user's answer
      userAnswers[questionIndex] = optionButton.getAttribute('data-option');

      // Create feedback element
      let feedbackDiv = document.getElementById('feedback');

      // Check if the answer was correct
      if (userAnswers[questionIndex] === questions[questionIndex].answer.charAt(0)) {
        // Display "Correct!" for 1 second
        feedbackDiv.textContent = 'Correct!';
        setTimeout(function() {
          feedbackDiv.textContent = '';
        }, 1000);
      } else {
        // Penalize time and display "Incorrect!" for 1 second
        timeLeft -= 10;
        feedbackDiv.textContent = 'Incorrect!';
        setTimeout(function() {
          feedbackDiv.textContent = '';
        }, 1000);
      }

      // Increment the question index
      currentQuestionIndex++;
      
      // Check if there are still questions left
      if(currentQuestionIndex < questions.length) {
        // Display the next question
        displayQuestion(currentQuestionIndex);
      } else {
        // Handle end of quiz
        handleEndOfQuiz();
      }
    });

    // Append the button to the main
    main.appendChild(optionButton);
  });
}

// Timer
let timeLeft = 50;
const timerDisplay = document.getElementById('time-left');

// Update the timer display
function updateTimerDisplay() {
  timerDisplay.textContent = `Time Left: ${timeLeft}`;
}

// Decrease timer every second
function startTimer() {
  const timer = setInterval(function() {
    timeLeft--;
    updateTimerDisplay();

    if(timeLeft <= 0) {
      timeLeft = 0;
      updateTimerDisplay();
      clearInterval(timer);
      handleEndOfQuiz();
    }
  }, 1000);
}

// Get reference to the leaderboard button
const leaderboardButton = document.getElementById('leaderboard');

// Show the leaderboard
function showLeaderBoard() {
  // Clear the main element
  while(main.firstChild) {
    main.firstChild.remove();
  }

  // Get the leaderboard data from local storage
  let leaderboard = localStorage.getItem('leaderboard');

  // If the leaderboard data is not present, initialize an empty array
  if(!leaderboard) {
    leaderboard = [];
  } else {
    // Parse the leaderboard data to convert it back to an array
    leaderboard = JSON.parse(leaderboard);
  }

  // Sort the leaderboard in descending order based on the score
  leaderboard.sort(function(a, b) {
    return b.score - a.score;
  });


  // Create a new table for the leaderboard
  const leaderboardTable = document.createElement('table');

  // Create the table header
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');

  const th1 = document.createElement('th');
  th1.textContent = 'Name';
  const th2 = document.createElement('th');
  th2.textContent = 'Score';

  tr.appendChild(th1);
  tr.appendChild(th2);
  thead.appendChild(tr);
  leaderboardTable.appendChild(thead);

  // Create the table body
  const tbody = document.createElement('tbody');
  leaderboard.forEach(function(entry) {
    const tr = document.createElement('tr');

    const td1 = document.createElement('td');
    td1.textContent = entry.name;
    const td2 = document.createElement('td');
    td2.textContent = entry.score;

    tr.appendChild(td1);
    tr.appendChild(td2);
    tbody.appendChild(tr);
  });
  leaderboardTable.appendChild(tbody);

  // Append the table to the main
  main.appendChild(leaderboardTable);

  // Create 'Reset Quiz' button
  const resetButton = document.createElement('button');
  resetButton.textContent = 'Goto Quiz';
  resetButton.addEventListener('click', function(event) {
    event.preventDefault();
    location.reload(); // Refresh the page
    // localStorage.setItem('leaderboard', JSON.stringify([]));
  });

  // Append the button to the main
  main.appendChild(resetButton);
}

// Handle leaderboard button click
leaderboardButton.addEventListener('click', function(event) {
  event.preventDefault();
  showLeaderBoard();
});


// Handle start button click
startButton.addEventListener('click', function(event) {
  // Start the quiz
  event.preventDefault(); 
  displayQuestion(currentQuestionIndex);
  startTimer();
});
