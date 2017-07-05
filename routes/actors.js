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

            const items = jsonQuery.query(result, '$..item')[0];
            
            res.render('actors', {
                title: 'Actors',
                items: items
            });
        });
    });
});

router.get('/:id', function (req, res, next) {
    getRSSFeed.concat('https://novaartistsblog.wordpress.com/feed/', function (err, resp, data) {
        if (err) throw err;
        convertXMLtoJSON(data, function (err, rssToJsonResult) {
            if (err) throw err;
            
            const item = jsonQuery.query(rssToJsonResult, '$..item')[0][parseInt(req.params.id)];
            const profilePicture = item['media:content'][0].$.url;
            const $ = cheerio.load(item['content:encoded'][0]);
            const filmTable = $.html('table#filmTable');
            const theatreTable = $.html('table#theatreTable');
            const profileDetails = $.html('div#profileDetails');
            const training = $.html('div#training');
            
            res.render('actor', { 
                title: 'Actor Profile',
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

module.exports = router;
