document.addEventListener('DOMContentLoaded', (event) => {

    function createCodon(codons, name, abbrev) {
        let obj = {};
        codons.forEach(codon => {
            obj[codon] = { codonName: name, abbrev: abbrev };
        });
        return obj;
    }

    // Definition de la table des codons
    const codonTable = {
        ...createCodon(['UUU', 'UUC'], 'PhenylalaninePHE', 'PHE'),
        ...createCodon(['UUA', 'UUG'], 'LeucineLEU', 'LEU'),
        ...createCodon(['UCU', 'UCC', 'UCA', 'UCG', 'AGU', 'AGC'], 'SerineSER', 'SER'),
        ...createCodon(['UAU', 'UAC'], 'TyrosineTYR', 'TYR'),
        ...createCodon(['UAA', 'UAG', 'UGA'], 'StopSTP', 'STP'),
        ...createCodon(['UGU', 'UGC'], 'CysteineCYS', 'CYS'),
        ...createCodon(['UGG'], 'TryptophaneTRP', 'TRP'),
        ...createCodon(['CUU', 'CUC', 'CUA', 'CUG'], 'LeucineLEU', 'LEU'),
        ...createCodon(['CCU', 'CCC', 'CCA', 'CCG'], 'ProlinePRO', 'PRO'),
        ...createCodon(['CAU', 'CAC'], 'HistidineHIS', 'HIS'),
        ...createCodon(['CAA', 'CAG'], 'GlutamineGLN', 'GLN'),
        ...createCodon(['CGU', 'CGC', 'CGA', 'CGG', 'AGA', 'AGG'], 'ArginineARG', 'ARG'),
        ...createCodon(['AUU', 'AUC', 'AUA'], 'IsoleucineILE', 'ILE'),
        ...createCodon(['AUG'], 'MethionineMET', 'MET'),
        ...createCodon(['ACU', 'ACC', 'ACA', 'ACG'], 'ThreonineTHR', 'THR'),
        ...createCodon(['AAU', 'AAC'], 'AsparagineASN', 'ASN'),
        ...createCodon(['AAA', 'AAG'], 'LysineLYS', 'LYS'),
        ...createCodon(['GUU', 'GUC', 'GUA', 'GUG'], 'ValineVAL', 'VAL'),
        ...createCodon(['GCU', 'GCC', 'GCA', 'GCG'], 'AlanineALA', 'ALA'),
        ...createCodon(['GAU', 'GAC'], 'AspartateASP', 'ASP'),
        ...createCodon(['GAA', 'GAG'], 'GlutamateGLU', 'GLU'),
        ...createCodon(['GGU', 'GGC', 'GGA', 'GGG'], 'GlycineGLY', 'GLY'),
    };

    // Fonction de transfert des codons vers les acides aminés.
    function getAminoAcid(codon) {
        return codonTable[codon] || { codonName: 'Unknown', abbrev: '???' };
    }

    // Initialiser les variables du bouton et du contenu
    var btn1 = document.querySelector('#btn1');
    var btn2 = document.querySelector('#btn2');
    var con1 = document.querySelector('#con1');
    var con2 = document.querySelector('#con2');
    var speed = 3;
    var rangeInput = document.getElementById('customRange3');
    var curSeq = '';
    var lstSeq = '';
    var input = document.getElementById('rna-sequence');
    let queue = [];
    let isProcessing = false;

    // Listeners des événements de clic sur les boutons pour le changement de l'exigence 1 et l'exigence 2
    btn1.addEventListener('click', function () {
        toggleContent(this, btn2, con1, con2);
    });

    btn2.addEventListener('click', function () {
        toggleContent(this, btn1, con2, con1);
    });

    function toggleContent(activeBtn, inactiveBtn, activeCon, inactiveCon) {
        if (!activeBtn.classList.contains('btn-primary')) {
            activeBtn.classList.replace('btn-secondary', 'btn-primary');
            inactiveBtn.classList.replace('btn-primary', 'btn-secondary');
            activeCon.style.display = 'block';
            inactiveCon.style.display = 'none';
        }
    }

    // Exigence 1
    // Ajout de 3 listeners pour l'événement de changement de nucléotide
    document.querySelectorAll('.nucleotide').forEach(element => {
        element.addEventListener('change', function () {
            updateAminoAcidImage();
        });
    });

    // Fonction d'affichage des acides aminés
    function updateAminoAcidImage() {
        let nucleotide1 = document.getElementById('nucleotide1').value;
        let nucleotide2 = document.getElementById('nucleotide2').value;
        let nucleotide3 = document.getElementById('nucleotide3').value;
        let codon = nucleotide1 + nucleotide2 + nucleotide3;
        let aminoAcid = getAminoAcid(codon);
        if (codon.includes("?")) {
            document.getElementById('amino-acid-image').innerHTML = ``;
            document.getElementById('rna-name-1').textContent = "";
        } else {
            document.getElementById('amino-acid-image').innerHTML =
                `<img src="images/${aminoAcid.codonName}.svg" alt="${aminoAcid.codonName}" 
                height="300px" class="bd-placeholder-img card-img-top" width="100%">`;
            document.getElementById('rna-name-1').textContent = aminoAcid.codonName.slice(0, -3) + ' ' + aminoAcid.abbrev;
        }
        document.getElementById('show1').textContent = codon;
    }

    // Exigence 2
    // Input listeners pour éviter que l'utilisateur ne saisisse des données erronées
    input.addEventListener('select', function (event) {
        event.target.setSelectionRange(input.value.length, input.value.length);
    });

    input.addEventListener('click', function () {
        this.selectionStart = this.selectionEnd = this.value.length;
    });

    input.addEventListener('keydown', function (event) {
        if (event.repeat) {
            event.preventDefault();
        }
    });

    input.addEventListener('input', function (e) {
        if (Math.abs(e.target.value.length - (e.target.oldValue || '').length) > 1) {
            e.target.value = e.target.oldValue;
        } else {
            e.target.oldValue = e.target.value;
        }
    });

    input.addEventListener('keydown', function (e) {
        var key = e.key.toUpperCase();
        if (['U', 'C', 'A', 'G', 'BACKSPACE'].indexOf(key) === -1) {
            e.preventDefault();
            alert('La séquence d\'ARN saisie est incorrecte. Veuillez vérifier et saisir à nouveau. Merci :)');
        }
    });

    input.addEventListener('paste', function (e) {
        e.preventDefault();
    });

    // Input listener pour récupérer le contenu saisi par l'utilisateur
    input.addEventListener('input', function (e) {
        const newSeq = this.value.toUpperCase();
        if (curSeq !== newSeq) {
            lstSeq = curSeq;
            curSeq = newSeq;
            displayRNASequence(curSeq, lstSeq, speed);
        }
    });

    // Fonction permettant d'obtenir la vitesse d'animation de l'entrée de l'utilisateur
    rangeInput.addEventListener('input', function () {
        speed = this.value;
    });

    // Fonction maître pour l'affichage des séquences d'ARN
    function displayRNASequence(curSeq, lstSeq, speed) {
        enqueueAction((callback) => {
            const lst = lstSeq ? lstSeq.match(/.{1,3}/g) : [];
            const cur = curSeq ? curSeq.match(/.{1,3}/g) : [];

            // Déterminer si l'affichage de la séquence doit être arrêté
            let stopUpdate = cur.some(codon => getAminoAcid(codon).abbrev == 'STP') && lst.some(codon => getAminoAcid(codon).abbrev == 'STP');

            if (!stopUpdate) {

                // Mettre à jour la séquence pour afficher l'animation
                const displayElement = document.getElementById('rna-display');
                const tableBody = document.querySelector('#amino-acid-table tbody');
                const animationDelay = 6400 / (2 ** speed);

                // En raison des limitations de l'input, chaque changement de séquence n'augmentera ou ne diminuera que d'un bit
                if (curSeq && (!lstSeq || curSeq.length > lstSeq.length)) {
                    // Augmenter un bit
                    handleSeqAddition(cur, displayElement, tableBody, animationDelay);
                }

                if (lstSeq && (!curSeq || curSeq.length < lstSeq.length)) {
                    // Diminuer un bit
                    handleSeqRemoval(cur, displayElement, tableBody, animationDelay);
                }
            }
            callback();
        });
    }

    function handleSeqAddition(cur, displayElement, tableBody, animationDelay) {
        const codon = cur[cur.length - 1];
        const span = createCodonSpan(codon);
        const aminoAcid = getAminoAcid(codon);

        // Traiter différents cas où la longueur du dernier codon est respectivement de 1, 2 et 3
        if (codon.length == 1) {
            tableBody.appendChild(createSpinner());
        } else {
            displayElement.removeChild(displayElement.lastChild);
        }
        displayElement.appendChild(span);

        if (codon.length == 3) {
            const lastSpan = displayElement.lastChild;
            updateSpan(lastSpan, animationDelay);
            updateAminoAcidTableRow(aminoAcid, tableBody.lastChild, animationDelay);
            if (cur.length > 1) {
                const secondLastSpan = displayElement.lastElementChild.previousElementSibling;
                resetSpan(secondLastSpan, animationDelay);
            }
        }
    }

    function handleSeqRemoval(cur, displayElement, tableBody, animationDelay) {

        //Traiter différents cas où la longueur du dernier codon est respectivement de 1, 2 et 3
        displayElement.removeChild(displayElement.lastChild);
        const codon = cur[cur.length - 1];

        if (!codon || codon.length == 3) {
            tableBody.removeChild(tableBody.lastChild);
        } else {
            const span = createCodonSpan(codon);
            const lastSpan = displayElement.lastChild;

            displayElement.appendChild(span);
            if (codon.length == 2) {
                if (curSeq.length > 3) {
                    setTimeout(() => {
                        lastSpan.className = 'btn btn-primary form-label p-1 me-1 transition';
                    }, animationDelay);
                }
                const modify = tableBody.lastChild;
                setTimeout(() => {
                    modify.innerHTML = createSpinner().innerHTML;
                }, animationDelay);
            }
        }
    }

    // S'assurer que les opérations asynchrones sont effectuées de manière séquentielle.
    function processQueue() {
        if (queue.length > 0 && !isProcessing) {
            isProcessing = true;
            let nextAction = queue.shift();
            nextAction(() => {
                isProcessing = false;
                processQueue();
            });
        }
    }

    function enqueueAction(action) {
        queue.push(action);
        processQueue();
    }

    // Fonctions utilisées pour modifier les éléments html afin de compléter l'effet d'animation
    function createCodonSpan(codon) {
        let span = document.createElement('span');
        span.className = 'btn btn-secondary form-label p-1 me-1';
        span.textContent = codon;
        return span;
    }

    function updateSpan(span, delay) {
        setTimeout(() => {
            span.className = 'btn btn-primary form-label p-1 me-1 transition';
        }, delay);
    }

    function resetSpan(span, delay) {
        setTimeout(() => {
            span.className = 'btn btn-secondary form-label p-1 me-1 transition';
        }, delay);
    }

    function updateAminoAcidTableRow(aminoAcid, container, delay) {
        container.innerHTML = `<tr>
                <td class="col-4 col-sm-4">
                    <div class="card shadow-sm card-min-height transition" style="opacity: 0.1;">
                      <div class="card-body d-flex align-items-center justify-content-center">
                        <p class="card-text">${aminoAcid.codonName.slice(0, -3)}</p>
                      </div>
                    </div>
                  </td>
                  <td class="col-2 col-sm-2">
                    <div class="card shadow-sm card-min-height transition" style="opacity: 0.1;">
                      <div class="card-body d-flex align-items-center justify-content-center">
                        <p class="card-text">${aminoAcid.abbrev}</p>
                      </div>
                    </div>
                  </td>
                  <td class="col-6 col-sm-6">
                    <div class="card shadow-sm card-min-height transition" style="opacity: 0.1;">
                      <img class="card-img-top" src="images/${aminoAcid.codonName}.svg" alt="${aminoAcid.codonName}" height="100px">
                    </div>
                  </td>
                </tr>`;
        setTimeout(function () {
            const cards = container.querySelectorAll('.card');
            cards.forEach(card => card.style.opacity = 1);
        }, delay);
    }

    function createSpinner() {
        let tr = document.createElement('tr');
        tr.innerHTML = `
                <td class="col-4 col-sm-4">
                    <div class="card shadow-sm card-min-height transition">
                      <div class="card-body d-flex align-items-center justify-content-center">
                        <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
                            <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </td>
                  <td class="col-2 col-sm-2">
                    <div class="card shadow-sm card-min-height transition">
                      <div class="card-body d-flex align-items-center justify-content-center">
                        <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
                            <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </td>
                  <td class="col-6 col-sm-6">
                    <div class="card shadow-sm card-min-height transition">
                      <div class="card-body d-flex align-items-center justify-content-center">
                        <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
                            <span class="visually-hidden">Loading...</span>
                    </div>
                  </td>
        `;
        return tr;
    }
});
