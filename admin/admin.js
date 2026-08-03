
import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";


import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


// Configuration Firebase

const firebaseConfig = {

    apiKey: "AIzaSyAedIKW_LRWLpa9V_t7PcTTbrDmQOj4HAo",
  authDomain: "chroma-adhesion.firebaseapp.com",
  projectId: "chroma-adhesion",
  storageBucket: "chroma-adhesion.firebasestorage.app",
  messagingSenderId: "892582501197",
  appId: "1:892582501197:web:2483ffc9c98e47a3d17504"

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

