// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDJiQDVNWhepHS26jcmjvU_AZKaxYiGwtg",
    authDomain: "iot-control-app-90f56.firebaseapp.com",
    databaseURL: "https://iot-control-app-90f56-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "iot-control-app-90f56",
    storageBucket: "iot-control-app-90f56.firebasestorage.app",
    appId: "1:893825386246:web:36f7f025c5698314480087",
    measurementId: "G-N6LWRY50PC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// DOM Elements
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

// Check Remember Me on Load
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

// Login Form Submission
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, username, password)
        .then(() => {
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
        })
        .catch((error) => {
            notification.textContent = "Login gagal! " + error.message;
            notification.className = "notification error";
            notification.style.display = "block";

            setTimeout(() => {
                notification.style.display = "none";
            }, 2000);
        });
});

// Logout Functionality
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

    // Logic to send lamp state to Firebase or ESP32
});

// AC Control
acToggle.addEventListener('click', () => {
    acToggle.classList.toggle('on');
    acToggle.classList.toggle('off');
    acToggle.textContent = acToggle.classList.contains('on') ? 'ON' : 'OFF';
    acStatus.classList.toggle('active', acToggle.classList.contains('on'));

    // Logic to send AC state to Firebase or ESP32
});
