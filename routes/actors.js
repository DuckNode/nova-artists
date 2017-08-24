'use strict';
const express = require('express');
const router = express.Router();
const getRSSFeed = require('simple-get');
const convertXMLtoJSON = require('xml2js').parseString;
const jsonQuery = require('jsonpath');
const cheerio = require('cheerio');
const winston = require('winston');

winston.info('logging working in actors.js');

router.get('/', function (req, res, next) {
    getRSSFeed.concat('https://novaartistsblog.wordpress.com/feed/', function (feedError, resp, data) {
        if (feedError) {
            winston.error('getRSSFeed.concat %j', { feedError });
            throw feedError;
        }
        convertXMLtoJSON(data, function (convertError, result) {
            if (convertError) {
                winston.error('convertXMLtoJSON %j', { convertError });
                throw convertError;
            }

            let items;
            if (req.query.category) { // query by category
                items = jsonQuery.query(result, '$..item[?(@.category=="' + req.query.category + '")]').sort(compareAlphabetically);
            }
            else { // get all items - probably redundant as there is currently only category based search pages
                items = jsonQuery.query(result, '$..item').sort(compareAlphabetically);
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
    getRSSFeed.concat('https://novaartistsblog.wordpress.com/feed/', function (feedError, resp, data) {
        if (feedError) {
            winston.error('getRSSFeed.concat %j', { feedError });
            throw feedError;
        }
        convertXMLtoJSON(data, function (convertError, rssToJsonResult) {
            if (convertError) {
                winston.error('convertXMLtoJSON %j', { convertError });
                throw convertError;
            }

            let item; 
            if (req.query.category) { // need to query by category when finding a single item so we can match the index position clicked on the Male/Female search page.
                                      // this if..else could be reduced to single query with better search/drill mechanism.
                const items = jsonQuery.query(rssToJsonResult, '$..item[?(@.category== "' + req.query.category + '")]').sort(compareAlphabetically);
                item = items[parseInt(req.params.id)];
            }
            else { // probably redundant as there is currently only category based search pages
                const items = jsonQuery.query(rssToJsonResult, '$..item');
                item = items[parseInt(req.params.id)];
            }

            const profilePicture = item['media:content'][0].$.url + '?quality=100&strip=info&w=500';
            const $ = cheerio.load(item['content:encoded'][0]);
            const profileDetails = $.html('div#profileDetails');
            const stageTable = $.html('table#stageTable');
            const filmTable = $.html('table#filmTable');
            const tvTable = $.html('table#tvTable');
            const voiceTable = $.html('table#voiceTable');

            res.render('actor', {
                title: item.category[0].charAt(0).toUpperCase() + item.category[0].slice(1) + ' Actors',
                item: item,
                profilePicture: profilePicture,
                profileDetails: profileDetails,
                stageTable: stageTable,
                filmTable: filmTable,
                tvTable: tvTable,
                voiceTable: voiceTable,
                category: req.query.category
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
