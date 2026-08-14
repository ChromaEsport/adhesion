import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    doc,
    getDoc,
    setDoc,
    query,
    where,
    getDocs
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
    getAuth(app);

const db =
    getFirestore(app);


/*
=========================================
ÉLÉMENTS DU FORMULAIRE
=========================================
*/

const adhesionForm =
    document.getElementById(
        "adhesionForm"
    );

const message =
    document.getElementById(
        "message"
    );

const dateNaissance =
    document.getElementById(
        "naissance"
    );

const email =
    document.getElementById(
        "email"
    );

const emailConfirmation =
    document.getElementById(
        "emailConfirmation"
    );

const password =
    document.getElementById(
        "password"
    );

const passwordConfirmation =
    document.getElementById(
        "passwordConfirmation"
    );


const donLibre =
    document.getElementById(
        "donLibre"
    );

const prenom =
    document.getElementById(
        "prenom"
    );

const nom =
    document.getElementById(
        "nom"
    );

const discord =
    document.getElementById(
        "discord"
    );

const adresseInput =
    document.getElementById(
        "adresse"
    );

const complementAdresseInput =
    document.getElementById(
        "complementAdresse"
    );

const codePostalInput =
    document.getElementById(
        "codePostal"
    );

const villeInput =
    document.getElementById(
        "ville"
    );

const paysInput =
    document.getElementById(
        "pays"
    );

const messageCompteCommunaute =
    document.getElementById(
        "messageCompteCommunaute"
    );


/*
=========================================
UTILISATEUR CONNECTÉ
=========================================
*/

let utilisateurConnecte = null;


/*
=========================================
CHARGER LE MEMBRE COMMUNAUTÉ
=========================================
*/

async function chargerMembreCommunaute(user) {

    if (!user) {
        return;
    }

    try {

        console.log(
            "Utilisateur connecté :",
            user.uid
        );


        const communauteRef =
            doc(
                db,
                "communaute",
                user.uid
            );


        const communauteSnapshot =
            await getDoc(
                communauteRef
            );


        if (
            !communauteSnapshot.exists()
        ) {

            console.log(
                "Aucune fiche communauté trouvée pour cet utilisateur."
            );

            return;

        }


        const communaute =
            communauteSnapshot.data();


        console.log(
            "Membre Communauté trouvé :",
            communaute
        );


        /*
        =========================================
        PRÉREMPLISSAGE
        =========================================
        */

        if (prenom) {

            prenom.value =
                communaute.prenom || "";

        }


        if (nom) {

            nom.value =
                communaute.nom || "";

        }


        if (email) {

            email.value =
                communaute.email ||
                user.email ||
                "";

        }


        if (emailConfirmation) {

            emailConfirmation.value =
                communaute.email ||
                user.email ||
                "";

        }


        if (discord) {

            discord.value =
                communaute.discord || "";

        }


        if (adresseInput) {

            adresseInput.value =
                communaute.adresse || "";

        }


        if (complementAdresseInput) {

            complementAdresseInput.value =
                communaute.complementAdresse || "";

        }


        if (codePostalInput) {

            codePostalInput.value =
                communaute.codePostal || "";

        }


        if (villeInput) {

            villeInput.value =
                communaute.ville || "";

        }


        if (paysInput) {

            paysInput.value =
                communaute.pays ||
                "France";

        }


        /*
        =========================================
        DATE DE NAISSANCE
        =========================================
        */

        if (
            communaute.dateNaissance &&
            dateNaissance
        ) {

            if (
                typeof communaute.dateNaissance.toDate ===
                "function"
            ) {

                const date =
                    communaute.dateNaissance.toDate();

                dateNaissance.value =
                    date.toISOString()
                        .split("T")[0];

            }

            else {

                dateNaissance.value =
                    communaute.dateNaissance;

            }

        }


        /*
        =========================================
        MESSAGE MEMBRE COMMUNAUTÉ
        =========================================
        */

        if (
            messageCompteCommunaute
        ) {

            messageCompteCommunaute.style.display =
                "block";

        }


        /*
        =========================================
        MOT DE PASSE
        =========================================

        Le membre possède déjà un compte Firebase.
        On ne lui demande donc pas de recréer
        son mot de passe.
        */

        if (password) {

            password.required =
                false;

            password.disabled =
                true;

        }


        if (passwordConfirmation) {

            passwordConfirmation.required =
                false;

            passwordConfirmation.disabled =
                true;

        }


    }
    catch (error) {

        console.error(
            "Erreur lors du chargement du compte communauté :",
            error
        );

    }

}


