const API_URL = "https://loveplay.onrender.com";

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

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        alert(data.msg);

        if (res.ok) {
            showTab('login');
        }
    } catch (error) {
        console.error("Помилка реєстрації:", error);
        alert("❌ Помилка підключення до сервера.");
    }
}

// ✅ Вхід (авторизація)
async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("❌ Введіть email та пароль!");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem("token", data.token);
            alert("✅ Вхід успішний!");
            window.location.href = "profile.html";
        } else {
            alert(data.msg);
        }
    } catch (error) {
        console.error("Помилка входу:", error);
        alert("❌ Помилка підключення до сервера.");
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

    try {
        const res = await fetch(`${API_URL}/profile`, {
            method: "GET",
            headers: { "x-auth-token": token }
        });

        const data = await res.json();
        if (res.ok) {
            document.getElementById("profileName").textContent = data.name;
            document.getElementById("profileEmail").textContent = data.email;
        } else {
            alert(data.msg);
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Помилка завантаження профілю:", error);
    }
}

// ✅ Вихід
function logout() {
    localStorage.removeItem("token");
    alert("Ви вийшли з акаунту");
    window.location.href = "index.html";
}

// Якщо ми на profile.html, то завантажуємо дані користувача
document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.includes("profile.html")) {
        loadProfile();
    } else {
        showTab('login'); // Встановити вкладку за замовчуванням
    }
});
