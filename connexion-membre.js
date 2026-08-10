import {
initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
getAuth,
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {


apiKey:
    "AIzaSyAedIKW_LRWLpa9V_t7PcTTbrDmQOj4HAo",

authDomain:
    "chroma-adhesion.firebaseapp.com",

projectId:
    "chroma-adhesion",

storageBucket:
    "chroma-adhesion.firebasestorage.app",

messagingSenderId:
    "892582501197",

appId:
    "1:892582501197:web:2483ffc9c98e47a3d17504"


};

const app =
initializeApp(
firebaseConfig
);

const auth =
getAuth(
app
);

const formulaire =
document.getElementById(
"formConnexion"
);

const email =
document.getElementById(
"email"
);

const password =
document.getElementById(
"password"
);

const boutonConnexion =
document.getElementById(
"boutonConnexion"
);

const messageConnexion =
document.getElementById(
"messageConnexion"
);

formulaire.addEventListener(
"submit",
async (event) => {


    event.preventDefault();


    const adresseEmail =
        email.value.trim();


    const motDePasse =
        password.value;


    if (
        !adresseEmail ||
        !motDePasse
    ) {

        messageConnexion.textContent =
            "Veuillez renseigner votre email et votre mot de passe.";

        return;
    }


    boutonConnexion.disabled =
        true;

    boutonConnexion.textContent =
        "Connexion en cours...";


    messageConnexion.textContent =
        "";


    try {

        const resultat =
            await signInWithEmailAndPassword(
                auth,
                adresseEmail,
                motDePasse
            );


        console.log(
            "Connexion réussie."
        );


        console.log(
            "Email :",
            resultat.user.email
        );


        console.log(
            "UID Firebase :",
            resultat.user.uid
        );


        window.location.href =
            "espace-membre.html";

    }

    catch (error) {

        console.error(
            "Erreur de connexion :",
            error
        );


        if (
            error.code ===
            "auth/invalid-credential"
        ) {

            messageConnexion.textContent =
                "Email ou mot de passe incorrect.";

        }

        else if (
            error.code ===
            "auth/user-not-found"
        ) {

            messageConnexion.textContent =
                "Aucun compte membre ne correspond à cette adresse email.";

        }

        else if (
            error.code ===
            "auth/wrong-password"
        ) {

            messageConnexion.textContent =
                "Mot de passe incorrect.";

        }

        else if (
            error.code ===
            "auth/too-many-requests"
        ) {

            messageConnexion.textContent =
                "Trop de tentatives. Veuillez patienter avant de réessayer.";

        }

        else {

            messageConnexion.textContent =
                "Impossible de vous connecter. Veuillez réessayer.";

        }


        boutonConnexion.disabled =
            false;

        boutonConnexion.textContent =
            "🔐 Se connecter";

    }

}


);
