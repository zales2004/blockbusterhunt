import { db } from "./Firebase.js"; // Ensure file name matches exactly
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let teamName = "";
let teamEmail = "";
let currentStage = 0;
let questions = [];
let retryCount = 0;
const hintThreshold = 5;

// Meme arrays
const correctMemes = [
  "./assets/correct1.jpg",
  "./assets/correct2.jpg"
];

const wrongMemes = [
  "./assets/wrong1.jpg",
  "./assets/wrong2.jpg",
  "./assets/wrong3.jpg",
  "./assets/wrong4.jpg",
  "./assets/wrong5.jpg",
  "./assets/wrong6.jpg"
];

const memeContainer = document.getElementById("meme-container");
const memeImg = document.getElementById("meme-img");

// Load questions
async function loadQuestions() {
  const res = await fetch("./ques.json");
  questions = await res.json();
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return emailRegex.test(email);
}

// Start Hunt button
document.getElementById("startBtn").addEventListener("click", () => {
  console.log("Start Hunt clicked"); // Debug
  teamName = document.getElementById("teamName").value.trim();
  teamEmail = document.getElementById("teamEmail").value.trim();

  if (!teamName || teamName.length < 3) {
    alert("Please enter a valid team name (at least 3 characters)");
    return;
  }

  if (!teamEmail) {
    alert("Please enter your Gmail!");
    return;
  }

  if (!isValidEmail(teamEmail)) {
    alert("Please enter a valid Gmail (example@gmail.com)");
    return;
  }

  document.getElementById("team-section").classList.add("hidden");
  document.getElementById("quiz-section").classList.remove("hidden");

  retryCount = 0;
  loadQuestions().then(showStage);
});

// Show each stage
function showStage() {
  if (currentStage < questions.length) {
    document.getElementById("stage").innerText = `Stage ${questions[currentStage].stage}`;
    document.getElementById("question").innerText = questions[currentStage].question;
    document.getElementById("answer").value = "";
    document.getElementById("feedback").innerText = "";
    retryCount = 0;
    memeContainer.classList.add("hidden");
  } else {
    finishHunt();
  }
}

// Submit answer
document.getElementById("submitBtn").addEventListener("click", async () => {
  const answerInput = document.getElementById("answer");
  const userAnswer = answerInput.value.trim().toLowerCase();

  if (!userAnswer) return alert("Please enter an answer before submitting!");

  const correctAnswer = questions[currentStage].answer.toLowerCase();
  memeContainer.classList.remove("hidden");

  if (userAnswer === correctAnswer) {
    memeImg.src = correctMemes[Math.floor(Math.random() * correctMemes.length)];
    document.getElementById("feedback").innerText = "✅ Correct! Moving to next stage...";
    await saveProgress(teamName, teamEmail, questions[currentStage].stage);
    currentStage++;
    setTimeout(showStage, 1500);
  } else {
    retryCount++;
    memeImg.src = wrongMemes[Math.floor(Math.random() * wrongMemes.length)];
    let feedbackMessage = `❌ Wrong answer. Try again! (Attempt ${retryCount})`;
    if (retryCount >= hintThreshold) {
      const hint = questions[currentStage].hint || "Think carefully!";
      feedbackMessage += ` 💡 Hint: ${hint}`;
    }
    document.getElementById("feedback").innerText = feedbackMessage;
    answerInput.value = "";
  }
});

// Save progress to Firebase
async function saveProgress(team, email, stage) {
  try {
    await setDoc(doc(db, "teams", team), {
      teamName: team,
      teamEmail: email,
      stageReached: stage,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Error saving progress:", e);
  }
}

// Finish Hunt
function finishHunt() {
  document.getElementById("quiz-section").classList.add("hidden");
  document.getElementById("completed-section").classList.remove("hidden");
  document.getElementById("finalMessage").innerHTML = `
    🎉 <strong>Congratulations, ${teamName}!</strong><br><br>
    You have successfully completed all 9 stages of the <strong>Blockbuster Hunt</strong>.<br>
    Your performance demonstrates incredible teamwork, intelligence, and a true passion for cinema.<br><br>
    Well done, and thank you for being part of this cinematic journey! 🍿🏆
  `;
}
