document.addEventListener('DOMContentLoaded', (event) => {
    // Definition de la table des codons
    // str.slice(0, -3);
    // str.slice(-3);
    const codonTable = {
        'AUG': { codonName: 'MethionineMET', abbrev: "Met" },
        'UUU': { codonName: 'PhenylalaninePHE', abbrev: 'Phe' },
        'UUC': { codonName: 'PhenylalaninePHE', abbrev: 'Phe' },
        // Add other codon mappings
    };

    // Initialize button and content variables
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

    // Button click event listeners to switch function1 and function2
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

    // exigence 1
    // Nucleotide change event listeners
    document.querySelectorAll('.nucleotide').forEach(element => {
        element.addEventListener('change', function () {
            updateAminoAcidImage();
        });
    });

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
                `<img src="images/${aminoAcid.codonName}.svg" alt="${aminoAcid.codonName}" class="bd-placeholder-img card-img-top" width="100%">`;
            document.getElementById('rna-name-1').textContent = aminoAcid.codonName.slice(0, -3);
        }
        document.getElementById('show1').textContent = codon;
    }

    function getAminoAcid(codon) {
        return codonTable[codon] || { codonName: 'Unknown', abbrev: '???' };
    }

    //exigence 2
    //input listeners to prevent incorrect input by user
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

    //main listener
    input.addEventListener('input', function (e) {
        const newSeq = this.value.toUpperCase();
        if (curSeq !== newSeq) {
            lstSeq = curSeq;
            curSeq = newSeq;
            displayRNASequence6(curSeq, lstSeq, speed);
        }
    });

    // update the speed that user specify
    rangeInput.addEventListener('input', function () {
        speed = this.value;
    });

    // main function for function 2
    function displayRNASequence6(curSeq, lstSeq, speed) {
        //console.log('curSeq: ', curSeq, 'lstSeq: ', lstSeq); 
        (function (capturedCurSeq, capturedLstSeq, capturedSpeed) {
            //console.log('capturedCurSeq: ', capturedCurSeq, 'lstSeq: ', capturedLstSeq); 
            enqueueAction((callback) => {

                const cur = capturedCurSeq ? capturedCurSeq.match(/.{1,3}/g) : [];

                //add if bloc here to check the situation of STOP

                const displayElement = document.getElementById('rna-display');
                const tableBody = document.querySelector('#amino-acid-table tbody');
                const animationDelay = 6400 / (2 ** capturedSpeed);

                // added char to Seq
                if (capturedCurSeq && (!capturedLstSeq || capturedCurSeq.length > capturedLstSeq.length)) {

                    const codon = cur[cur.length - 1];
                    const span = createCodonSpan(codon);
                    const aminoAcid = getAminoAcid(codon);

                    if (codon.length == 1) {
                        //need to add 1 spinner for the table
                        tableBody.appendChild(createSpinner());
                    } else {
                        // (codon from 1 bit to 2 bits) or (from 2 bits to 3 bits)
                        // we dont change the last span already exist, but remove the original one and then add a new span
                        displayElement.removeChild(displayElement.lastChild);
                    }
                    displayElement.appendChild(span);

                    if (codon.length == 3) {
                        //update and apply animations if a new codon is completed
                        const lastSpan = displayElement.lastChild;
                        updateSpan(lastSpan, animationDelay);
                        updateAminoAcidTableRow(aminoAcid, tableBody.lastChild, animationDelay);
                        //reset the style of previous span 
                        if (cur.length > 1) {
                            const secondLastSpan = displayElement.lastElementChild.previousElementSibling;
                            resetSpan(secondLastSpan, animationDelay);
                        }
                    }
                }

                //remove char from Seq
                if (capturedLstSeq && (!capturedCurSeq || capturedCurSeq.length < capturedLstSeq.length)) {
                    // remove the last span
                    displayElement.removeChild(displayElement.lastChild);

                    const codon = cur[cur.length - 1];
                    //if codon doesn't exist(empty Seq) or current codon has 3 bits, means we need to remove the last line of table.
                    if (!codon || codon.length == 3) {
                        tableBody.removeChild(tableBody.lastChild);
                    } else {
                        //otherwise we change the last line and the last span
                        const span = createCodonSpan(codon);
                        const lastSpan = displayElement.lastChild;
                        displayElement.appendChild(span);
                        if (codon.length == 2) {
                            //(codon from 3 bits to 2 bits), reset the last completed span
                            if (capturedCurSeq.length > 3) {
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
                callback();
            });
        })(curSeq, lstSeq, speed);
    }

    function createSpinner() {
        let col = document.createElement('tr');
        col.innerHTML = `
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
        return col;
    }

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
                        <p class="card-text">${aminoAcid.codonName}</p>
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
});
