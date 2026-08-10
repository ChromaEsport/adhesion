import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    sendPasswordResetEmail
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
        "formMotDePasse"
    );


const email =
    document.getElementById(
        "email"
    );


const message =
    document.getElementById(
        "message"
    );


formulaire.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const adresseEmail =
            email.value
                .trim()
                .toLowerCase();


        if (!adresseEmail) {

            return;

        }


        message.textContent =
            "Envoi du lien en cours...";


        message.className =
            "message";


        try {

            await sendPasswordResetEmail(
                auth,
                adresseEmail
            );


            message.textContent =
                "✅ Un lien pour créer votre mot de passe vient d'être envoyé à votre adresse e-mail.";


            message.className =
                "message succes";


            formulaire.reset();

        }

        catch (error) {

            console.error(
                "Erreur envoi lien mot de passe :",
                error
            );


            /*
            Pour ne pas révéler si une adresse
            possède ou non un compte.
            */

            message.textContent =
                "Si cette adresse correspond à un compte Chroma Esport, un lien vous sera envoyé par e-mail.";


            message.className =
                "message succes";

        }

    }
);
