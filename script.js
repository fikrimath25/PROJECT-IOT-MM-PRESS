const authForm = document.getElementById('auth-form');
const loginContainer = document.getElementById('login-container');
const controlContainer = document.getElementById('control-container');
const logoutButton = document.getElementById('logout-button');

const lampToggle = document.getElementById('lamp-toggle');
const acToggle = document.getElementById('ac-toggle');
const lampStatus = document.getElementById('lamp-status');
const acStatus = document.getElementById('ac-status');

const notification = document.getElementById('notification');
const rememberMeCheckbox = document.getElementById('rememberMe');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

let lampActive = false;
let acActive = false;

// Predefined Users
const users = [
    { username: 'fikrijf2006@gmail.com', password: 'Juanda2006' },
    { username: 'Maintenance Press.White', password: 'Zenix123' },
    { username: 'admin@example.com', password: 'AdminPass' },
    { username: 'guest@example.com', password: 'GuestAccess' }
];

// Load Remember Me Data
document.addEventListener('DOMContentLoaded', () => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const isRemembered = localStorage.getItem('rememberMe') === 'true';

    if (savedUsername && savedPassword && isRemembered) {
        usernameInput.value = savedUsername;
        passwordInput.value = savedPassword;
        rememberMeCheckbox.checked = true;
    }
});

// Form Submission Handler
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        if (rememberMeCheckbox.checked) {
            localStorage.setItem('rememberedUsername', username);
            localStorage.setItem('rememberedPassword', password);
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('rememberedUsername');
            localStorage.removeItem('rememberedPassword');
            localStorage.removeItem('rememberMe');
        }

        notification.textContent = "Login berhasil!";
        notification.className = "notification success";
        notification.style.display = "block";

        setTimeout(() => {
            loginContainer.classList.add('hidden');
            controlContainer.classList.remove('hidden');
            notification.style.display = "none";
        }, 1000);
    } else {
        notification.textContent = "Login gagal! Username atau password salah.";
        notification.className = "notification error";
        notification.style.display = "block";

        setTimeout(() => {
            notification.style.display = "none";
        }, 2000);
    }
});

// Logout Button Handler
logoutButton.addEventListener('click', () => {
    if (confirm("Apakah Anda yakin ingin logout?")) {
        controlContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
        // Clear Remember Me Data on Logout
        localStorage.removeItem('rememberedUsername');
        localStorage.removeItem('rememberedPassword');
        localStorage.removeItem('rememberMe');
    }
});

// Lamp Control
lampToggle.addEventListener('click', () => {
    lampActive = !lampActive;
    lampToggle.classList.toggle('on', lampActive);
    lampToggle.classList.toggle('off', !lampActive);
    lampToggle.textContent = lampActive ? 'ON' : 'OFF';
});

// AC Control
acToggle.addEventListener('click', () => {
    acActive = !acActive;
    acToggle.classList.toggle('on', acActive);
    acToggle.classList.toggle('off', !acActive);
    acToggle.textContent = acActive ? 'ON' : 'OFF';
    acStatus.classList.toggle('active', acActive);
});
