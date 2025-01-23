import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";  // Firebase Database

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
            const user = userCredential.user;
            notification.textContent = "Login berhasil!";
            notification.className = "notification success";
            notification.style.display = "block";
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
        loginContainer.classList.add('hidden');
        controlContainer.classList.remove('hidden');
    } else {
        controlContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    }
});

// Sinkronisasi status Lampu 1
onValue(ref(db, 'LAMP1'), (snapshot) => {
    const lampStatus = snapshot.val();
    updateToggleStatus(lampToggle, lampStatus);
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

// Sinkronisasi status Lampu 2 (AC)
onValue(ref(db, 'LAMP2'), (snapshot) => {
    const acStatus = snapshot.val();
    updateToggleStatus(acToggle, acStatus);
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

// Fungsi untuk memperbarui status tombol
function updateToggleStatus(element, status) {
    if (status) {
        element.classList.add('on');
        element.classList.remove('off');
        element.textContent = 'ON';
    } else {
        element.classList.add('off');
        element.classList.remove('on');
        element.textContent = 'OFF';
    }
}

// Kontrol Lampu 1
lampToggle.addEventListener('click', () => {
    const lampStatus = lampToggle.classList.contains('on');
    set(ref(db, 'LAMP1'), !lampStatus).then(() => {
        console.log('Lampu 1 status berhasil diperbarui di Firebase');
    }).catch((error) => {
        console.error('Gagal memperbarui status Lampu 1 di Firebase', error);
    });
});

// Kontrol Lampu 2
acToggle.addEventListener('click', () => {
    const acStatus = acToggle.classList.contains('on');
    set(ref(db, 'LAMP2'), !acStatus).then(() => {
        console.log('Lampu 2 status berhasil diperbarui di Firebase');
    }).catch((error) => {
        console.error('Gagal memperbarui status Lampu 2 di Firebase', error);
    });
});


