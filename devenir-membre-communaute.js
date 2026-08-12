import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/*
=========================================
CONFIGURATION FIREBASE
=========================================
*/

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


/*
=========================================
INITIALISATION FIREBASE
=========================================
*/

const app =
    initializeApp(
        firebaseConfig
    );

const auth =
    getAuth(
        app
    );

const db =
    getFirestore(
        app
    );


/*
=========================================
FORMULAIRE
=========================================
*/

const form =
    document.getElementById(
        "communauteForm"
    );

const message =
    document.getElementById(
        "message"
    );


/*
=========================================
VÉRIFICATION DU FORMULAIRE
=========================================
*/

if (!form) {

    console.error(
        "Formulaire #communauteForm introuvable."
    );

} else {


    /*
    =========================================
    ENVOI DU FORMULAIRE
    =========================================
    */

    form.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            /*
            =====================================
            MESSAGE DE TRAITEMENT
            =====================================
            */

            message.style.color =
                "#7d8d8e";

            message.textContent =
                "Création de votre compte en cours...";


            /*
            =====================================
            DÉSACTIVER LE BOUTON
            =====================================
            */

            const bouton =
                form.querySelector(
                    'button[type="submit"]'
                );

            if (bouton) {

                bouton.disabled =
                    true;

            }


            try {


                /*
                =====================================
                RÉCUPÉRATION DES DONNÉES
                =====================================
                */

                const prenom =
                    document.getElementById(
                        "prenom"
                    ).value.trim();

                const nom =
                    document.getElementById(
                        "nom"
                    ).value.trim();

                const dateNaissance =
                    document.getElementById(
                        "dateNaissance"
                    ).value;

                const email =
                    document.getElementById(
                        "email"
                    ).value.trim()
                    .toLowerCase();

                const emailConfirmation =
                    document.getElementById(
                        "emailConfirmation"
                    ).value.trim()
                    .toLowerCase();

                const discord =
                    document.getElementById(
                        "discord"
                    ).value.trim();

                const password =
                    document.getElementById(
                        "password"
                    ).value;

                const passwordConfirmation =
                    document.getElementById(
                        "passwordConfirmation"
                    ).value;

                const adresse =
                    document.getElementById(
                        "adresse"
                    ).value.trim();

                const complementAdresse =
                    document.getElementById(
                        "complementAdresse"
                    ).value.trim();

                const codePostal =
                    document.getElementById(
                        "codePostal"
                    ).value.trim();

                const ville =
                    document.getElementById(
                        "ville"
                    ).value.trim();

                const pays =
                    document.getElementById(
                        "pays"
                    ).value.trim();


                /*
                =====================================
                VALIDATION EMAIL
                =====================================
                */

                if (
                    email !==
                    emailConfirmation
                ) {

                    throw new Error(
                        "Les deux adresses e-mail ne correspondent pas."
                    );

                }


                /*
                =====================================
                VALIDATION MOT DE PASSE
                =====================================
                */

                if (
                    password.length < 6
                ) {

                    throw new Error(
                        "Le mot de passe doit contenir au minimum 6 caractères."
                    );

                }


                if (
                    password !==
                    passwordConfirmation
                ) {

                    throw new Error(
                        "Les deux mots de passe ne correspondent pas."
                    );

                }


                /*
                =====================================
                VALIDATION DATE
                =====================================
                */

                if (
                    !dateNaissance
                ) {

                    throw new Error(
                        "Veuillez renseigner votre date de naissance."
                    );

                }


                /*
                =====================================
                CALCUL DE L'ÂGE
                =====================================
                */

                const naissance =
                    new Date(
                        dateNaissance +
                        "T00:00:00"
                    );

                const aujourdHui =
                    new Date();

                let age =
                    aujourdHui.getFullYear()
                    -
                    naissance.getFullYear();

                const mois =
                    aujourdHui.getMonth()
                    -
                    naissance.getMonth();

                if (
                    mois < 0 ||
                    (
                        mois === 0 &&
                        aujourdHui.getDate()
                        <
                        naissance.getDate()
                    )
                ) {

                    age--;

                }


                /*
                =====================================
                CRÉATION DU COMPTE FIREBASE AUTH
                =====================================
                */

                const resultat =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    resultat.user;


                console.log(
                    "Compte Firebase créé :",
                    user.uid
                );


                /*
                =====================================
                NOM DU PROFIL
                =====================================
                */

                await updateProfile(
                    user,
                    {

                        displayName:
                            prenom +
                            " " +
                            nom

                    }
                );


                /*
                =====================================
                CRÉATION FICHE COMMUNAUTÉ
                =====================================
                */

                await setDoc(
                    doc(
                        db,
                        "communaute",
                        user.uid
                    ),
                    {

                        uid:
                            user.uid,

                        prenom:
                            prenom,

                        nom:
                            nom,

                        dateNaissance:
                            dateNaissance,

                        age:
                            age,

                        email:
                            email,

                        discord:
                            discord,

                        adresse:
                            adresse,

                        complementAdresse:
                            complementAdresse,

                        codePostal:
                            codePostal,

                        ville:
                            ville,

                        pays:
                            pays,

                        statut:
                            "communaute",

                        dateInscription:
                            serverTimestamp(),

                        membreAdherent:
                            false,

                        datePassageAdherent:
                            null

                    }
                );


                console.log(
                    "Fiche communauté créée :",
                    user.uid
                );


                /*
                =====================================
                SUCCÈS
                =====================================
                */

                message.style.color =
                    "#6ed6a3";

                message.textContent =
                    "✅ Votre compte a été créé avec succès. Redirection vers votre espace membre...";


                /*
                =====================================
                REDIRECTION
                =====================================
                */

                setTimeout(
                    function () {

                        window.location.href =
                            "espace-membre.html";

                    },
                    1500
                );


            } catch (error) {


                /*
                =====================================
                ERREUR
                =====================================
                */

                console.error(
                    "Erreur inscription communauté :",
                    error
                );


                message.style.color =
                    "#ff6b7a";


                /*
                =====================================
                ERREURS FIREBASE
                =====================================
                */

                if (
                    error.code ===
                    "auth/email-already-in-use"
                ) {

                    message.textContent =
                        "❌ Cette adresse e-mail possède déjà un compte.";

                }

                else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    message.textContent =
                        "❌ L'adresse e-mail renseignée n'est pas valide.";

                }

                else if (
                    error.code ===
                    "auth/weak-password"
                ) {

                    message.textContent =
                        "❌ Le mot de passe est trop faible.";

                }

                else if (
                    error.code ===
                    "permission-denied"
                ) {

                    message.textContent =
                        "❌ L'inscription a été refusée par les règles de sécurité.";

                }

                else if (
                    error.message
                ) {

                    message.textContent =
                        "❌ " +
                        error.message;

                }

                else {

                    message.textContent =
                        "❌ Une erreur est survenue lors de la création de votre compte.";

                }


                /*
                =====================================
                RÉACTIVER LE BOUTON
                =====================================
                */

                if (bouton) {

                    bouton.disabled =
                        false;

                }

            }

        }
    );

}
