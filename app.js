
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
    function (event) {

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

        
        afficherMessage(
    "Votre formulaire est valide. "
    + "Cotisation : "
    + cotisation.toFixed(2)
    + " € — Don : "
    + montantDon.toFixed(2)
    + " € — Total prévu : "
    + montantTotal.toFixed(2)
    + " €. "
    + "L’enregistrement dans la base de données sera ajouté à la prochaine étape.",
    "success"
);

    }
);

