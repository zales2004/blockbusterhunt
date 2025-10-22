import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const ADMIN_PASS = "blockbuster2025"; // Change before hosting

document.getElementById("loginBtn").addEventListener("click", async () => {
  const code = document.getElementById("adminCode").value.trim();
  if (code !== ADMIN_PASS) return alert("Invalid admin code!");

  document.getElementById("login-section").classList.add("hidden");
  document.getElementById("admin-section").classList.remove("hidden");

  const querySnapshot = await getDocs(collection(db, "teams"));
  const tbody = document.querySelector("#resultsTable tbody");

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const row = `<tr>
      <td>${data.teamName}</td>
      <td>${data.stageReached}</td>
      <td>${new Date(data.timestamp).toLocaleTimeString()}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
});