/*
=========================================
SURVEILLANCE AUTHENTIFICATION
=========================================
*/

onAuthStateChanged(
    auth,
    async (user) => {

        utilisateurConnecte =
            user || null;


        if (!user) {

            console.log(
                "Aucun utilisateur connecté."
            );

            return;

        }


        await chargerMembreCommunaute(
            user
        );

    }
);




/*
=========================================
LIMITE AUTOMATIQUE À 18 ANS
=========================================
*/

if (dateNaissance) {

    const aujourdHui =
        new Date();

    const dateLimite =
        new Date(
            aujourdHui.getFullYear() - 18,
            aujourdHui.getMonth(),
            aujourdHui.getDate()
        );

    dateNaissance.max =
        dateLimite
            .toISOString()
            .split("T")[0];

}



/*
=========================================
CALCUL DE L'ÂGE
=========================================
*/

function calculerAge(date) {

    const aujourdHui =
        new Date();

    const naissance =
        new Date(
            date + "T00:00:00"
        );

    let age =
        aujourdHui.getFullYear()
        -
        naissance.getFullYear();

    const mois =
        aujourdHui.getMonth()
        -
        naissance.getMonth();

    const jour =
        aujourdHui.getDate()
        -
        naissance.getDate();


    if (
        mois < 0
        ||
        (
            mois === 0
            &&
            jour < 0
        )
    ) {

        age--;

    }


    return age;

}


/*
=========================================
AFFICHER MESSAGE
=========================================
*/

function afficherMessage(
    texte,
    type
) {

    message.textContent =
        texte;

    message.className =
        "message " + type;

}


/*
=========================================
SOUMISSION FORMULAIRE
=========================================
*/

adhesionForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        message.textContent =
            "";

        message.className =
            "message";


        /*
        =========================================
        BOUTON
        =========================================
        */

        const bouton =
            adhesionForm.querySelector(
                'button[type="submit"]'
            );


        if (bouton) {

            bouton.disabled =
                true;

        }


        try {


            /*
            =========================================
            DONNÉES DE BASE
            =========================================
            */

            const prenomValeur =
                prenom.value.trim();

            const nomValeur =
                nom.value.trim();

            const emailValeur =
                email.value
                    .trim()
                    .toLowerCase();

            const emailConfirmationValeur =
                emailConfirmation.value
                    .trim()
                    .toLowerCase();

            const discordValeur =
                discord.value.trim();


            /*
            =========================================
            VÉRIFICATION EMAIL
            =========================================
            */

            if (
                emailValeur !==
                emailConfirmationValeur
            ) {

                afficherMessage(
                    "Les deux adresses e-mail ne correspondent pas.",
                    "error"
                );

                emailConfirmation.focus();

                if (bouton) {
                    bouton.disabled = false;
                }

                return;

            }


            /*
            =========================================
            DATE DE NAISSANCE
            =========================================
            */

            if (
                !dateNaissance.value
            ) {

                afficherMessage(
                    "Veuillez renseigner votre date de naissance.",
                    "error"
                );

                dateNaissance.focus();

                if (bouton) {
                    bouton.disabled = false;
                }

                return;

            }


            /*
            =========================================
            ÂGE
            =========================================
            */

            const age =
                calculerAge(
                    dateNaissance.value
                );


            if (
                age < 18
            ) {

                afficherMessage(
                    "L’adhésion en ligne est réservée aux personnes âgées de 18 ans ou plus.",
                    "error"
                );

                dateNaissance.focus();

                if (bouton) {
                    bouton.disabled = false;
                }

                return;

            }


            /*
            =========================================
            MOT DE PASSE
            =========================================

            Seulement pour une nouvelle personne.

            Un membre Communauté possède déjà
            son compte Firebase.
            */

            const compteDejaExistant =
                !!utilisateurConnecte;


            if (
                !compteDejaExistant
            ) {

                if (
                    !password.value
                ) {

                    afficherMessage(
                        "Veuillez choisir un mot de passe.",
                        "error"
                    );

                    password.focus();

                    if (bouton) {
                        bouton.disabled = false;
                    }

                    return;

                }


                if (
                    password.value.length < 6
                ) {

                    afficherMessage(
                        "Le mot de passe doit contenir au minimum 6 caractères.",
                        "error"
                    );

                    password.focus();

                    if (bouton) {
                        bouton.disabled = false;
                    }

                    return;

                }


                if (
                    password.value !==
                    passwordConfirmation.value
                ) {

                    afficherMessage(
                        "Les deux mots de passe ne correspondent pas.",
                        "error"
                    );

                    passwordConfirmation.focus();

                    if (bouton) {
                        bouton.disabled = false;
                    }

                    return;

                }

            }


            /*
            =========================================
            DON
            =========================================
            */

            let montantDon =
    Number(
        donLibre.value || 0
    );


if (
    !Number.isFinite(montantDon)
    ||
    montantDon < 0
) {

    afficherMessage(
        "Veuillez indiquer un montant de don valide.",
        "error"
    );

    donLibre.focus();

    if (bouton) {
        bouton.disabled = false;
    }

    return;

}


            /*
            =========================================
            COTISATION
            =========================================
            */

            const cotisation =
                50;


            const montantTotal =
                cotisation +
                montantDon;


            /*
            =========================================
            ADRESSE
            =========================================
            */

            const adresse =
                adresseInput.value
                    .trim();


            const complementAdresse =
                complementAdresseInput.value
                    .trim();


            const codePostal =
                codePostalInput.value
                    .trim();


            const ville =
                villeInput.value
                    .trim();


            const pays =
                paysInput.value;


            /*
            =========================================
            CRÉATION / RÉCUPÉRATION COMPTE FIREBASE
            =========================================
            */

            let utilisateur =
                utilisateurConnecte;


            let firebaseUid =
                utilisateur
                    ? utilisateur.uid
                    : null;


            /*
            =========================================
            NOUVEL UTILISATEUR
            =========================================
            */

            if (
                !utilisateur
            ) {

                afficherMessage(
                    "Création de votre compte en cours...",
                    "success"
                );


                const resultat =
                    await createUserWithEmailAndPassword(
                        auth,
                        emailValeur,
                        password.value
                    );


                utilisateur =
                    resultat.user;


                firebaseUid =
                    utilisateur.uid;


                console.log(
                    "Compte Firebase créé :",
                    firebaseUid
                );


                /*
                =========================================
                NOM DU PROFIL FIREBASE
                =========================================
                */

                await updateProfile(
                    utilisateur,
                    {

                        displayName:
                            prenomValeur +
                            " " +
                            nomValeur

                    }
                );

            }


            /*
            =========================================
            CRÉATION / MISE À JOUR COMMUNAUTÉ
            =========================================
            */

            if (
                firebaseUid
            ) {

                await setDoc(
                    doc(
                        db,
                        "communaute",
                        firebaseUid
                    ),
                    {

                        uid:
                            firebaseUid,

                        prenom:
                            prenomValeur,

                        nom:
                            nomValeur,

                        dateNaissance:
                            dateNaissance.value,

                        age:
                            age,

                        email:
                            emailValeur,

                        discord:
                            discordValeur,

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

                    },

                    {
                        merge: true
                    }
                );


                console.log(
                    "Fiche communauté créée / mise à jour :",
                    firebaseUid
                );

            }

/*
=========================================
VÉRIFICATION D'UNE DEMANDE EXISTANTE
=========================================
*/
if (firebaseUid) {

const requeteDemandeExistante =
    query(
        collection(
            db,
            "adhesions"
        ),
        where(
            "firebaseUid",
            "==",
            firebaseUid
        ),
        where(
            "statut",
            "==",
            "en_attente"
        )
    );

const demandesExistantes =
    await getDocs(
        requeteDemandeExistante
    );

if (!demandesExistantes.empty) {

    afficherMessage(
        "🟠 Vous avez déjà une demande d’adhésion en cours d’examen. Vous ne pouvez pas déposer une nouvelle demande tant que celle-ci n’a pas été traitée.",
        "error"
    );

    if (bouton) {
        bouton.disabled = false;
    }

    return;
}
    }

    
            /*
            =========================================
            CRÉATION DEMANDE D'ADHÉSION
            =========================================
            */

            await addDoc(
                collection(
                    db,
                    "adhesions"
                ),
                {

                    prenom:
                        prenomValeur,

                    nom:
                        nomValeur,

                    dateNaissance:
                        dateNaissance.value,

                    email:
                        emailValeur,

                    discord:
                        discordValeur,

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

                    firebaseUid:
                        firebaseUid,

                    origine:
                        compteDejaExistant
                            ? "communaute"
                            : "nouvelle_adhesion",

                    annee:
                        2026,

                    cotisation:
                        cotisation,

                    don:
                        montantDon,

                    total:
                        montantTotal,

                    statut:
                        "en_attente",

                    statutPaiement:
                        "en_attente",

                    dateDemande:
                        serverTimestamp()

                }
            );


            console.log(
                "Demande d'adhésion créée."
            );


            /*
            =========================================
            SUCCÈS
            =========================================
            */

            afficherMessage(
                "✅ Votre compte et votre demande d’adhésion ont bien été enregistrés. Votre dossier va maintenant être examiné par Chroma Esport.",
                "success"
            );


            /*
            =========================================
            RESET PARTIEL
            =========================================

            On ne reset pas le formulaire immédiatement
            pour éviter de supprimer les informations
            affichées à l'utilisateur.
            */

            if (bouton) {

                bouton.disabled =
                    true;

            }


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
                2000
            );


        }
        catch (error) {

            console.error(
                "Erreur lors de l'envoi de la demande :",
                error
            );


            /*
            =========================================
            ERREURS FIREBASE AUTH
            =========================================
            */

            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                afficherMessage(
                    "❌ Cette adresse e-mail possède déjà un compte Chroma Esport. Connectez-vous à votre espace membre avant de déposer une demande d’adhésion.",
                    "error"
                );

            }

            else if (
                error.code ===
                "auth/invalid-email"
            ) {

                afficherMessage(
                    "❌ L'adresse e-mail renseignée n'est pas valide.",
                    "error"
                );

            }

            else if (
                error.code ===
                "auth/weak-password"
            ) {

                afficherMessage(
                    "❌ Le mot de passe choisi est trop faible. Il doit contenir au minimum 6 caractères.",
                    "error"
                );

            }

            else if (
                error.code ===
                "permission-denied"
            ) {

                afficherMessage(
                    "❌ L'opération a été refusée par les règles de sécurité Firebase.",
                    "error"
                );

            }

            else if (
                error.message
            ) {

                afficherMessage(
                    "❌ " +
                    error.message,
                    "error"
                );

            }

            else {

                afficherMessage(
                    "❌ Une erreur est survenue lors de l'envoi de votre demande.",
                    "error"
                );

            }


            /*
            =========================================
            RÉACTIVER BOUTON
            =========================================
            */

            if (bouton) {

                bouton.disabled =
                    false;

            }

        }

    }
);
