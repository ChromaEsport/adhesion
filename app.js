```javascript
const adhesionForm = document.getElementById("adhesionForm");

const message = document.getElementById("message");

const dateNaissance = document.getElementById("naissance");

const email = document.getElementById("email");

const emailConfirmation = document.getElementById(
    "emailConfirmation"
);


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


        afficherMessage(
            "Votre formulaire est valide. L’enregistrement dans la base de données sera ajouté à la prochaine étape.",
            "success"
        );

    }
);
```
