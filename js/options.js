window.onload = function () {

    var listeNoire = document.querySelector("table[valeurslistenoire]");
    var listeBlanche = document.querySelector("table[valeurslisteblanche]");
    var severite = document.querySelectorAll("input[type = 'radio']");
    // var severiteSelectionne = document.querySelector(input[checked]);
    for (let i = 0; i < 4; i++) {
        document.querySelector(`span[n${i+1}]`).innerHTML = (chrome.i18n.getMessage("options_niveau")+(i+1));
        document.querySelector(`span[n${i+1}]+span`).innerHTML = chrome.i18n.getMessage(`options_l${i+1}_text`);
    }
    document.querySelector(`#lntitre`).innerHTML = chrome.i18n.getMessage(`options_listenoire`);
    document.querySelector(`#lbtitre`).innerHTML = chrome.i18n.getMessage(`options_listeblanche`);
    document.querySelector(`a[options]`).innerHTML = chrome.i18n.getMessage(`options_options`);
    document.querySelector(`a[horaire]`).innerHTML = chrome.i18n.getMessage(`options_horaire`);
    document.querySelector(`a[dons]`).innerHTML = chrome.i18n.getMessage(`options_dons`);
    document.querySelector(`a[contact]`).innerHTML = chrome.i18n.getMessage(`options_contact`);
    document.querySelector(`a[bug]`).innerHTML = chrome.i18n.getMessage(`options_reportbug`);
    document.querySelector(`a[suggerer]`).innerHTML = chrome.i18n.getMessage(`options_suggestfeature`);
    
    charger();

    chrome.storage.sync.get(["donneesListeNoire", "donneesListeBlanche"], function (donnees) {
        if (typeof donnees["donneesListeNoire"] !== "undefined") {
            listeNoire.innerHTML = donnees["donneesListeNoire"];
        }
        if (typeof donnees["donneesListeBlanche"] !== "undefined") {
            listeBlanche.innerHTML = donnees["donneesListeBlanche"];
        }
    });


    let messageEntreeTempsSeverite = [
        chrome.i18n.getMessage("options_onseveriteinput_l1"),
        chrome.i18n.getMessage("options_onseveriteinput_l2"),
        chrome.i18n.getMessage("options_onseveriteinput_l3"),
        chrome.i18n.getMessage("options_onseveriteinput_l4")
    ];

    for (let i = 0, length = severite.length; i < length; i++) {
        severite[i].addEventListener("click", function () {
            severite[i].parentElement.querySelector("span[temps]").innerHTML = "";
            setTimeout(() => {
                let temps = parseFloat(prompt(messageEntreeTempsSeverite[i]));
                if (!isNaN(temps) && (temps >= 0) && (temps <= 500)) {
                    let debut = i < 2 ? confirm(chrome.i18n.getMessage("options_onseveriteinput_debutquestion")) : false;
                    let textProprietes = "[" + (debut ? chrome.i18n.getMessage("options_onseveriteinput_debut") : "") + (i < 2 ? chrome.i18n.getMessage("options_onseveriteinput_chaque") : chrome.i18n.getMessage("options_onseveriteinput_apres")) + temps + chrome.i18n.getMessage("options_onseveriteinput_min")+"]";
                    severite[i].parentElement.querySelector("span[temps]").innerHTML = textProprietes;
                    chrome.storage.sync.set({
                        niveauSeverite: severite[i].id,
                        texteDePropriete: textProprietes,
                        proprietesDeRappel: [temps, debut]
                    });
                }
                else {
                    alert(chrome.i18n.getMessage("options_onseveriteinput_invalid"));
                    charger();
                }
            }, 500);
        });
    }

    function charger() {
        chrome.storage.sync.get(["niveauSeverite", "texteDePropriete"], function (niveauSeverite) {
            if ((niveauSeverite["niveauSeverite"] || niveauSeverite["texteDePropriete"]) != null) {
                let checked = document.getElementById(niveauSeverite["niveauSeverite"]);
                checked.checked = "checked";
                checked.parentElement.querySelector("span[temps]").innerHTML = niveauSeverite["texteDePropriete"];
            }
            else {
                severite[0].checked = "checked";
                severite[0].parentElement.querySelector("span[temps]").innerHTML = chrome.i18n.getMessage("options_onseveriteinput_inactive");
            }

        });
    }




};