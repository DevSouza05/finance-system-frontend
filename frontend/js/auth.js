document.addEventListener('DOMContentLoaded', () => {
    const btnLogin = document.getElementById('btnLogin');
    const btnRegister = document.getElementById('btnRegister');
    const btnLogout = document.getElementById('btnLogout');
    const authMessage = document.getElementById('authMessage');

    const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];
    const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));

    const showMessage = (message, type) => {
        if (authMessage) {
            authMessage.textContent = message;
            authMessage.className = `auth-message ${type} active`;
        }
    };

    // ✅ Registro
    if (btnRegister) {
        btnRegister.addEventListener('click', () => {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!username || !password) {
                return showMessage("⚠️ Preencha todos os campos!", "error");
            }

            const users = getUsers();
            if (users.find(user => user.username === username)) {
                return showMessage("❌ Nome de usuário já existe!", "error");
            }

            users.push({ username, password });
            saveUsers(users);

            // Redirect to login page with a success message indicator
            sessionStorage.setItem('registrationSuccess', 'true');
            window.location.href = "login.html";
        });
    }

    // ✅ Login
    if (btnLogin) {
        // Check for registration success message
        if (sessionStorage.getItem('registrationSuccess')) {
            showMessage("✅ Registro realizado com sucesso! Faça seu login.", "success");
            sessionStorage.removeItem('registrationSuccess');
        }

        btnLogin.addEventListener('click', () => {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!username || !password) {
                return showMessage("⚠️ Preencha todos os campos!", "error");
            }

            const users = getUsers();
            const user = users.find(user => user.username === username && user.password === password);

            if (!user) {
                return showMessage("❌ Usuário ou senha inválidos!", "error");
            }

            sessionStorage.setItem('loggedInUser', user.username);
            showMessage("✅ Login realizado com sucesso!", "success");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500); // Wait 1.5 seconds before redirecting
        });
    }

    // ✅ Logout
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            sessionStorage.removeItem("loggedInUser");
            // Simple alert is fine for logout as the page is changing anyway
            alert("👋 Você saiu da sua conta!");
            window.location.href = "login.html";
        });
    }

    // ✅ Proteção de páginas privadas
    const isProtectedPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('performance.html');
    if (isProtectedPage) {
        const loggedInUser = sessionStorage.getItem("loggedInUser");
        if (!loggedInUser) {
            // alert is fine here as it's a hard stop before page load
            alert("⚠️ Você precisa estar logado!");
            window.location.href = "login.html";
        }
    }
});
