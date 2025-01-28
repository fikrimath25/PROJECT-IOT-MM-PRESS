import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

//Konfigurasi Firebase
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

document.addEventListener("DOMContentLoaded", () => {
    const body = document.getElementById('body');
    const loginPage = document.getElementById('login-page');
    const controlPanel = document.getElementById('control-panel');
    const loginForm = loginPage.querySelector('form');
    const logoutButton = controlPanel.querySelector('.logout');
  
    // Set initial page to login
    body.classList.add('login');

    // Handle login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        body.classList.remove('login');
        body.classList.add('iot');
        loginPage.classList.add('hidden');
        controlPanel.classList.remove('hidden');
  });
  
    // Handle logout
    logoutButton.addEventListener('click', () => {
        body.classList.remove('iot');
        body.classList.add('login');
        controlPanel.classList.add('hidden');
        loginPage.classList.remove('hidden');
      });
    });
  
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
    const currentStatus = lampToggle.classList.contains('off');  // true jika ON, false jika OFF
    const newStatus = !currentStatus; // Toggle status
    set(ref(db, 'LAMP1'), newStatus) // Simpan status baru ke Firebase
        .then(() => {
            console.log('Lampu 1 status berhasil diperbarui di Firebase');
        })
        .catch((error) => {
            console.error('Gagal memperbarui status Lampu 1 di Firebase', error);
        });
});

// Fungsi untuk mengontrol Lampu 2 (AC)
acToggle.addEventListener('click', () => {
    acToggle.classList.toggle('on');
    acToggle.classList.toggle('off');
    acToggle.textContent = acToggle.classList.contains('on') ? 'ON' : 'OFF';
})
// Listener untuk status Lampu
onValue(ref(db, 'LAMP1'), (snapshot) => {
    const status = snapshot.val(); // Membaca status dari Firebase
    updateToggleStatus(lampToggle, status); // Memperbarui tombol sesuai status
});

// Listener untuk status AC
onValue(ref(db, 'LAMP2'), (snapshot) => {
    const status = snapshot.val(); // Membaca status dari Firebase
    updateToggleStatus(acToggle, status); // Memperbarui tombol sesuai status
});

// Event Listener untuk tombol Lampu
lampToggle.addEventListener('click', () => {
    const newStatus = !lampToggle.classList.contains('on'); // Toggle status
    set(ref(db, 'LAMP1'), newStatus) // Simpan status ke Firebase
        .then(() => {
            console.log('Status Lampu berhasil diperbarui di Firebase:', newStatus ? 'ON' : 'OFF');
        })
        .catch((error) => {
            console.error('Gagal memperbarui status Lampu di Firebase:', error);
        });
});

// Event Listener untuk tombol AC
acToggle.addEventListener('click', () => {
    const newStatus = !acToggle.classList.contains('on'); // Toggle status
    set(ref(db, 'LAMP2'), newStatus) // Simpan status ke Firebase
        .then(() => {
            console.log('Status AC berhasil diperbarui di Firebase:', newStatus ? 'ON' : 'OFF');
        })
        .catch((error) => {
            console.error('Gagal memperbarui status AC di Firebase:', error);
        });
});

// Fungsi untuk memperbarui status tombol di UI
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
