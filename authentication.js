import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { firebaseConfig } from './firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

const signInButton = document.querySelector("#signInButton");
const signOutButton = document.querySelector("#signOutButton");

const userSignIn = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log(user);
        injectUserData(user);

        const authModal = document.querySelector('#authModal');
        const authModalInstance = bootstrap.Modal.getInstance(authModal);
        if (authModalInstance) authModalInstance.hide();

        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
        
        signInButton.style.display = 'none';
        signOutButton.style.display = 'block';
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Error [${errorCode}]: ${errorMessage}`);

        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        document.getElementById('errorModalBody').innerText = `Error: ${errorMessage}`;
        errorModal.show();
    }
};

const userSignOut = async () => {
    try {
        await signOut(auth);

        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        document.querySelector('#successModal .modal-body').innerText = "You have successfully signed out!";
        successModal.show();
        
        document.getElementById('form').reset();
        window.location.reload();

        signOutButton.style.display = 'none';
        signInButton.style.display = 'block';
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Error [${errorCode}]: ${errorMessage}`);

        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        document.getElementById('errorModalBody').innerText = `Error: ${errorMessage}`;
        errorModal.show();
    }
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(user);
        injectUserData(user);
        signInButton.style.display = 'none';
        signOutButton.style.display = 'block';
    } else {
        signInButton.style.display = 'block';
        signOutButton.style.display = 'none';
    }
});

signInButton.addEventListener("click", userSignIn);
signOutButton.addEventListener("click", userSignOut);

function injectUserData(user) {
    if (user.displayName) {
        const [firstName, lastName] = user.displayName.split(" ");
        document.getElementById('firstName').value = firstName || '';
        document.getElementById('lastName').value = lastName || '';
    }
    document.getElementById('exampleInputEmail1').value = user.email || '';
}
