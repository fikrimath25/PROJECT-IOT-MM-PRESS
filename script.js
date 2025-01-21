const authForm = document.getElementById('auth-form');
const loginContainer = document.getElementById('login-container');
const controlContainer = document.getElementById('control-container');
const logoutButton = document.getElementById('logout-button');

const lampToggle = document.getElementById('lamp-toggle');
const acToggle = document.getElementById('ac-toggle');
const lampStatus = document.getElementById('lamp-status');
const acStatus = document.getElementById('ac-status');

const notification = document.getElementById('notification');
const rememberMeCheckbox = document.getElementById('remember-me');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Predefined Users
const users = [
    { username: 'fikrijf2006@gmail.com', password: 'Juanda2006' },
    { username: 'Maintenance Press.White', password: 'Zenix123' },
    { username: 'admin@example.com', password: 'AdminPass' },
    { username: 'guest@example.com', password: 'GuestAccess' }
];

// Check if there's stored data for remember me
window.onload = () => {
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';

    if (rememberMe) {
        usernameInput.value = savedUsername;
        passwordInput.value = savedPassword;
        rememberMeCheckbox.checked = true;
    }
};

// Form Submission Handler
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        notification.textContent = "Login berhasil!";
        notification.className = "notification success";
        notification.style.display = "block";

        if (rememberMeCheckbox.checked) {
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('username');
            localStorage.removeItem('password');
            localStorage.removeItem('rememberMe');
        }

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
    }
});

// Lamp Control
lampToggle.addEventListener('click', () => {
    lampToggle.classList.toggle('on');
    lampToggle.classList.toggle('off');
    lampToggle.textContent = lampToggle.classList.contains('on') ? 'ON' : 'OFF';
});

// AC Control
acToggle.addEventListener('click', () => {
    acToggle.classList.toggle('on');
    acToggle.classList.toggle('off');
    acToggle.textContent = acToggle.classList.contains('on') ? 'ON' : 'OFF';
    acStatus.classList.toggle('active', acToggle.classList.contains('on'));
});
