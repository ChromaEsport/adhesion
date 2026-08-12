
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
    collection,
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
VALIDATION FORMULAIRE
=========================================
*/

form.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();


        /*
        =========================================
        RÉCUPÉRATION DES VALEURS
        =========================================
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
        =========================================
        VALIDATION EMAIL
        =========================================
        */

        if (
            email !==
            emailConfirmation
        ) {

            message.style.color =
                "#ff6b7a";

            message.textContent =
                "Les deux adresses e-mail ne correspondent pas.";

            return;

        }


        /*
        =========================================
        VALIDATION MOT DE PASSE
        =========================================
        */

        if (
            password.length <
            6
        ) {

            message.style.color =
                "#ff6b7a";

            message.textContent =
                "Le mot de passe doit contenir au minimum 6 caractères.";

            return;

        }


        if (
            password !==
            passwordConfirmation
        ) {

            message.style.color =
                "#ff6b7a";

            message.textContent =
                "Les deux mots de passe ne correspondent pas.";

            return;

        }


        /*
        =========================================
        VALIDATION DATE DE NAISSANCE
        =========================================
        */

        if (
            !dateNaissance
        ) {

            message.style.color =
                "#ff6b7a";

            message.textContent =
                "Veuillez renseigner votre date de naissance.";

            return;

        }


        /*
        =========================================
        CALCUL DE L'ÂGE
        =========================================
        */

        const naissance =
            new Date(
                dateNaissance
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
        =========================================
        CRÉATION DU COMPTE
        =========================================
        */

        message.style.color =
            "#7d8d8e";

        message.textContent =
            "Création de votre compte...";


        const resultat =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user =
            resultat.user;


        /*
        =========================================
        NOM DU PROFIL FIREBASE
        =========================================
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
        =========================================
        CRÉATION DE LA FICHE COMMUNAUTÉ
        =========================================
        */

        const membreCommunauteRef =
            doc(
                collection(
                    db,
                    "communaute"
                ),
                user.uid
            );


        await setDoc(
            membreCommunauteRef,
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


                /*
                =====================================
                STATUT COMMUNAUTÉ
                =====================================
                */

                statut:
                    "communaute",


                /*
                =====================================
                DATE D'INSCRIPTION
                =====================================
                */

                dateInscription:
                    serverTimestamp(),


                /*
                =====================================
                ÉVOLUTION FUTURE
                =====================================
                */

                membreAdherent:
                    false,

                datePassageAdherent:
                    null

            }
        );


        /*
        =========================================
        SUCCÈS
        =========================================
        */

        message.style.color =
            "#6ed6a3";

        message.textContent =
            "Votre compte a été créé avec succès !";


        /*
        =========================================
        REDIRECTION
        =========================================
        */

        setTimeout(
            function () {

                window.location.href =
                    "espace-membre.html";

            },
            1500
        );


    }
    catch (error) {


        /*
        =========================================
        GESTION DES ERREURS FIREBASE
        =========================================
        */

        console.error(
            "Erreur création membre communauté :",
            error
        );


        message.style.color =
            "#ff6b7a";


        if (
            error.code ===
            "auth/email-already-in-use"
        ) {

            message.textContent =
                "Cette adresse e-mail possède déjà un compte. Vous pouvez vous connecter à votre espace membre.";

            return;

        }


        if (
            error.code ===
            "auth/invalid-email"
        ) {

            message.textContent =
                "L'adresse e-mail renseignée n'est pas valide.";

            return;

        }


        if (
            error.code ===
            "auth/weak-password"
        ) {

            message.textContent =
                "Le mot de passe est trop faible. Utilisez au minimum 6 caractères.";

            return;

        }


        message.textContent =
            "Une erreur est survenue lors de la création de votre compte. Veuillez réessayer.";

    }

);
