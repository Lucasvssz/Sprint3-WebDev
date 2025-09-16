class LoginSystem {
    constructor() {
        this.loginForm = document.getElementById("loginForm");
        this.emailInput = document.getElementById("email");
        this.passwordInput = document.getElementById("password");
        this.showPasswordBtn = document.getElementById("showPassword");
        this.loginBtn = document.getElementById("loginBtn");
        this.loadingSpinner = document.getElementById("loadingSpinner");
        this.errorMessage = document.getElementById("errorMessage");
        this.successMessage = document.getElementById("successMessage");
        this.demoList = document.getElementById("demoList"); // Lista para exibir emails da API

        this.bindEvents();
        this.loadDemoEmails();
    }

    bindEvents() {
        if (this.loginForm) {
            this.loginForm.addEventListener("submit", (e) => this.handleLogin(e));
        }

        if (this.showPasswordBtn) {
            this.showPasswordBtn.addEventListener("click", () => this.togglePasswordVisibility());
        }

        if (this.emailInput) this.emailInput.addEventListener("input", () => this.clearMessages());
        if (this.passwordInput) this.passwordInput.addEventListener("input", () => this.clearMessages());
    }

    async loadDemoEmails() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/users");
            const users = await response.json();

            if (this.demoList) {
                this.demoList.innerHTML = users
                    .slice(0, 5) // mostra só os 5 primeiros para não poluir
                    .map(u => `<li>${u.email}</li>`)
                    .join("");
            }
        } catch (err) {
            console.error("Erro ao carregar emails da API:", err);
        }
    }

    async handleLogin(event) {
        event.preventDefault();

        const email = (this.emailInput?.value || "").trim();
        const password = this.passwordInput?.value || "";

        if (!this.validateFields(email, password)) return;

        this.showLoading(true);
        this.clearMessages();

        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/users");
            const users = await response.json();

            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (user && password === "123456") {
                this.loginSuccess(user.name);
            } else {
                this.loginFailure();
            }
        } catch (err) {
            this.showError("Erro ao conectar com a API.");
            console.error(err);
        } finally {
            this.showLoading(false);
        }
    }

    validateFields(email, password) {
        if (!email || !password) {
            this.showError("Por favor, preencha todos os campos.");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError("Por favor, insira um email válido.");
            return false;
        }

        if (password.length < 6) {
            this.showError("A senha deve ter pelo menos 6 caracteres.");
            return false;
        }

        return true;
    }

    loginSuccess(userName) {
        this.showSuccess(`Bem-vindo, ${userName}! Redirecionando...`);
        setTimeout(() => window.location.href = "../index.html", 1500);
    }

    loginFailure() {
        this.showError("Email ou senha inválidos!");
        if (this.passwordInput) this.passwordInput.value = "";
    }

    togglePasswordVisibility() {
        if (!this.passwordInput) return;
        const isPassword = this.passwordInput.type === "password";
        this.passwordInput.type = isPassword ? "text" : "password";

        const icon = this.showPasswordBtn?.querySelector("i");
        if (icon) icon.className = isPassword ? "fas fa-eye-slash" : "fas fa-eye";
    }

    showLoading(show) {
        if (this.loadingSpinner) this.loadingSpinner.style.display = show ? "inline-block" : "none";
        if (this.loginBtn) this.loginBtn.disabled = show;
    }

    showError(message) {
        if (this.errorMessage) {
            this.errorMessage.textContent = message;
            this.errorMessage.style.display = "block";
        }
        if (this.successMessage) this.successMessage.style.display = "none";
    }

    showSuccess(message) {
        if (this.successMessage) {
            this.successMessage.textContent = message;
            this.successMessage.style.display = "block";
        }
        if (this.errorMessage) this.errorMessage.style.display = "none";
    }

    clearMessages() {
        if (this.errorMessage) this.errorMessage.style.display = "none";
        if (this.successMessage) this.successMessage.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", () => new LoginSystem());
