document.addEventListener('DOMContentLoaded', (event) => {
    // Define the codon table
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
    var curSeq;
    var lstSeq;
    var input = document.getElementById('rna-sequence');
    var clear = document.getElementById('clear');

    clear.addEventListener('click', function () {
        input.clear;
    });

    input.addEventListener('select', function (event) {
        event.target.setSelectionRange(input.value.length, input.value.length);
    });

    input.addEventListener('click', function () {
        this.selectionStart = this.selectionEnd = this.value.length;
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


    // RNA sequence input event listener
    document.getElementById('rna-sequence').addEventListener('input', function (e) {
        if (curSeq != this.value.toUpperCase()) {
            lstSeq = curSeq;
            curSeq = this.value.toUpperCase();
        }
        displayRNASequence5(curSeq, lstSeq);
    });

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function displayRNASequence(curSeq, lstSeq) {
        let displayElement = document.getElementById('rna-display');
        let tableBody = document.querySelector('#amino-acid-table tbody');
        let cur = curSeq ? curSeq.match(/.{1,3}/g) : [];
        let lst = lstSeq ? lstSeq.match(/.{1,3}/g) : [];

        if (curSeq && (!lstSeq || curSeq.length > lstSeq.length)) {
            if (curSeq.length % 3 != 1) {
                displayElement.removeChild(displayElement.lastChild);
                tableBody.removeChild(tableBody.lastChild);
            }
            let codon = cur[cur.length - 1];
            let span = document.createElement('span');
            span.className = 'btn btn-secondary form-label p-1 me-1';
            span.textContent = codon;
            if (codon.length == 3) {
                if (curSeq.length > 5) { displayElement.lastChild.className = 'btn btn-secondary form-label p-1 me-1'; }
                setTimeout(function () {
                    span.className = 'btn btn-primary form-label p-1 me-1 transition';
                }, 3200 / (2 ** speed)); // animation

            }

            displayElement.appendChild(span);

            let aminoAcid = getAminoAcid(codon);
            let tr = document.createElement('tr');

            setTimeout(function () {
                tr.innerHTML = `
                <td>${aminoAcid.name}</td>
                <td>${aminoAcid.abbrev}</td>
                <td><img src="images/${aminoAcid.name}.svg" alt="${aminoAcid.name}" class="img-fluid amino-acid-image"></td>
            `;
            }, 3200 / (2 ** speed)); // animation
            tableBody.appendChild(tr);

        }

        if (lstSeq && (!curSeq || curSeq.length < lstSeq.length)) {
            displayElement.removeChild(displayElement.lastChild);
            tableBody.removeChild(tableBody.lastChild);
            if (lstSeq.length % 3 != 1) {
                let codon = cur[cur.length - 1];
                let span = document.createElement('span');
                span.className = 'btn btn-secondary form-label p-1 me-1';
                span.textContent = codon;
                let lastele = displayElement.lastChild;
                if (codon.length == 2 && curSeq.length > 3) {
                    setTimeout(function () {
                        lastele.className = 'btn btn-primary form-label p-1 me-1 transition';
                    }, 3200 / (2 ** speed));
                }
                displayElement.appendChild(span);

                let aminoAcid = getAminoAcid(codon);
                let tr = document.createElement('tr');
                setTimeout(function () {
                    tr.innerHTML = `
                <td>${aminoAcid.name}</td>
                <td>${aminoAcid.abbrev}</td>
                <td><img src="images/${aminoAcid.name}.svg" alt="${aminoAcid.name}" class="img-fluid amino-acid-image"></td>
            `;
                }, 3200 / (2 ** speed)); // animation
                tableBody.appendChild(tr);
            }

        }
    }


    function displayRNASequence2(sequence) {
        // let speed = parseInt(document.getElementById('animation-speed').value);
        document.getElementById('rna-display').innerHTML = '';
        document.querySelector('#amino-acid-table tbody').innerHTML = '';
        for (let i = 0; i < sequence.length; i++) {
            let codon = sequence[i];

            let span = document.createElement('span');
            span.className = 'bg-info text-white p-1 me-1';
            span.textContent = codon;
            document.getElementById('rna-display').appendChild(span);

            let aminoAcid = getAminoAcid(codon);

            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${aminoAcid.name}</td>
                <td>${aminoAcid.abbrev}</td>
                <td><img src="images/${aminoAcid.name}.svg" alt="${aminoAcid.name}" class="img-fluid amino-acid-image"></td>
            `;
            document.querySelector('#amino-acid-table tbody').appendChild(tr);
        }
    }

    function displayRNASequence3(sequence, lastSeq) {
        // let speed = parseInt(document.getElementById('animation-speed').value);
        document.getElementById('rna-display').innerHTML = '';
        document.querySelector('#amino-acid-table tbody').innerHTML = '';
        sequence = sequence.match(/.{1,3}/g);
        for (let i = 0; i < sequence.length; i++) {
            let codon = sequence[i];

            let span = document.createElement('span');
            span.className = 'p-1 me-1';
            span.textContent = codon;
            document.getElementById('rna-display').appendChild(span);

            if ((i === sequence.length - 1 && codon.length === 3) ||
                (i === sequence.length - 2 && sequence[sequence.length - 1].length < 3)) {
                setTimeout(function () {
                    span.className = 'btn btn-primary form-label p-1 me-1 transition';
                }, 3200 / (2 ** speed)); // animation
            }

            let aminoAcid = getAminoAcid(codon);

            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${aminoAcid.name}</td>
                <td>${aminoAcid.abbrev}</td>
                <td><img src="images/${aminoAcid.name}.svg" alt="${aminoAcid.name}" class="img-fluid amino-acid-image"></td>
            `;
            document.querySelector('#amino-acid-table tbody').appendChild(tr);
        }
    }

    function displayRNASequence5(curSeq, lstSeq) {
        let displayElement = document.getElementById('rna-display');
        let cardsContainer = document.getElementById('amino-acid-cards');
        let cur = curSeq ? curSeq.match(/.{1,3}/g) : [];
        let lst = lstSeq ? lstSeq.match(/.{1,3}/g) : [];

        if (curSeq && (!lstSeq || curSeq.length > lstSeq.length)) {
            if (curSeq.length % 3 != 1) {
                displayElement.removeChild(displayElement.lastChild);
                //cardsContainer.removeChild(cardsContainer.lastChild);
            }
            let codon = cur[cur.length - 1];
            let span = document.createElement('span');
            span.className = 'btn btn-secondary form-label p-1 me-1';
            span.textContent = codon;

            let col = document.createElement('div');
            col.className = 'col';
            if (codon.length == 1) {
                setTimeout(function () {
                    col.innerHTML = `
                <div class="card shadow-sm">
                    <div class="d-flex justify-content-center py-5">
                        <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            `;
                }, 3200 / (2 ** speed));
                // Loading state
                cardsContainer.appendChild(col);
            }
            let aminoAcid = getAminoAcid(codon);
            if (codon.length == 3) {
                if (curSeq.length > 5) { displayElement.lastChild.className = 'btn btn-secondary form-label p-1 me-1'; }
                setTimeout(function () {
                    span.className = 'btn btn-primary form-label p-1 me-1 transition';
                }, 3200 / (2 ** speed)); // animation
                let modify = cardsContainer.lastChild;

                setTimeout(function () {
                    modify.innerHTML = `
                    <div class="card shadow-sm">
                        <img class="bd-placeholder-img card-img-top" width="100%" height="225" src="images/${aminoAcid.name}.svg" alt="${aminoAcid.name}">
                        <div class="card-body">
                            <p class="card-text">${aminoAcid.name}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                                </div>
                                <small class="text-body-secondary">${aminoAcid.abbrev}</small>
                            </div>
                        </div>
                    </div>
                    `;
                }, 3200 / (2 ** speed)); // animation

            }
            displayElement.appendChild(span);
        }

        if (lstSeq && (!curSeq || curSeq.length < lstSeq.length)) {
            displayElement.removeChild(displayElement.lastChild);
            if (lst[lst.length - 1].length == 1) {
                setTimeout(function () {
                    cardsContainer.removeChild(cardsContainer.lastChild);
                }, 3200 / (2 ** speed)); // animation
            }
            let codon = cur[cur.length - 1];
            if (lstSeq.length % 3 != 1) {

                let span = document.createElement('span');
                span.className = 'btn btn-secondary form-label p-1 me-1';
                span.textContent = codon;
                let lastele = displayElement.lastChild;


                let aminoAcid = getAminoAcid(codon);
                let col = document.createElement('div');
                col.className = 'col';
                if (codon.length == 2 && curSeq.length > 3) {
                    setTimeout(function () {
                        lastele.className = 'btn btn-primary form-label p-1 me-1 transition';
                    }, 3200 / (2 ** speed));
                }
                displayElement.appendChild(span);
            }

            if (codon.length == 2) {
                let modifi = cardsContainer.lastChild;
                setTimeout(function () {
                    modifi.innerHTML = `
                        <div class="card shadow-sm">
                            <div class="d-flex justify-content-center py-5">
                                <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    `;
                }, 3200 / (2 ** speed)); // animation
            }

        }
    }

});
