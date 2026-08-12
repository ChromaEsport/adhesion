import { initializeApp } 
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyAedIKW_LRWLpa9V_t7PcTTbrDmQOj4HAo",
  authDomain: "chroma-adhesion.firebaseapp.com",
  projectId: "chroma-adhesion",
  storageBucket: "chroma-adhesion.firebasestorage.app",
  messagingSenderId: "892582501197",
  appId: "1:892582501197:web:2483ffc9c98e47a3d17504"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const adhesionForm = document.getElementById("adhesionForm");

const message = document.getElementById("message");

const dateNaissance = document.getElementById("naissance");

const email = document.getElementById("email");

const emailConfirmation = document.getElementById(
    "emailConfirmation"
);

const don = document.getElementById("don");

const donLibreZone = document.getElementById(
    "donLibreZone"
);

const donLibre = document.getElementById(
    "donLibre"
);

const prenom =
    document.getElementById("prenom");

const nom =
    document.getElementById("nom");

const discord =
    document.getElementById("discord");

const adresseInput =
    document.getElementById("adresse");

const complementAdresseInput =
    document.getElementById("complementAdresse");

const codePostalInput =
    document.getElementById("codePostal");

const villeInput =
    document.getElementById("ville");

const paysInput =
    document.getElementById("pays");

const messageCompteCommunaute =
    document.getElementById(
        "messageCompteCommunaute"
    );
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
                "Aucun compte communauté trouvé pour cet utilisateur."
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

        prenom.value =
            communaute.prenom || "";

        nom.value =
            communaute.nom || "";

        email.value =
            communaute.email ||
            user.email ||
            "";

        emailConfirmation.value =
            communaute.email ||
            user.email ||
            "";

        discord.value =
            communaute.discord || "";

        adresseInput.value =
            communaute.adresse || "";

        complementAdresseInput.value =
            communaute.complementAdresse || "";

        codePostalInput.value =
            communaute.codePostal || "";

        villeInput.value =
            communaute.ville || "";

        paysInput.value =
            communaute.pays ||
            "France";


        /*
        =========================================
        DATE DE NAISSANCE
        =========================================
        */

        if (
            communaute.dateNaissance
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
        MESSAGE
        =========================================
        */

        if (
            messageCompteCommunaute
        ) {

            messageCompteCommunaute.style.display =
                "block";

        }

    }
    catch (error) {

        console.error(
            "Erreur lors du chargement du compte communauté :",
            error
        );

    }
}

onAuthStateChanged(
    auth,
    async (user) => {

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

 // Masquer le champ de don libre au chargement

donLibreZone.classList.add(
    "hidden"
);

donLibre.required = false;   
;

// Limite automatique à 18 ans minimum

const aujourdHui = new Date();

const dateLimite = new Date(
    aujourdHui.getFullYear() - 18,
    aujourdHui.getMonth(),
    aujourdHui.getDate()
);

dateNaissance.max =
    dateLimite.toISOString().split("T")[0];


// aparition don
don.addEventListener(
    "change",
    function () {

       if (don.value === "autre") {

    donLibreZone.classList.remove(
        "hidden"
    );

    donLibre.required = true;

} else {

    donLibreZone.classList.add(
        "hidden"
    );

    donLibre.required = false;

    donLibre.value = "";

}

    }
);

// Calcul de l'âge
function calculerAge(date) {

    const aujourdHui = new Date();

    const naissance = new Date(
        date + "T00:00:00"
    );

    let age =
        aujourdHui.getFullYear()
        - naissance.getFullYear();

    const mois =
        aujourdHui.getMonth()
        - naissance.getMonth();

    const jour =
        aujourdHui.getDate()
        - naissance.getDate();

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


function afficherMessage(
    texte,
    type
) {

    message.textContent = texte;

    message.className =
        "message " + type;

}


adhesionForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        message.textContent = "";

        message.className =
            "message";


        if (
            email.value
                .trim()
                .toLowerCase()
            !==
            emailConfirmation.value
                .trim()
                .toLowerCase()
        ) {

            afficherMessage(
                "Les deux adresses e-mail ne correspondent pas.",
                "error"
            );

            emailConfirmation.focus();

            return;

        }


        if (
            !dateNaissance.value
        ) {

            afficherMessage(
                "Veuillez renseigner votre date de naissance.",
                "error"
            );

            dateNaissance.focus();

            return;

        }


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

            return;

        }

        
let montantDon = Number(don.value);


if (don.value === "autre") {

    montantDon = Number(
        donLibre.value
    );


    if (
        !Number.isFinite(montantDon)
        ||
        montantDon <= 0
    ) {

        afficherMessage(
            "Veuillez indiquer un montant de don valide.",
            "error"
        );

        donLibre.focus();

        return;

    }

}
        
const cotisation = 50;

const montantTotal =
    cotisation + montantDon;

const adresse =
    document.getElementById("adresse")
    .value
    .trim();


const complementAdresse =
    document.getElementById("complementAdresse")
    .value
    .trim();


const codePostal =
    document.getElementById("codePostal")
    .value
    .trim();


const ville =
    document.getElementById("ville")
    .value
    .trim();


const pays =
    document.getElementById("pays")
    .value;

        
       try {

    await addDoc(
        collection(db, "adhesions"),
        {

            prenom:
                document.getElementById("prenom").value,

            nom:
                document.getElementById("nom").value,

            dateNaissance:
                dateNaissance.value,

            email:
                email.value,

            discord:
    document.getElementById("discord").value,


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


            dateDemande:
                serverTimestamp()

        }
    );


    afficherMessage(
        "Votre demande d’adhésion a bien été envoyée. Elle sera examinée par Chroma Esport avant toute demande de paiement.",
        "success"
    );


    adhesionForm.reset();


    donLibreZone.classList.add(
        "hidden"
    );


}
catch(error) {

    console.error(
        "Erreur Firebase : ",
        error
    );


    afficherMessage(
        "Une erreur est survenue lors de l’envoi de votre demande. Veuillez réessayer.",
        "error"
    );

}

    }
);

