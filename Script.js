import { db } from "./Firebase.js"; // Make sure file name matches exactly
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Game state
let teamName = "";
let teamEmail = "";
let currentStage = 0;
let questions = [];
let retryCount = 0;
const hintThreshold = 8;

// Meme arrays
const correctMemes = [
  "./assets/correct1.jpg",
  "./assets/correct2.jpg",
  "./assets/correct3.jpg",
  "./assets/correct4.jpg",
  "./assets/correct5.jpg",
  "./assets/correct6.jpg",
  "./assets/correct7.jpg",
  "./assets/correct8.jpg"
];

const wrongMemes = [
  "./assets/wrong1.jpg",
  "./assets/wrong2.jpg",
  "./assets/wrong3.jpg",
  "./assets/wrong4.jpg",
  "./assets/wrong5.jpg",
  "./assets/wrong6.jpg",
  "./assets/wrong7.jpg",
  "./assets/wrong8.jpg"
];

const memeContainer = document.getElementById("meme-container");
const memeImg = document.getElementById("meme-img");

// Load questions from JSON
async function loadQuestions() {
  try {
    const res = await fetch("./ques.json");
    if (!res.ok) throw new Error("Failed to fetch ques.json");

    const data = await res.json();
    questions = data.questions; // IMPORTANT: use the array inside "questions"
    console.log("Questions loaded:", questions);
  } catch (err) {
    console.error("Error loading questions:", err);
    alert("Failed to load questions. Check console for details.");
  }
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return emailRegex.test(email);
}

// Start Hunt button
document.getElementById("startBtn").addEventListener("click", () => {
  teamName = document.getElementById("teamName").value.trim();
  teamEmail = document.getElementById("teamEmail").value.trim();

  if (!teamName || teamName.length < 3) {
    return alert("Please enter a valid team name (at least 3 characters)");
  }

  if (!teamEmail || !isValidEmail(teamEmail)) {
    return alert("Please enter a valid Gmail (example@gmail.com)");
  }

  document.getElementById("team-section").classList.add("hidden");
  document.getElementById("quiz-section").classList.remove("hidden");

  retryCount = 0;
  loadQuestions().then(showStage);
});

// Show current stage
function showStage() {
  if (currentStage >= 8) { // only 8 stages
    finishHunt();
    return;
  }

  const stageData = questions[currentStage];
  document.getElementById("stage").innerText = `Stage ${stageData.stage}`;
  document.getElementById("question").innerText = stageData.question;
  document.getElementById("answer").value = "";
  document.getElementById("feedback").innerText = "";
  retryCount = 0;
  memeContainer.classList.add("hidden");
}

// ✅ Submit answer with multiple answer support
document.getElementById("submitBtn").addEventListener("click", async () => {
  const answerInput = document.getElementById("answer");
  const userAnswer = answerInput.value.trim().toLowerCase();

  if (!userAnswer) return alert("Please enter an answer before submitting!");

  // Get and normalize correct answers
  let correctAnswers = questions[currentStage].answer;
  if (typeof correctAnswers === "string") {
    correctAnswers = correctAnswers.split(",").map(a =>
      a.trim().toLowerCase().replace(/[\s-]+/g, "") // remove spaces/hyphens
    );
  }

  // Normalize user input too
  const normalizedUser = userAnswer.replace(/[\s-]+/g, "");

  memeContainer.classList.remove("hidden");

  // Check match
  const isCorrect = correctAnswers.some(ans => ans === normalizedUser);

  if (isCorrect) {
    memeImg.src = correctMemes[Math.floor(Math.random() * correctMemes.length)];
    document.getElementById("feedback").innerText = "✅ Correct! Moving to next stage...";
    await saveProgress(teamName, teamEmail, questions[currentStage].stage);
    currentStage++;

    if (currentStage >= 8) {
      finishHunt();
    } else {
      setTimeout(showStage, 1500);
    }
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

// Finish hunt
function finishHunt() {
  document.getElementById("quiz-section").classList.add("hidden");
  document.getElementById("completed-section").classList.remove("hidden");
  document.getElementById("finalMessage").innerHTML = `
    🎉 <strong>Congratulations, ${teamName}!</strong><br><br>
    You have successfully completed all 8 stages of the <strong>Blockbuster Hunt</strong>.<br>
    Your performance demonstrates incredible teamwork, intelligence, and a true passion for cinema.<br><br>
    Well done, and thank you for being part of this cinematic journey! 🍿🏆
  `;
}
