const authForm = document.getElementById('auth-form');
const loginContainer = document.getElementById('login-container');
const controlContainer = document.getElementById('control-container');
const logoutButton = document.getElementById('logout-button');

const lampToggle = document.getElementById('lamp-toggle');
const acToggle = document.getElementById('ac-toggle');
const lampStatus = document.getElementById('lamp-status');
const acStatus = document.getElementById('ac-status');

const notification = document.getElementById('notification');

let lampActive = false;
let acActive = false;

// Predefined Users
const users = [
    { username: 'fikrijf2006@gmail.com', password: 'Juanda2006' },
    { username: 'Maintenance Press.White', password: 'Zenix123' },
    { username: 'admin@example.com', password: 'AdminPass' },
    { username: 'guest@example.com', password: 'GuestAccess' }
];

// Form Submission Handler
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
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
    }
});

// Lamp Control
lampToggle.addEventListener('click', () => {
    lampActive = !lampActive;
    lampToggle.textContent = lampActive ? 'Nyala' : 'Mati';
    lampStatus.classList.toggle('active', lampActive);
});

// AC Control
acToggle.addEventListener('click', () => {
    acActive = !acActive;
    acToggle.textContent = acActive ? 'Nyala' : 'Mati';
    acStatus.classList.toggle('active', acActive);
});
