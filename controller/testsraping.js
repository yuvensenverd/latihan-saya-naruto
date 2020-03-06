'use strict';

// require('colors');
// const request = require('request');
// const cheerio = require('cheerio');

// let url = 'https://referensi.data.kemdikbud.go.id/tabs.php?npsn=20104477';

// request(url, function (err, res, body) {
//     if (err && res.statusCode !== 200) throw err;

//     let $ = cheerio.load(body);
//     $('table').each((i, value) => {
//         $(value).find('td').each((j, data) => {
//             return process.stdout.write($(data).text() + '\t');
//         });
//         process.stdout.write('\n');
//     });
// });

const scrapeIt = require("scrape-it")

// Promise interface
scrapeIt("https://referensi.data.kemdikbud.go.id/tabs.php?npsn=20100159", {
    nama: "#tabs-6 tr td"
//   , desc: ".header h2"
//   , avatar: {
//         selector: ".header img"
//       , attr: "src"
//     }
}).then(({ data, response }) => {
    console.log(`Status Code: ${response.statusCode}`)
    console.log(data.nama.split(":"))
})

// let url2 = 'https://jadwalsholat.org/adzan/monthly.php?id=307';

// request(url2, function (err, res, body) {
//     if (err && res.statusCode !== 200) throw err;

//     let $ = cheerio.load(body);
//     $('table.table_adzan tr[align=center]').each((i, value) => {
//         $(value).find('td').each((j, data) => {
//             if ($(value).attr('class') === 'table_highlight')
//                 return process.stdout.write($(data).text().red + '\t');
//             return process.stdout.write($(data).text() + '\t');
//         });
//         process.stdout.write('\n');
//     });
// });