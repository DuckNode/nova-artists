'use strict';
const express = require('express');
const router = express.Router();
const getRSSFeed = require('simple-get');
const convertXMLtoJSON = require('xml2js').parseString;
const jsonQuery = require('jsonpath');
const cheerio = require('cheerio');

router.get('/', function (req, res, next) {
    getRSSFeed.concat('https://novaartistsblog.wordpress.com/feed/', function (err, resp, data) {
        if (err) throw err;
        convertXMLtoJSON(data, function (err, result) {
            if (err) throw err;

            let items;
            if (req.query.category) {
                items = jsonQuery.query(result, '$..item[?(@.category=="' + req.query.category + '")]').sort(compareAlphabetically);
            }
            else {
                items = jsonQuery.query(result, '$..item')[0];
            }

            res.render('actors', {
                title: req.query.category.charAt(0).toUpperCase() + req.query.category.slice(1) + ' Actors',
                items: items,
                category: req.query.category
            });
        });
    });
});

router.get('/:id', function (req, res, next) {
    getRSSFeed.concat('https://novaartistsblog.wordpress.com/feed/', function (err, resp, data) {
        if (err) throw err;
        convertXMLtoJSON(data, function (err, rssToJsonResult) {
            if (err) throw err;

            let item;
            if (req.query.category) {
                const items = jsonQuery.query(rssToJsonResult, '$..item[?(@.category== "' + req.query.category + '")]').sort(compareAlphabetically);
                item = items[parseInt(req.params.id)];
            }
            else {
                const items = jsonQuery.query(rssToJsonResult, '$..item');
                item = items[parseInt(req.params.id)];
            }

            const profilePicture = item['media:content'][0].$.url;
            const $ = cheerio.load(item['content:encoded'][0]);
            const filmTable = $.html('table#filmTable');
            const theatreTable = $.html('table#theatreTable');
            const profileDetails = $.html('div#profileDetails');
            const training = $.html('div#training');

            res.render('actor', {
                title: item.category[0].charAt(0).toUpperCase() + item.category[0].slice(1) + ' Actors',
                item: item,
                profilePicture: profilePicture,
                profileDetails: profileDetails,
                filmTable: filmTable,
                theatreTable: theatreTable,
                training: training,
            });
        });
    });
});

function compareAlphabetically(a, b) {
    const namesA = a.title[0].split(' ');
    const namesB = b.title[0].split(' ');
    const surnameA = namesA[namesA.length - 1].toUpperCase();
    const surnameB = namesB[namesB.length - 1].toUpperCase();
    if (surnameA < surnameB) {
        return -1;
    }
    if (surnameA > surnameB) {
        return 1;
    }
    // names must be equal
    return 0;
}

module.exports = router;
