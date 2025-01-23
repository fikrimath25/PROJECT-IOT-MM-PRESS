import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";  // Firebase Database

const firebaseConfig = {
    apiKey: "AIzaSyA0bcsQKgj7SL17-l8c2DByCvmfP5YCmV8",
    authDomain: "project-1-b1010.firebaseapp.com",
    databaseURL: "https://project-1-b1010-default-rtdb.firebaseio.com",
    projectId: "project-1-b1010",
    storageBucket: "project-1-b1010.firebasestorage.app",
    messagingSenderId: "211606819963",
    appId: "1:211606819963:web:e5203230876690e42efede"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);  // Firebase Database

import { onValue } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

// Sinkronisasi status Lampu
onValue(ref(db, 'LAMP1'), (snapshot) => {
    const lampStatus = snapshot.val();
    if (lampStatus) {
        lampToggle.classList.add('on');
        lampToggle.classList.remove('off');
        lampToggle.textContent = 'ON';
    } else {
        lampToggle.classList.add('off');
        lampToggle.classList.remove('on');
        lampToggle.textContent = 'OFF';
    }
});

// Sinkronisasi status AC
onValue(ref(db, 'LAMP2'), (snapshot) => {
    const acStatus = snapshot.val();
    if (acStatus) {
        acToggle.classList.add('on');
        acToggle.classList.remove('off');
        acToggle.textContent = 'ON';
    } else {
        acToggle.classList.add('off');
        acToggle.classList.remove('on');
        acToggle.textContent = 'OFF';
    }
});

// Elemen DOM
const authForm = document.getElementById('auth-form');
const loginContainer = document.getElementById('login-container');
const loginContainer1 = document.getElementById('login-container1');
const controlContainer = document.getElementById('control-container');
const logoutButton = document.getElementById('logout-button');

const lampToggle = document.getElementById('lamp-toggle');
const acToggle = document.getElementById('ac-toggle');

const notification = document.getElementById('notification');
const rememberMeCheckbox = document.getElementById('remember-me');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Cek jika rememberMe disimpan di localStorage dan isi input
if (localStorage.getItem('rememberMe') === 'true') {
    emailInput.value = localStorage.getItem('email');
    passwordInput.value = localStorage.getItem('password');
    rememberMeCheckbox.checked = true;
}

// Handler Form Login
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    // Firebase Authentication SignIn
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Login berhasil
            const user = userCredential.user;
            notification.textContent = "Login berhasil!";
            notification.className = "notification success";
            notification.style.display = "block";

            // Menangani fitur Remember Me
            if (rememberMeCheckbox.checked) {
                localStorage.setItem('email', email);
                localStorage.setItem('password', password);
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('email');
                localStorage.removeItem('password');
                localStorage.removeItem('rememberMe');
            }
            loginContainer1.classList.add('hidden');
            // Arahkan ke halaman kontrol setelah 1 detik
            setTimeout(() => {
                loginContainer.classList.add('hidden');
                controlContainer.classList.remove('hidden');
                notification.style.display = "none";
            }, 1000);
        })
        .catch((error) => {
            // Login gagal
            notification.textContent = "Login gagal! " + error.message;
            notification.className = "notification error";
            notification.style.display = "block";

            setTimeout(() => {
                notification.style.display = "none";
            }, 3000);
        });
});

// Handler Logout
logoutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        controlContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
        loginContainer1.classList.remove('hidden');
        notification.textContent = "Logout berhasil!";
        notification.className = "notification success";
        notification.style.display = "block";

        setTimeout(() => {
            notification.style.display = "none";
        }, 2000);
    }).catch((error) => {
        notification.textContent = "Logout gagal! " + error.message;
        notification.className = "notification error";
        notification.style.display = "block";
    });
});

// Cek Status Autentikasi Pengguna
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Pengguna sudah login
        loginContainer.classList.add('hidden');
        controlContainer.classList.remove('hidden');
    } else {
        // Pengguna belum login
        controlContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    }
});

// Kontrol Lampu dan AC
lampToggle.addEventListener('click', () => {
    lampToggle.classList.toggle('on');
    lampToggle.classList.toggle('off');
    lampToggle.textContent = lampToggle.classList.contains('on') ? 'ON' : 'OFF';
    
    // Update status Lampu di Firebase
    const lampStatus = lampToggle.classList.contains('on');  // true jika ON, false jika OFF
    set(ref(db, 'LAMP1'), lampStatus)
        .then(() => {
            console.log('Lampu 1 status berhasil diperbarui di Firebase');
        })
        .catch((error) => {
            console.error('Gagal memperbarui status Lampu 1 di Firebase', error);
        });
});

acToggle.addEventListener('click', () => {
    acToggle.classList.toggle('on');
    acToggle.classList.toggle('off');
    acToggle.textContent = acToggle.classList.contains('on') ? 'ON' : 'OFF';
    
    // Update status AC di Firebase
    const acStatus = acToggle.classList.contains('on');  // true jika ON, false jika OFF
    set(ref(db, 'LAMP2'), acStatus)
        .then(() => {
            console.log('AC status berhasil diperbarui di Firebase');
        })
        .catch((error) => {
            console.error('Gagal memperbarui status AC di Firebase', error);
        });
});
