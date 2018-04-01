const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');


const HORRAIRE_URL = 'https://www.etsmtl.ca/horaires-bac';

const PROGRAM_MAPPING = {
    "Enseignements généraux" : "Gen",
    "Génie de la construction" : "Ctn",
    "Génie électrique" : "Ele",
    "Génie logiciel" : "Log",
    "Génie mécanique" : "Mec",
    "Génie des opérations et de la logistique" : "Ops",
    "Génie de la production automatisée" : "Aut",
    "Génie des technologies de l'information" : "Tin"
}

request({url: HORRAIRE_URL}, (err, res, body) => {
    const $ = cheerio.load(body);

    let tableau = $(".etsTableauDonnees").first();
    let tr = tableau.find("tr");

    let pdfLinks = {};
    for(let i = 1; i < tr.length; i++){
        let row = tr[i];
        let td = $(row).find("td");

        let prog = $(td[0]).find("strong").text().trim();
        prog = PROGRAM_MAPPING[prog];
        let url = $(td[2]).find("a").attr("href");
        
        pdfLinks[prog] = url;
    }

    for(let prog in pdfLinks) {
        request(pdfLinks[prog]).pipe(fs.createWriteStream(`pdfs/Horraire_${prog}_H18.pdf`))
    }
});


