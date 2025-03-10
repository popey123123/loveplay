const API_URL = "http://localhost:5000";

// ✅ Реєстрація
async function register() {
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    alert(data.msg);
}

// ✅ Вхід (авторизація)
async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.token) {
        localStorage.setItem("token", data.token);
        alert("✅ Вхід успішний!");
        window.location.href = "profile.html";
    } else {
        alert(data.msg);
    }
}

// ✅ Завантаження профілю
async function loadProfile() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("❌ Ви не авторизовані!");
        window.location.href = "index.html";
        return;
    }

    const res = await fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: { "x-auth-token": token }
    });

    const data = await res.json();
    document.getElementById("profileName").textContent = data.name;
    document.getElementById("profileEmail").textContent = data.email;
}

// ✅ Оновлення профілю
async function updateProfile() {
    const token = localStorage.getItem("token");
    const name = document.getElementById("updateName").value;
    const email = document.getElementById("updateEmail").value;
    const password = document.getElementById("updatePassword").value;

    const res = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    alert("✅ Профіль оновлено!");
    loadProfile();
}

// ✅ Вихід
function logout() {
    localStorage.removeItem("token");
    alert("Ви вийшли з акаунту");
    window.location.href = "index.html";
}

// Якщо ми на profile.html, то завантажуємо дані користувача
if (window.location.pathname.includes("profile.html")) {
    loadProfile();
}
