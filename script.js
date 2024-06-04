$(document).ready(function () {
    // 定义密码子表
    const codonTable = {
        'AUG': { name: 'Methionine', abbrev: 'Met' },
        'UUU': { name: 'Phenylalanine', abbrev: 'Phe'},
        'UUC': { name: 'Phenylalanine', abbrev: 'Phe' },
        // 添加其他密码子映射
    };

    // Part 1: Select Nucleotides
    $('.nucleotide').change(function () {
        let nucleotide1 = $('#nucleotide1').val();
        let nucleotide2 = $('#nucleotide2').val();
        let nucleotide3 = $('#nucleotide3').val();
        let codon = nucleotide1 + nucleotide2 + nucleotide3;
        
        let aminoAcid = getAminoAcid(codon);
        $('#amino-acid-image').html(`<img src="images/${aminoAcid.name}.png" alt="${aminoAcid.name}" class="amino-acid-image">`);
    });

    // Part 2: Enter RNA Sequence
    $('#rna-sequence').keyup(function () {
        let rnaSequence = $('#rna-sequence').val().toUpperCase();
        $('#rna-display').html('');
        $('#amino-acid-table tbody').html('');
        displayRNASequence(rnaSequence);
    });

    function getAminoAcid(codon) {
        return codonTable[codon] || { name: 'Unknown', abbrev: '???' };
    }

    function displayRNASequence(sequence) {
        let speed = parseInt($('#animation-speed').val());
        for (let i = 0; i < sequence.length; i += 3) {
            let codon = sequence.substr(i, 3);
            $('#rna-display').append(`<span>${codon}</span>`);
            setTimeout(function () {
               
                let aminoAcid = getAminoAcid(codon);
                $('#amino-acid-table tbody').append(
                    `<tr>
                        <td>${aminoAcid.name}</td>
                        <td>${aminoAcid.abbrev}</td>
                        <td><img src="images/${aminoAcid.name}.png" alt="${aminoAcid.name}" class="amino-acid-image"></td>
                    </tr>`
                );
            }, i * speed);
        }
    }
});