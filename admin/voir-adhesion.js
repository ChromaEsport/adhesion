import {
initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
getAuth,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
getFirestore,
doc,
getDoc,
updateDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {

```
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
```

};

const app =
initializeApp(
firebaseConfig
);

const auth =
getAuth(app);

const db =
getFirestore(app);

/* =====================================================
RÉCUPÉRATION DE L'ID DANS L'URL
===================================================== */

const params =
new URLSearchParams(
window.location.search
);

const adhesionId =
params.get("id");

/* =====================================================
ÉLÉMENTS HTML
===================================================== */

const chargement =
document.getElementById(
"chargement"
);

const contenuDemande =
document.getElementById(
"contenuDemande"
);

const erreur =
document.getElementById(
"erreur"
);

const retour =
document.getElementById(
"retour"
);

/* =====================================================
BOUTONS
===================================================== */

/*
On accepte plusieurs noms possibles pour éviter
de casser la page si tes IDs sont légèrement différents.
*/

const boutonAccepter =
document.getElementById(
"accepterDemande"
)
||
document.getElementById(
"accepter"
);

const boutonRefuser =
document.getElementById(
"refuserDemande"
)
||
document.getElementById(
"refuser"
);

/* =====================================================
VÉRIFICATION CONNEXION
===================================================== */

onAuthStateChanged(
auth,
async (user) => {

```
    if (!user) {

        window.location.href =
            "index.html";

        return;

    }


    if (!adhesionId) {

        afficherErreur(
            "Identifiant de demande manquant."
        );

        return;

    }


    await chargerDemande();

}
```

);

/* =====================================================
CHARGER LA DEMANDE
===================================================== */

async function chargerDemande() {

```
try {

    const adhesionRef =
        doc(
            db,
            "adhesions",
            adhesionId
        );


    const adhesionSnap =
        await getDoc(
            adhesionRef
        );


    if (
        !adhesionSnap.exists()
    ) {

        afficherErreur(
            "Cette demande n'existe pas."
        );

        return;

    }


    const data =
        adhesionSnap.data();


    afficherDonnees(
        data
    );


    chargement.style.display =
        "none";


    contenuDemande.style.display =
        "block";


}
catch (error) {

    console.error(
        "Erreur chargement demande :",
        error
    );


    afficherErreur(
        "Une erreur est survenue lors du chargement."
    );

}
```

}

/* =====================================================
AFFICHER LES DONNÉES
===================================================== */

function afficherDonnees(
data
) {

```
afficher(
    "prenom",
    data.prenom
);


afficher(
    "nom",
    data.nom
);


afficher(
    "dateNaissance",
    formaterDate(
        data.dateNaissance
    )
);


afficher(
    "email",
    data.email
);


afficher(
    "discord",
    data.discord
);


afficher(
    "adresse",
    data.adresse
);


afficher(
    "complementAdresse",
    data.complementAdresse
);


afficher(
    "codePostal",
    data.codePostal
);


afficher(
    "ville",
    data.ville
);


afficher(
    "pays",
    data.pays
);


afficher(
    "annee",
    data.annee
);


afficherEuro(
    "cotisation",
    data.cotisation
);


afficherEuro(
    "don",
    data.don
);


afficherEuro(
    "total",
    data.total
);


afficher(
    "dateDemande",
    formaterDate(
        data.dateDemande
    )
);


afficher(
    "statut",
    data.statut
);


afficher(
    "statutPaiement",
    data.statutPaiement
);
```

}

/* =====================================================
AFFICHAGE TEXTE
===================================================== */

function afficher(
id,
valeur
) {

```
const element =
    document.getElementById(
        id
    );


if (!element) {
    return;
}


element.textContent =
    valeur ||
    "-";
```

}

/* =====================================================
AFFICHAGE EURO
===================================================== */

function afficherEuro(
id,
valeur
) {

```
const element =
    document.getElementById(
        id
    );


if (!element) {
    return;
}


const montant =
    Number(
        valeur || 0
    );


element.textContent =
    montant.toFixed(2) +
    " €";
```

}

/* =====================================================
FORMAT DATE
===================================================== */

function formaterDate(
valeur
) {

```
if (!valeur) {

    return "-";

}


try {

    if (
        typeof valeur.toDate ===
        "function"
    ) {

        return valeur
            .toDate()
            .toLocaleDateString(
                "fr-FR"
            );

    }


    const date =
        new Date(
            valeur
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return valeur;

    }


    return date.toLocaleDateString(
        "fr-FR"
    );

}
catch {

    return "-";

}
```

}

/* =====================================================
ERREUR
===================================================== */

function afficherErreur(
message
) {

```
chargement.style.display =
    "none";


contenuDemande.style.display =
    "none";


erreur.textContent =
    message;


erreur.style.display =
    "block";
```

}

/* =====================================================
ACCEPTER LA DEMANDE
===================================================== */

async function accepterDemande() {

```
const utilisateur =
    auth.currentUser;


if (!utilisateur) {

    alert(
        "Vous devez être connecté."
    );

    return;

}


if (!adhesionId) {

    alert(
        "Identifiant de demande manquant."
    );

    return;

}


if (
    !confirm(
        "Accepter cette demande et créer le paiement Stripe ?"
    )
) {

    return;

}


try {

    /*
    Désactivation du bouton
    */

    if (boutonAccepter) {

        boutonAccepter.disabled =
            true;

        boutonAccepter.textContent =
            "Création du paiement...";

    }


    /*
    Récupération de la demande
    */

    const adhesionRef =
        doc(
            db,
            "adhesions",
            adhesionId
        );


    const adhesionSnap =
        await getDoc(
            adhesionRef
        );


    if (
        !adhesionSnap.exists()
    ) {

        alert(
            "Cette demande n'existe plus."
        );

        return;

    }


    const data =
        adhesionSnap.data();


    /*
    Création de la session Stripe
    */

    const reponse =
        await fetch(
            "https://chroma-stripe.max2501.workers.dev",
            {

                method:
                    "POST",

                headers:
                {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({

                        montant:
                            data.total,

                        email:
                            data.email,

                        adhesionId:
                            adhesionId

                    })

            }
        );


    const stripe =
        await reponse.json();


    console.log(
        "Réponse Stripe :",
        stripe
    );


    if (
        !stripe.url
    ) {

        alert(
            "Impossible de créer le paiement Stripe."
        );

        return;

    }


    /*
    Mise à jour de la demande
    */

    await updateDoc(
        adhesionRef,
        {

            statut:
                "acceptee",

            statutPaiement:
                "en_attente",

            stripeSessionId:
                stripe.sessionId
                ||
                "",

            lienPaiement:
                stripe.url,

            dateDecision:
                serverTimestamp(),

            decisionParNom:
                utilisateur.displayName
                ||
                utilisateur.email
                ||
                "Administrateur",

            decisionParEmail:
                utilisateur.email
                ||
                "",

            decisionParUid:
                utilisateur.uid

        }
    );


    /*
    Redirection vers Stripe
    */

    window.location.href =
        stripe.url;

}
catch (error) {

    console.error(
        "Erreur acceptation :",
        error
    );


    alert(
        "Erreur lors de l'acceptation de la demande."
    );


    if (boutonAccepter) {

        boutonAccepter.disabled =
            false;

        boutonAccepter.textContent =
            "✅ Accepter la demande";

    }

}
```

}

/* =====================================================
REFUSER LA DEMANDE
===================================================== */

async function refuserDemande() {

```
const utilisateur =
    auth.currentUser;


if (!utilisateur) {

    alert(
        "Vous devez être connecté."
    );

    return;

}


if (!adhesionId) {

    alert(
        "Identifiant de demande manquant."
    );

    return;

}


if (
    !confirm(
        "Voulez-vous vraiment refuser cette demande ?"
    )
) {

    return;

}


try {

    /*
    Désactivation du bouton
    */

    if (boutonRefuser) {

        boutonRefuser.disabled =
            true;

        boutonRefuser.textContent =
            "Refus en cours...";

    }


    const adhesionRef =
        doc(
            db,
            "adhesions",
            adhesionId
        );


    /*
    Mise à jour Firestore
    */

    await updateDoc(
        adhesionRef,
        {

            statut:
                "refusee",

            statutPaiement:
                "non_concerne",

            dateDecision:
                serverTimestamp(),

            decisionParNom:
                utilisateur.displayName
                ||
                utilisateur.email
                ||
                "Administrateur",

            decisionParEmail:
                utilisateur.email
                ||
                "",

            decisionParUid:
                utilisateur.uid

        }
    );


    /*
    Retour au dashboard
    */

    alert(
        "La demande a été refusée."
    );


    window.location.href =
        "dashboard.html";

}
catch (error) {

    console.error(
        "Erreur refus demande :",
        error
    );


    alert(
        "Erreur lors du refus de la demande."
    );


    if (boutonRefuser) {

        boutonRefuser.disabled =
            false;

        boutonRefuser.textContent =
            "❌ Refuser la demande";

    }

}
```

}

/* =====================================================
ÉVÉNEMENTS DES BOUTONS
===================================================== */

if (boutonAccepter) {

```
boutonAccepter.addEventListener(
    "click",
    accepterDemande
);
```

}
else {

```
console.warn(
    "Bouton accepter introuvable."
);
```

}

if (boutonRefuser) {

```
boutonRefuser.addEventListener(
    "click",
    refuserDemande
);
```

}
else {

```
console.warn(
    "Bouton refuser introuvable."
);
```

}

/* =====================================================
RETOUR
===================================================== */

if (retour) {

```
retour.addEventListener(
    "click",
    () => {

        window.location.href =
            "dashboard.html";

    }
);


}
