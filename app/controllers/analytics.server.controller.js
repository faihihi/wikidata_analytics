/**
 * survey.server.controller.js
 *
 * This controller module exposes two methods:
 *  - showForm is used for displaying the form
 *  - showResult is used for showing the results
 * The methods are not mapped to URL yet
 */

var express = require('express');

module.exports.showForm = function(req, res) {
    products = req.app.locals.products;
    res.render('index.ejs');
};
