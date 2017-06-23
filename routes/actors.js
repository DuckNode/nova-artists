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
                title: 'All actors',
                items: items,
                foobar: '<b>this text is html and bold</b>',
                img: 'https://professionaldee.files.wordpress.com/2015/01/capture1.png'
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
            const $ = cheerio.load(item['content:encoded'][0]);
            const filmTable = $.html('table#filmTable');
            const theatreTable = $.html('table#theatreTable');
            
            res.render('actor', {
                title: 'Single Actor',
                filmTable: filmTable,
                theatreTable: theatreTable,
                item: item,
                img: 'https://professionaldee.files.wordpress.com/2015/01/capture1.png'
            });
        });
    });
});

module.exports = router;
