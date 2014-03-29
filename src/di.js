// Heavily inspired by Angular 2.0 dependency injection

"use strict";

var annotations = require('./annotations');
var injector =  require('./injector');

var di = {};

di.Injector = injector.Injector;
di.annotate = annotations.annotate;
di.readAnnotations = annotations.readAnnotations;

module.exports = di;