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

    // Button click event listeners
    btn1.addEventListener('click', function() {
        toggleContent(this, btn2, con1, con2);
    });

    btn2.addEventListener('click', function() {
        toggleContent(this, btn1, con2, con1);
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
            document.getElementById('rna-name-1').textContent="";
        } else {
        document.getElementById('amino-acid-image').innerHTML = `<img src="images/${aminoAcid.name}.svg" alt="${aminoAcid.name}" class="bd-placeholder-img card-img-top" width="100%">`;
        document.getElementById('rna-name-1').textContent= aminoAcid.name.slice(0, -3);
        }
        document.getElementById('show1').textContent=codon;
    }

    function getAminoAcid(codon) {
        return codonTable[codon] || { name: 'Unknown', abbrev: '???' };
    }

    // RNA sequence keyup event listener
    document.getElementById('rna-sequence').addEventListener('keyup', function () {
        displayRNASequence(this.value.toUpperCase());
    });
    
    function displayRNASequence(sequence) {
        // let speed = parseInt(document.getElementById('animation-speed').value);
        document.getElementById('rna-display').innerHTML = '';
        document.querySelector('#amino-acid-table tbody').innerHTML = '';
        for (let i = 0; i < sequence.length; i += 3) {
            let codon = sequence.substr(i, 3);

            // 创建并添加 span 元素
            let span = document.createElement('span');
            span.className = 'bg-info text-white p-1 me-1';
            span.textContent = codon;
            document.getElementById('rna-display').appendChild(span);

            let aminoAcid = getAminoAcid(codon);

            // 创建并添加表格行
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${aminoAcid.name}</td>
                <td>${aminoAcid.abbrev}</td>
                <td><img src="images/${aminoAcid.name}.svg" alt="${aminoAcid.name}" class="img-fluid amino-acid-image"></td>
            `;
            document.querySelector('#amino-acid-table tbody').appendChild(tr);
        }
    }
});
