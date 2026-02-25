const currentUser = JSON.parse(localStorage.getItem("currentUser"));

const swapRequests = JSON.parse(localStorage.getItem("swapRequests")) || [];

console.log(swapRequests);

const token = localStorage.getItem("token");

if (!token) {
  alert("Please login first");
  window.location.href = "login.html";
}

if (!currentUser) {
  window.location.href = "login.html";
}

document.getElementById("welcomeUser").textContent =
  "Welcome, " + currentUser.name;

let duties = JSON.parse(localStorage.getItem("duties")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

if (window.location.pathname.includes("admin-dashboard")) {
  document.querySelector(".card:nth-child(1) p").textContent = users.length;
  document.querySelector(".card:nth-child(2) p").textContent = duties.length;
  document.querySelector(".card:nth-child(3) p").textContent = duties.filter(
    (d) => d.status === "pending",
  ).length;

  const dutyForm = document.getElementById("dutyForm");

  dutyForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("dutyTitle").value;
    const date = document.getElementById("dutyDate").value;

    const newDuty = {
      id: Date.now(),
      title,
      date,
      status: "unassigned",
      assignedTo: null,
    };

    duties.push(newDuty);
    localStorage.setItem("duties", JSON.stringify(duties));
    alert("Duty Created");
    location.reload();
  });

  const dutySelect = document.getElementById("dutySelect");
  const userSelect = document.getElementById("userSelect");

  function loadData() {
    dutySelect.innerHTML = duties
      .filter((d) => !d.assignedTo)
      .map((d) => `<option value="${d.id}">${d.title}</option>`)
      .join("");

    userSelect.innerHTML = users
      .filter((u) => u.role === "user")
      .map((u) => `<option value="${u.email}">${u.name}</option>`)
      .join("");
  }

  loadData();

  document
    .getElementById("assignForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const dutyId = Number(dutySelect.value);
      const email = userSelect.value;

      const duty = duties.find((d) => d.id === dutyId);
      duty.assignedTo = email;
      duty.status = "pending";

      localStorage.setItem("duties", JSON.stringify(duties));
      alert("Assigned");
      location.reload();
    });
}

if (window.location.pathname.includes("user-dashboard")) {
  const userDuties = duties.filter((d) => d.assignedTo === currentUser.email);

  document.querySelector(".card:nth-child(1) p").textContent =
    userDuties.length;

  document.querySelector(".card:nth-child(2) p").textContent =
    userDuties.filter((d) => d.status === "completed").length;

  document.querySelector(".card:nth-child(3) p").textContent =
    userDuties.filter((d) => d.status === "pending").length;

  const list = document.getElementById("userDutyList");

  list.innerHTML = userDuties
    .map(
      (d) => `
            <div class="duty-item">
                <strong>${d.title}</strong>
                <span>${d.date}</span>
                <span>${d.status}</span>
                ${
                  d.status === "pending"
                    ? `<button onclick="completeDuty(${d.id})">Complete</button>`
                    : ""
                }
            </div>
        `,
    )
    .join("");
}

function completeDuty(id) {
  const duty = duties.find((d) => d.id === id);
  duty.status = "completed";
  localStorage.setItem("duties", JSON.stringify(duties));
  location.reload();
}

function showSection(sectionId) {
  document.querySelectorAll(".section").forEach((section) => {
    section.style.display = "none";
  });

  document.getElementById(sectionId).style.display = "block";

  if (sectionId === "completed") {
    loadCompletedDuties();
  }
}

function loadCompletedDuties() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const duties = JSON.parse(localStorage.getItem("duties")) || [];

  const completed = duties.filter(
    (d) => d.assignedTo === currentUser.email && d.status === "completed",
  );

  const completedList = document.getElementById("completedList");

  completedList.innerHTML = completed
    .map(
      (d) => `
    <div class="duty-item">
      <strong>${d.title}</strong>
      <span>${d.date}</span>
      <span style="color:green;">Completed</span>
    </div>
  `,
    )
    .join("");
}

function requestSkip() {
  const dutyId = document.getElementById("skipDutySelect").value;
  const reason = document.getElementById("skipReason").value;

  const skipRequests = JSON.parse(localStorage.getItem("skipRequests")) || [];

  skipRequests.push({
    dutyId,
    reason,
    date: new Date().toLocaleDateString(),
  });

  localStorage.setItem("skipRequests", JSON.stringify(skipRequests));

  alert("Skip request sent!");
  loadSkipHistory();
}

function loadSkipHistory() {
  const skipRequests = JSON.parse(localStorage.getItem("skipRequests")) || [];

  const historyDiv = document.getElementById("skipHistory");

  historyDiv.innerHTML = skipRequests
    .map(
      (s) => `
    <div>
      <p>Reason: ${s.reason}</p>
      <small>Date: ${s.date}</small>
    </div>
  `,
    )
    .join("");
}

function requestSwap() {
  const dutyId = document.getElementById("swapDutySelect").value;
  const reason = document.getElementById("swapReason").value;
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const swapRequests = JSON.parse(localStorage.getItem("swapRequests")) || [];

  swapRequests.push({
    dutyId,
    requestedBy: currentUser.email,
    reason,
    status: "pending",
    date: new Date().toLocaleDateString(),
  });

  localStorage.setItem("swapRequests", JSON.stringify(swapRequests));

  alert("Swap request sent to Admin!");
}
