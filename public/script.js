const API_URL = "http://localhost:5000";

// Перемикання вкладок між "Вхід" та "Реєстрація"
function showTab(tab) {
    document.getElementById('login').classList.add('hidden');
    document.getElementById('register').classList.add('hidden');

    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelector(`.tab-btn[onclick="showTab('${tab}')"]`).classList.add("active");

    document.getElementById(tab).classList.remove('hidden');
}

// ✅ Реєстрація
async function register() {
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    if (!name || !email || !password) {
        alert("❌ Заповніть всі поля!");
        return;
    }

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

    if (!email || !password) {
        alert("❌ Введіть email та пароль!");
        return;
    }

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

    const
