import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDJiQDVNWhepHS26jcmjvU_AZKaxYiGwtg",
    authDomain: "iot-control-app-90f56.firebaseapp.com",
    databaseURL: "https://iot-control-app-90f56-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "iot-control-app-90f56",
    storageBucket: "iot-control-app-90f56.firebasestorage.app",
    messagingSenderId: "893825386246",
    appId: "1:893825386246:web:fe493d446bcc6a8e480087",
    measurementId: "G-PWS1VY6JZT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        // Firebase Authentication
        await auth.signInWithEmailAndPassword(username, password);

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
    } catch (error) {
        notification.textContent = "Login gagal! " + error.message;
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
        auth.signOut().then(() => {
            controlContainer.classList.add('hidden');
            loginContainer.classList.remove('hidden');
        });
    }
});

lampToggle.addEventListener('click', () => {
    const isOn = lampToggle.classList.toggle('on');
    lampToggle.classList.toggle('off');
    lampToggle.textContent = isOn ? 'ON' : 'OFF';

    // Update lamp state in Firebase Database
    const lampRef = ref(database, 'lamp');
    set(lampRef, isOn);
});

acToggle.addEventListener('click', () => {
    const isOn = acToggle.classList.toggle('on');
    acToggle.classList.toggle('off');
    acToggle.textContent = isOn ? 'ON' : 'OFF';

    // Update AC state in Firebase Database
    const acRef = ref(database, 'ac');
    set(acRef, isOn);
});

