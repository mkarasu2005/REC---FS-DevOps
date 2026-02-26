//const API = "http://localhost:4000/api";
const API = "http://127.0.0.1:4000/api";

let token = localStorage.getItem("token");

window.onload = () => {
  if (token) {
    showTasks();
    fetchTasks();
  }
};

function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("auth-message").innerText = data.message;
    });
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        token = data.token;
        showTasks();
        fetchTasks();
      } else {
        document.getElementById("auth-message").innerText = data.message;
      }
    });
}

function showTasks() {
  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("task-section").classList.remove("hidden");
}

function logout() {
  localStorage.removeItem("token");
  location.reload();
}

function createTask() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  fetch(`${API}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title, description })
  })
    .then(res => res.json())
    .then(() => {
      fetchTasks();
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
    });
}

function fetchTasks() {
  fetch(`${API}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(tasks => {
      const list = document.getElementById("task-list");
      list.innerHTML = "";

      tasks.forEach(task => {
        const div = document.createElement("div");
        div.className = "task-item";
        if (task.completed) div.classList.add("completed");

        div.innerHTML = `
          <div>
            <strong>${task.title}</strong>
            <p>${task.description || ""}</p>
          </div>
          <div class="task-buttons">
            <button onclick="toggleTask('${task._id}', ${task.completed})">
              ${task.completed ? "Undo" : "Complete"}
            </button>
            <button class="delete" onclick="deleteTask('${task._id}')">
              Delete
            </button>
          </div>
        `;

        list.appendChild(div);
      });
    });
}

function toggleTask(id, completed) {
  fetch(`${API}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ completed: !completed })
  }).then(() => fetchTasks());
}

function deleteTask(id) {
  fetch(`${API}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(() => fetchTasks());
}