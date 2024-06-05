const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://cses.fi/problemset/';

const headings = [];
let problems = {};

axios
    .get(url)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);

        $('h2').each((i, elem) => {
          headings.push($(elem).text());
        });
    
        $('ul').each((i, elem) => {
            if(i > 1){
                const prob = [];
                $(elem).find('a').each((index, elem) => {
                    prob.push({
                        title : $(elem).text() ,
                        link : "https://cses.fi/problemset" + $(elem).attr('href')
                    });
                });
                problems[headings[i-1]] = prob;
            } 
        });

        fs.writeFile('ProblemsList.txt', headings.toString(), (err) => {
            if (err) console.error(err);
            console.log('Problems List File has been created');
        });

        fs.writeFile('csesProblems.json', JSON.stringify(problems, null, 4), (err) => {
            if (err) console.error(err);
            console.log('File has been created');
        });
    })
    .catch(console.error);



