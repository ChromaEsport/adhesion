
import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";


import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


// Configuration Firebase

const firebaseConfig = {

    apiKey: "TON_API_KEY",

    authDomain: "TON_PROJET.firebaseapp.com",

    projectId: "TON_PROJECT_ID",

    storageBucket: "TON_PROJECT_ID.firebasestorage.app",

    messagingSenderId: "TON_MESSAGING_ID",

    appId: "TON_APP_ID"

};


// Initialisation Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


// Éléments HTML

const loginForm =
    document.getElementById("loginForm");


const message =
    document.getElementById("message");


// Connexion

loginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const email =
            document.getElementById("email").value;


        const password =
            document.getElementById("password").value;


        try {


            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            message.textContent =
                "Connexion réussie";


            message.style.color =
                "#8fecc9";


            setTimeout(
                () => {

                    window.location.href =
                    "dashboard.html";

                },
                1000
            );


        }
        catch(error) {


            console.error(error);


            message.textContent =
                "Email ou mot de passe incorrect";


            message.style.color =
                "#ff5b6e";


        }


    }
);

