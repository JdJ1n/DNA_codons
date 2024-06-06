document.addEventListener('DOMContentLoaded', (event) => {
    // Definition de la table des codons
    const codonTable = {
        'AUG': { name: 'MethionineMET', abbrev: 'Met' },
        'UUU': { name: 'PhenylalaninePHE', abbrev: 'Phe' },
        'UUC': { name: 'PhenylalaninePHE', abbrev: 'Phe' },
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

    // Button click event listeners
    btn1.addEventListener('click', function () {
        toggleContent(this, btn2, con1, con2);
    });

    btn2.addEventListener('click', function () {
        toggleContent(this, btn1, con2, con1);
    });

    rangeInput.addEventListener('input', function () {
        speed = this.value;
    });

    // Nucleotide change event listeners
    document.querySelectorAll('.nucleotide').forEach(element => {
        element.addEventListener('change', function () {
            updateAminoAcidImage();
        });
    });

    // Helper functions
    function toggleContent(activeBtn, inactiveBtn, activeCon, inactiveCon) {
        if (!activeBtn.classList.contains('btn-primary')) {
            activeBtn.classList.replace('btn-secondary', 'btn-primary');
            inactiveBtn.classList.replace('btn-primary', 'btn-secondary');
            activeCon.style.display = 'block';
            inactiveCon.style.display = 'none';
        }
    }

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
            document.getElementById('amino-acid-image').innerHTML = `<img src="images/${aminoAcid.name}.svg" alt="${aminoAcid.name}" class="bd-placeholder-img card-img-top" width="100%">`;
            document.getElementById('rna-name-1').textContent = aminoAcid.name.slice(0, -3);
        }
        document.getElementById('show1').textContent = codon;
    }

    function getAminoAcid(codon) {
        return codonTable[codon] || { name: 'Unknown', abbrev: '???' };
    }

    document.getElementById('rna-sequence').addEventListener('keydown', function (e) {
        var key = e.key.toUpperCase();
        if (['U', 'C', 'A', 'G', 'BACKSPACE'].indexOf(key) === -1) {
            e.preventDefault();
            alert('La séquence d\'ARN saisie est incorrecte. Veuillez vérifier et saisir à nouveau. Merci :)');
        }
    });

    document.getElementById('rna-sequence').addEventListener('paste', function (e) {
        e.preventDefault();
    });

    document.getElementById('rna-sequence').addEventListener('input', function (e) {
        const newSeq = this.value.toUpperCase();
        if (curSeq !== newSeq) {
            lstSeq = curSeq;
            curSeq = newSeq;
            displayRNASequence6(curSeq, lstSeq, speed || 1);
        }
    });

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


    function createSpinner() {
        let col = document.createElement('tr');
        col.innerHTML = `
                <td class="col-4 col-sm-4">
                    <div class="card shadow-sm card-min-height">
                      <div class="card-body d-flex align-items-center justify-content-center">
                        <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
                            <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </td>
                  <td class="col-2 col-sm-2">
                    <div class="card shadow-sm card-min-height">
                      <div class="card-body d-flex align-items-center justify-content-center">
                        <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
                            <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </td>
                  <td class="col-6 col-sm-6">
                    <div class="card shadow-sm card-min-height">
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

    function updateAminoAcidTableRow(aminoAcid, container, speed) {
        setTimeout(function () {
            container.innerHTML = `<tr>
                <td class="col-4 col-sm-4">
                    <div class="card shadow-sm card-min-height">
                      <div class="card-body d-flex align-items-center justify-content-center">
                        <p class="card-text">${aminoAcid.name}</p>
                      </div>
                    </div>
                  </td>
                  <td class="col-2 col-sm-2">
                    <div class="card shadow-sm card-min-height">
                      <div class="card-body d-flex align-items-center justify-content-center">
                        <p class="card-text">${aminoAcid.abbrev}</p>
                      </div>
                    </div>
                  </td>
                  <td class="col-6 col-sm-6">
                    <div class="card shadow-sm card-min-height">
                      <img class="card-img-top" src="images/${aminoAcid.name}.svg" alt="${aminoAcid.name}" height="225px">
                    </div>
                  </td>
                  </tr>
          `;
        }, 3200 / (2 ** speed));
    }

    function displayRNASequence6(curSeq, lstSeq, speed) {
        console.log('curSeq: ', curSeq, 'lstSeq: ', lstSeq); 
        (function (capturedCurSeq, capturedLstSeq, capturedSpeed) {
            console.log('capturedCurSeq: ', capturedCurSeq, 'lstSeq: ', capturedLstSeq); 
            enqueueAction((callback) => {

                const displayElement = document.getElementById('rna-display');
                const tableBody = document.querySelector('#amino-acid-table tbody');
                const cur = capturedCurSeq ? capturedCurSeq.match(/.{1,3}/g) : [];
                const lst = capturedLstSeq ? capturedLstSeq.match(/.{1,3}/g) : [];
                const animationDelay = 3200 / (2 ** capturedSpeed);

                if (capturedCurSeq && (!capturedLstSeq || capturedCurSeq.length > capturedLstSeq.length)) {
                    if (capturedCurSeq.length % 3 != 1) {
                        displayElement.removeChild(displayElement.lastChild);
                    }
                    let codon = cur[cur.length - 1];
                    let span = createCodonSpan(codon);

                    if (codon.length == 1) {
                        setTimeout(() => tableBody.appendChild(createSpinner()), animationDelay);
                    }

                    let aminoAcid = getAminoAcid(codon);
                    if (codon.length == 3) {
                        if (capturedCurSeq.length > 5) {
                            var children = displayElement.children;
                            for (var i = 0; i < children.length; i++) {
                                children[i].className = 'btn btn-secondary form-label p-1 me-1';
                            }
                        }
                        setTimeout(() => {
                            span.className = 'btn btn-primary form-label p-1 me-1 transition';
                            updateAminoAcidTableRow(aminoAcid, tableBody.lastChild, capturedSpeed);
                        }, animationDelay);
                    }
                    displayElement.appendChild(span);
                }

                if (capturedLstSeq && (!capturedCurSeq || capturedCurSeq.length < capturedLstSeq.length)) {
                    displayElement.removeChild(displayElement.lastChild);
                    if (lst[lst.length - 1].length == 1) {
                        setTimeout(() => {
                            tableBody.removeChild(tableBody.lastChild);
                        }, animationDelay);
                    }
                    let codon = cur[cur.length - 1];
                    if (capturedLstSeq.length % 3 != 1) {
                        let span = createCodonSpan(codon);
                        let lastele = displayElement.lastChild;

                        if (codon.length == 2 && capturedCurSeq.length > 3) {
                            setTimeout(() => {
                                lastele.className = 'btn btn-primary form-label p-1 me-1 transition';
                            }, animationDelay);
                        }
                        displayElement.appendChild(span);
                    }

                    if (codon && codon.length == 2) {
                        let modify = tableBody.lastChild;
                        setTimeout(() => {
                            modify.innerHTML = createSpinner().innerHTML;
                        }, animationDelay);
                    }
                }
                callback();
            });
        })(curSeq, lstSeq, speed);
    }
});
