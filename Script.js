// Show each stage
function showStage() {
  if (currentStage < questions.length) {
    // Only show up to 8 stages
    if (currentStage >= 8) {
      finishHunt();
      return;
    }

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

    // Check if completed stage 8
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
